import { lookup } from '@/common/filters/filters'

const _saveAs = (function (view) {
  // IE <10 is explicitly unsupported
  if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
    return;
  }
  let doc = view.document
    // only get URL when necessary in case Blob.js hasn't overridden it yet
    ,
    get_URL = function () {
      return view.URL || view.webkitURL || view;
    },
    save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"),
    can_use_save_link = "download" in save_link,
    click = function (node) {
      let event = doc.createEvent("MouseEvents");
      event.initMouseEvent(
        "click", true, false, view, 0, 0, 0, 0, 0, false, false, false, false, 0, null
      );
      node.dispatchEvent(event);
    },
    webkit_req_fs = view.webkitRequestFileSystem,
    req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem,
    throw_outside = function (ex) {
      (view.setImmediate || view.setTimeout)(function () {
        throw ex;
      }, 0);
    },
    force_saveable_type = "application/octet-stream",
    fs_min_size = 0
    // See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
    // https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
    // for the reasoning behind the timeout and revocation flow
    ,
    arbitrary_revoke_timeout = 500 // in ms
    ,
    revoke = function (file) {
      let revoker = function () {
        if (typeof file === "string") { // file is an object URL
          get_URL().revokeObjectURL(file);
        } else { // file is a File
          file.remove();
        }
      };
      if (view.chrome) {
        revoker();
      } else {
        setTimeout(revoker, arbitrary_revoke_timeout);
      }
    },
    dispatch = function (filesaver, event_types, event) {
      event_types = [].concat(event_types);
      let i = event_types.length;
      while (i--) {
        let listener = filesaver["on" + event_types[i]];
        if (typeof listener === "function") {
          try {
            listener.call(filesaver, event || filesaver);
          } catch (ex) {
            throw_outside(ex);
          }
        }
      }
    },
    auto_bom = function (blob) {
      // prepend BOM for UTF-8 XML and text/* types (including HTML)
      if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
        return new Blob(["\ufeff", blob], {
          type: blob.type
        });
      }
      return blob;
    },
    FileSaver = function (blob, name) {
      blob = auto_bom(blob);
      // First try a.download, then web filesystem, then object URLs
      let
        filesaver = this,
        type = blob.type,
        blob_changed = false,
        object_url, target_view, dispatch_all = function () {
          dispatch(filesaver, "writestart progress write writeend".split(" "));
        }
        // on any filesys errors revert to saving with object URLs
        ,
        fs_error = function () {
          // don't create more object URLs than needed
          if (blob_changed || !object_url) {
            object_url = get_URL().createObjectURL(blob);
          }
          if (target_view) {
            target_view.location.href = object_url;
          } else {
            let new_tab = view.open(object_url, "_blank");
            if (new_tab === undefined && typeof safari !== "undefined") {
              //Apple do not allow window.open, see http://bit.ly/1kZffRI
              view.location.href = object_url;
            }
          }
          filesaver.readyState = filesaver.DONE;
          dispatch_all();
          revoke(object_url);
        },
        abortable = function (func) {
          return function () {
            if (filesaver.readyState !== filesaver.DONE) {
              return func.apply(this, arguments);
            }
          };
        },
        create_if_not_found = {
          create: true,
          exclusive: false
        },
        slice;
      filesaver.readyState = filesaver.INIT;
      if (!name) {
        name = "download";
      }
      if (can_use_save_link) {
        object_url = get_URL().createObjectURL(blob);
        save_link.href = object_url;
        save_link.download = name;
        click(save_link);
        filesaver.readyState = filesaver.DONE;
        dispatch_all();
        revoke(object_url);
        return;
      }
      // Object and web filesystem URLs have a problem saving in Google Chrome when
      // viewed in a tab, so I force save with application/octet-stream
      // http://code.google.com/p/chromium/issues/detail?id=91158
      // Update: Google errantly closed 91158, I submitted it again:
      // https://code.google.com/p/chromium/issues/detail?id=389642
      if (view.chrome && type && type !== force_saveable_type) {
        slice = blob.slice || blob.webkitSlice;
        blob = slice.call(blob, 0, blob.size, force_saveable_type);
        blob_changed = true;
      }
      // Since I can't be sure that the guessed media type will trigger a download
      // in WebKit, I append .download to the filename.
      // https://bugs.webkit.org/show_bug.cgi?id=65440
      if (webkit_req_fs && name !== "download") {
        name += ".download";
      }
      if (type === force_saveable_type || webkit_req_fs) {
        target_view = view;
      }
      if (!req_fs) {
        fs_error();
        return;
      }
      fs_min_size += blob.size;
      req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) {
        fs.root.getDirectory("saved", create_if_not_found, abortable(function (dir) {
          let save = function () {
            dir.getFile(name, create_if_not_found, abortable(function (file) {
              file.createWriter(abortable(function (writer) {
                writer.onwriteend = function (event) {
                  target_view.location.href = file.toURL();
                  filesaver.readyState = filesaver.DONE;
                  dispatch(filesaver, "writeend", event);
                  revoke(file);
                };
                writer.onerror = function () {
                  let error = writer.error;
                  if (error.code !== error.ABORT_ERR) {
                    fs_error();
                  }
                };
                "writestart progress write abort".split(" ").forEach(function (event) {
                  writer["on" + event] = filesaver["on" + event];
                });
                writer.write(blob);
                filesaver.abort = function () {
                  writer.abort();
                  filesaver.readyState = filesaver.DONE;
                };
                filesaver.readyState = filesaver.WRITING;
              }), fs_error);
            }), fs_error);
          };
          dir.getFile(name, {
            create: false
          }, abortable(function (file) {
            // delete file if it already exists
            file.remove();
            save();
          }), abortable(function (ex) {
            if (ex.code === ex.NOT_FOUND_ERR) {
              save();
            } else {
              fs_error();
            }
          }));
        }), fs_error);
      }), fs_error);
    },
    FS_proto = FileSaver.prototype,
    saveAs = function (blob, name) {
      return new FileSaver(blob, name);
    };
  // IE 10+ (native saveAs)
  if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
    return function (blob, name) {
      return navigator.msSaveOrOpenBlob(auto_bom(blob), name);
    };
  }

  FS_proto.abort = function () {
    let filesaver = this;
    filesaver.readyState = filesaver.DONE;
    dispatch(filesaver, "abort");
  };
  FS_proto.readyState = FS_proto.INIT = 0;
  FS_proto.WRITING = 1;
  FS_proto.DONE = 2;

  FS_proto.error =
    FS_proto.onwritestart =
    FS_proto.onprogress =
    FS_proto.onwrite =
    FS_proto.onabort =
    FS_proto.onerror =
    FS_proto.onwriteend =
    null;

  return saveAs;
}(window));

