import Vue from 'vue'
import * as JQuery from 'jquery'
import * as Lodash from 'lodash'
window.Vue = Vue
window.$ = window.jQuery = JQuery
window._ = Lodash
window.Vue.component('user-select-item', {
  functional: true,
  render: function (h, ctx) {
    var item = ctx.props.item;
    return h('li', ctx.data, [
      h('div', {
        attrs: {
          class: 'item'
        }
      }, [item.value]),
      h('span', {
        attrs: {
          class: 'subitem'
        }
      }, [item.subValue])
    ]);
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  }
});