/**
 * Get the file name for an exported file.
 *
 * @param {object}  config       Button configuration
 * @param {boolean} incExtension Include the file name extension
 */
let _filename = function (config, incExtension) {
  // Backwards compatibility
  let filename = config.filename === '*' && config.title !== '*' && config.title !== undefined ?
    config.title :
    config.filename;

  if (typeof filename === 'function') {
    filename = filename();
  }

  if (filename.indexOf('*') !== -1) {
    filename = filename.replace('*', $('title').text());
  }

  // Strip characters which the OS will object to
  filename = filename.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g, "");

  return incExtension === undefined || incExtension === true ?
    filename + config.extension :
    filename;
};

const _newLine = config => {
  return config.newline ?
    config.newline :
    navigator.userAgent.match(/Windows/) ?
    '\r\n' :
    '\n';
};

const formatExportData = (data) => {
  return {
    body: data.body.map(v => {
      let arr = [];
      data.header.forEach(e => {
        if(e.type !== 'operation') {
          if(!!e.filter) {
            arr.push(lookup(v[e.id], ...e.filter['params'] ));
          }else {
            arr.push(v[e.id]||'');
          }
        }
      })
      return arr;
    }),
    header: data.header.filter(e => (e.type !== 'operation')).map(v => v.label)
  }
}

const _exportData = (dt, config = {
  extend: {},
  fieldBoundary: "",
  fieldSeparator: "	",
  footer: false,
  header: true
}) => {
  let newLine = _newLine(config);
  let data = dt;
  data.body = dt.body.map(v => {
    let arr = [];
    dt.header.forEach(e => {
      if(e.type !== 'operation') {
        if(!!e.filter) {
          arr.push(lookup(v[e.id], ...e.filter['params'] ));
        }else {
          arr.push(v[e.id]||'');
        }
      }
    })
    return arr;
  });
  data.header = dt.header.filter(e => (e.type !== 'operation')).map(v => v.label);
  let boundary = config.fieldBoundary;
  let separator = config.fieldSeparator;
  let reBoundary = new RegExp(boundary, 'g');
  let escapeChar = typeof config.escapeChar !== 'undefined' ?
    config.escapeChar :
    '\\';
  let join = function (a) {
    let s = '';

    // If there is a field boundary, then we might need to escape it in
    // the source data
    for (let i = 0, ien = a.length; i < ien; i++) {
      if (i > 0) {
        s += separator;
      }

      s += boundary ?
        boundary + ('' + a[i]).replace(reBoundary, escapeChar + boundary) + boundary :
        a[i];
    }

    return s;
  };

  let header = config.header ? join(data.header) + newLine : '';
  let footer = config.footer && data.footer ? newLine + join(data.footer) : '';
  let body = [];

  for (let i = 0, ien = data.body.length; i < ien; i++) {
    body.push(join(data.body[i] || ''));
  }

  return {
    str: header + body.join(newLine) + footer,
    rows: body.length
  };
};

const _link = document.createElement('a');

/**
 * Convert a `link` tag's URL from a relative to an absolute address so it will
 * work correctly in the popup window which has no base URL.
 *
 * @param  {node}     el Element to convert
 */
const _relToAbs = function (el) {
  let url;
  let clone = $(el).clone()[0];
  let linkHost;

  if (clone.nodeName.toLowerCase() === 'link') {
    _link.href = clone.href;
    linkHost = _link.host;

    // IE doesn't have a trailing slash on the host
    // Chrome has it on the pathname
    if (linkHost.indexOf('/') === -1 && _link.pathname.indexOf('/') !== 0) {
      linkHost += '/';
    }

    clone.href = _link.protocol + "//" + linkHost + _link.pathname + _link.search;
  }

  return clone.outerHTML;
};

export const copyToClipboard = (e, dt, callback, config = {
  exportOptions: {},
  fieldSeparator: '\t',
  fieldBoundary: '',
  header: true,
  footer: false
}) => {
  let exportData, output;
  if (_.isObject(dt)) {
    exportData = _exportData(dt, config);
    output = exportData.str;
  }
  if (_.isString(dt)) {
    output = dt;
  }
  let hiddenDiv = $('<div/>')
    .css({
      height: 1,
      width: 1,
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    });

  if (config.customize) {
    output = config.customize(output, config);
  }

  let textarea = $('<textarea readonly/>').val(output).appendTo(hiddenDiv);

  // For browsers that support the copy execCommand, try to use it
  if (document.queryCommandSupported('copy')) {
    hiddenDiv.appendTo($('body'));
    textarea[0].focus();
    textarea[0].select();

    try {
      document.execCommand('copy');
      hiddenDiv.remove();

      // dt.buttons.info(
      //   dt.i18n( 'buttons.copyTitle', 'Copy to clipboard' ),
      //   dt.i18n( 'buttons.copySuccess', {
      //       1: "Copied one row to clipboard",
      //       _: "Copied %d rows to clipboard"
      //     }, exportData.rows ),
      //   2000
      // );

      callback('copied_to_clipboard');
    } catch (t) {
      callback('copied_failed');
    }
  }
};

export const exportCSVFile = (e, dt, callback, config = {
  filename: '*',
  extension: '.csv',
  exportOptions: {},
  fieldSeparator: ',',
  fieldBoundary: '"',
  escapeChar: '"',
  charset: null,
  header: true,
  footer: false
}) => {

  if (window.FileReader === undefined || !window.Blob) {
    callback('not_available');
    return;
  }

  // Set the text
  let newLine = _newLine(config);
  let output = _exportData(dt, config).str;
  let charset = config.charset;

  if (config.customize) {
    output = config.customize(output, config);
  }

  if (charset !== false) {
    if (!charset) {
      charset = document.characterSet || document.charset;
    }

    if (charset) {
      charset = ';charset=' + charset;
    }
  } else {
    charset = '';
  }

  _saveAs(
    new Blob([output], {
      type: 'text/csv' + charset
    }),
    _filename(config)
  );
};

export const exportExclFile = (e, dt, callback, config = {
  filename: '*',
  extension: '.xlsx',
  exportOptions: {},
  header: true,
  footer: false
}) => {

  if (!window.FileReader || !window.JSZip || !_isSafari()) {
    callback('not_available');
    return;
  }
  // Set the text
  let xml = '';
  let data = formatExportData(dt);
  let addRow = function (row) {
    let cells = [];

    for (let i = 0, ien = row.length; i < ien; i++) {
      if (row[i] === null || row[i] === undefined) {
        row[i] = '';
      }

      // Don't match numbers with leading zeros or a negative anywhere
      // but the start
      cells.push(typeof row[i] === 'number' || (row[i].match && $.trim(row[i]).match(/^-?\d+(\.\d+)?$/) && row[i].charAt(0) !== '0') ?
        '<c t="n"><v>' + row[i] + '</v></c>' :
        '<c t="inlineStr"><is><t>' + (!row[i].replace ?
          row[i] :
          row[i]
          .replace(/&(?!amp;)/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')) + // remove control characters
        '</t></is></c>' // they are not valid in XML
      );
    }

    return '<row>' + cells.join('') + '</row>';
  };

  if (config.header) {
    xml += addRow(data.header);
  }

  for (let i = 0, ien = data.body.length; i < ien; i++) {
    xml += addRow(data.body[i]);
  }

  if (config.footer) {
    xml += addRow(data.footer);
  }

  let zip = new window.JSZip();
  let _rels = zip.folder("_rels");
  let xl = zip.folder("xl");
  let xl_rels = zip.folder("xl/_rels");
  let xl_worksheets = zip.folder("xl/worksheets");

  zip.file('[Content_Types].xml', excelStrings['[Content_Types].xml']);
  _rels.file('.rels', excelStrings['_rels/.rels']);
  xl.file('workbook.xml', excelStrings['xl/workbook.xml'].replace('__SHEET_NAME__', _sheetname(config)));
  xl_rels.file('workbook.xml.rels', excelStrings['xl/_rels/workbook.xml.rels']);
  xl_worksheets.file('sheet1.xml', excelStrings['xl/worksheets/sheet1.xml'].replace('__DATA__', xml));

  _saveAs(
    zip.generate({
      type: "blob",
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }),
    _filename(config)
  );
};

export const exportPDFFile = (e, dt, callback, config = {
  title: '*',
  filename: '*',
  extension: '.pdf',
  exportOptions: {},
  orientation: 'portrait',
  pageSize: 'A4',
  header: true,
  footer: false,
  message: null,
  customize: null,
  download: 'download'
}) => {

  if (!window.FileReader || !window.pdfMake) {
    callback('not_available');
    return;
  }
  let newLine = _newLine(config);
  let data = formatExportData(dt);
  let rows = [];

  if (config.header) {
    rows.push($.map(data.header, function (d) {
      return {
        text: typeof d === 'string' ? d : d + '',
        style: 'tableHeader'
      };
    }));
  }

  for (let i = 0, ien = data.body.length; i < ien; i++) {
    rows.push($.map(data.body[i], function (d) {
      return {
        text: typeof d === 'string' ? d : d + '',
        style: i % 2 ? 'tableBodyEven' : 'tableBodyOdd'
      };
    }));
  }

  if (config.footer) {
    rows.push($.map(data.footer, function (d) {
      return {
        text: typeof d === 'string' ? d : d + '',
        style: 'tableFooter'
      };
    }));
  }

  let doc = {
    pageSize: config.pageSize,
    pageOrientation: config.orientation,
    content: [{
      table: {
        headerRows: 1,
        body: rows
      },
      layout: 'noBorders'
    }],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: 'white',
        fillColor: '#2d4154',
        alignment: 'center'
      },
      tableBodyEven: {},
      tableBodyOdd: {
        fillColor: '#f3f3f3'
      },
      tableFooter: {
        bold: true,
        fontSize: 11,
        color: 'white',
        fillColor: '#2d4154'
      },
      title: {
        alignment: 'center',
        fontSize: 15
      },
      message: {}
    },
    defaultStyle: {
      fontSize: 10
    }
  };

  if (config.message) {
    doc.content.unshift({
      text: config.message,
      style: 'message',
      margin: [0, 0, 0, 12]
    });
  }

  if (config.title) {
    doc.content.unshift({
      text: _title(config, false),
      style: 'title',
      margin: [0, 0, 0, 12]
    });
  }

  if (config.customize) {
    config.customize(doc, config);
  }

  let pdf = window.pdfMake.createPdf(doc);

  if (config.download === 'open' && !_isSafari()) {
    pdf.open();
  } else {
    pdf.getBuffer(function (buffer) {
      let blob = new Blob([buffer], {
        type: 'application/pdf'
      });

      _saveAs(blob, _filename(config));
    });
  }
}

export const printTableData = (e, dt, callback, config = {
  title: '*',
  message: '',
  exportOptions: {},
  header: true,
  footer: false,
  autoPrint: true,
  customize: null
}) => {
  let data = formatExportData(dt);
  let addRow = function (d, tag) {
    let str = '<tr>';

    for (let i = 0, ien = d.length; i < ien; i++) {
      str += '<' + tag + '>' + d[i] + '</' + tag + '>';
    }

    return str + '</tr>';
  };

  // Construct a table for printing
  let html = '<table class="table table-striped table-bordered table-hover dataTable no-footer">';

  if (config.header) {
    html += '<thead>' + addRow(data.header, 'th') + '</thead>';
  }

  html += '<tbody>';
  for (let i = 0, ien = data.body.length; i < ien; i++) {
    html += addRow(data.body[i], 'td');
  }
  html += '</tbody>';

  if (config.footer) {
    html += '<tfoot>' + addRow(data.footer, 'th') + '</tfoot>';
  }

  // Open a new window for the printable table
  let win = window.open('', '');
  let title = config.title;

  if (typeof title === 'function') {
    title = title();
  }

  if (title.indexOf('*') !== -1) {
    title = title.replace('*', $('title').text());
  }

  win.document.close();

  // Inject the title and also a copy of the style and link tags from this
  // document so the table can retain its base styling. Note that we have
  // to use string manipulation as IE won't allow elements to be created
  // in the host document and then appended to the new window.
  let head = '<title>' + title + '</title>';
  $('style, link').each(function () {
    head += _relToAbs(this);
  });

  $(win.document.head).html(head);

  // Inject the table and other surrounding information
  $(win.document.body).html(
    '<h1>' + title + '</h1>' +
    '<div>' + config.message + '</div>' +
    html
  );

  if (config.customize) {
    config.customize(win);
  }

  setTimeout(function () {
    if (config.autoPrint) {
      win.print(); // blocking - so close will not
      win.close(); // execute until this is done
    }
  }, 250);
};

export const buildTreeData = (
  arrayData = [], 
  parentFieldName = 'parentId', 
  idFieldName = 'id', 
  childrenField = 'children', 
  parentValue
) => {
  if(!arrayData || arrayData.length === 0) return [];
  let rootChildren = arrayData.filter(e=>{
    return !!parentValue ? (
      e[parentFieldName] === parentValue
    ) : arrayData.every(v => (v[idFieldName] !== e[parentFieldName]))
    // !arrayData.map(v=>v[idFieldName]).includes(e[parentFieldName]);
  });
  let notRootChildren = arrayData.filter(e=>{
    return rootChildren.every(el=>(el.id!==e.id));
    // return !!parentValue ? (
    //   e[parentFieldName] !== parentValue
    // ) : arrayData.every(v => (v[idFieldName] === e[parentFieldName]))
    // arrayData.map(v=>v[idFieldName]).includes(e[parentFieldName]);
  });

  return rootChildren.map(v => {
    v[childrenField] = buildTreeData(notRootChildren, parentFieldName, idFieldName, childrenField, v[idFieldName]);
    return v;
  });
}