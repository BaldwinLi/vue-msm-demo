/**
 <b>zte.app</b>. Calls sidebar functions, demo ajax, some fixes, etc
*/



(function($ , undefined) {
	//可以获取所有url中的参数
	//if(typeof(uac) == 'undefined') uac = {};
	if( !('uac' in window) ) window['uac'] = {};
	/*uac.Href = function() {
		var args = [];
		var result = window.location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+","g"));
		if(result != null){
	     	for(var i = 0; i < result.length; i++){
			var ele = result[i];
			var inx = ele.indexOf("=");
			args[ele.substring(1, inx)] = ele.substring(inx+1);
	     	}
		}
		return {
			getParameter:function(key){
				var rt = args[key];
				if(rt == undefined)
					return null;
				return rt;
			}, 
			getAllParameter:function() {
				return args;
			}
		};
	};
	uac.href = new uac.Href();*/
	
	uac.Cookie = function (){
		return {
			addCookie:function(objName,objValue,objHours){
				//var Days = 10;    
				//var exp = new Date(); 
				//exp.setTime (exp.getTime()+Days*24*60*60*1000); 
				document.cookie = objName + "=" + objValue + ";path=/;domain=zte.com.cn;expires="; 
			},
			getCookie:function(name){
				var cooikevalue = document.cookie;
				var arg = name + "="; 
				var alen = arg.length; 
				var clen = cooikevalue.length; 
				var i = 0; 
				while (i < clen) { 
					var j = i + alen; 
					if (cooikevalue.substring(i, j) == arg) {
					 var endstr = cooikevalue.indexOf (";", j); 
					 if (endstr == -1) {
					 		endstr = cooikevalue.length; 
					 	}
						return cooikevalue.substring(j, endstr); 	 
					}
					i = cooikevalue.indexOf(" ", i) + 1; 
					if (i == 0) break; 
				} 
				return "";
			},
			delCookie:function(name){
				var date = new Date();
				date.setTime(date.getTime() - 10000);
				document.cookie = name + "=a;path=/;domain=zte.com.cn;expires="+date.toGMTString();
			}
		};
	};
	uac.cookie = new uac.Cookie();
	
  if( !('zte' in window) ) window['zte'] = {};
  //设置当前web站点访问地址
  //var root = "http://localhost:8080/";
  //var root = "http://10.89.208.188/";  //测试环境地址
  // 设置当前web站点上下文
 // var webContext = "html5"
  //var webContext = "html5-pc-2016"
  // 除了登录界面，WEB站点其他界面用户没登录都会跳转到登录界面
  
  //if (zte.user.token == "" && location.href.toLowerCase().indexOf("/html/login.html") == -1) {
	 // location.href = zte.url.root + webContext + "/html/login.html";
 // }
  
  
  //常量设置
  zte.Contants = function () {
	  var systemCode = "UAC";
	  var systemNo = "UAC";
	  var uacPortal = "https://uac.zte.com.cn/portal/login.html?businessSystemCode=" + systemCode + "&url=" + encodeURIComponent(encodeURIComponent(location.href));
	  return {
		  getPortalUrl:function(){
			  return uacPortal;
		  },
	  	  getSystemCode:function(){
	  		return systemCode;
	  	  },
	  	  getSystemNo:function(){
	  		  return systemNo;
	  	  }
	  };
  };
  zte.contants = new zte.Contants();
  
  
  zte.ajax = {
      
    /**
     * 和服务器通讯函数
     * @param url: 服务URL地址
     * @param data: 请求参数
     * @param busiFunc: 业务回调函数
     * @param asyncFlag: 是否异步请求，默认为异步
     */
    postUrl: function(url,data,busiFunc,asyncFlag) {
			if(!window._loading){
				if(window.parent._loading){
					window._loading = window.parent._loading;
				}else if(window.parent.parent._loading){
					window._loading = window.parent.parent._loading
				}
			}
			window._loading && _loading.startLoading();
      var ajax_params = {
          method: 'POST', 
          url: zte.url.root + url, 
          data : JSON.stringify(data),
          dataType: 'json',
          contentType:'application/json',
          //processData: false,
          async: asyncFlag||asyncFlag=='undefined'?true:false,
          headers: {
            //"Accept" : "application/json, text/javascript, */*; charset=utf-8",
            //"Content-Type": "application/json; charset=utf-8"
          },
          //发送请求前，设置请求头
          beforeSend:function(jqXHR, settings) {  
            //如果请求头里面设置了身份验证标志，则添加身份令牌
            //if (zte.user.Consts.NeedAuthToken && settings.headers != null && settings.headers[zte.user.Consts.HTTP_HEADER_X_AUTH_FLAG]=='Y') {
        	//if (zte.user.Consts.NeedAuthToken && settings.headers != null && needAuth != null && needAuth) {
                  //在请求头中设置身份令牌
        	     // jqXHR.setRequestHeader(zte.user.Consts.HTTP_HEADER_X_AUTH_FLAG,'Y');
               jqXHR.setRequestHeader(zte.user.Consts.HTTP_HEADER_X_AUTH_VALUE,zte.user.token);
          	   jqXHR.setRequestHeader(zte.org.Consts.HTTP_HEADER_X_ORG_ID, zte.user.orgId);   	
            //}
            //else{
              //jqXHR.setRequestHeader(zte.user.Consts.HTTP_HEADER_X_AUTH_FLAG,'N');
            //}
            
            //设置多语言参数
            if (zte.lang.Consts.NeedLangId) {
              //在请求头中设置语言ID
              jqXHR.setRequestHeader(zte.lang.Consts.HTTP_HEADER_X_LANG_ID,zte.lang.langId);
            }
            
            //如果请求头里面设置了传输加密标志，则对数据加密
            /*
            if (CryptoService.NeedCryptoRequest && config.headers[CryptoService.HTTP_HEADER_X_CRYPTO_FLAG]=='Y') {
              //在请求头中设置加密类型和HASH
              config.headers[CryptoService.HTTP_HEADER_X_CRYPTO_ALGO] = 'aes';
              config.headers[CryptoService.HTTP_HEADER_X_CHANNEL_HASH] = '123456';
              //加密请求数据
              var datastr = CryptoService.encrypt(JSON.stringify(config.data));
              //$log.debug(datastr);
              config.data = datastr;          
            }
            else{
              config.headers[CryptoService.HTTP_HEADER_X_CRYPTO_FLAG] = 'N';
            }*/
          },
          //请求失败
          error:function(jqXHR, textStatus, errorThrown) {
							//客户端请求异常
							window._loading && _loading.finishLoading();
              var ret = {
                code : {
                  code : '1001',
                  msg : 'ajax请求失败'
                },
                bo : textStatus + ',' + errorThrown
              };
              
              //将结果委托结业务回调函数
              busiFunc(ret);
              
              //根据返回结果，显示提示信息
              //zte.notify.ShowResult(ret);
          },
          //请求成功
          success:function(data, textStatus, jqXHR) { 
						window._loading && _loading.finishLoading();
            var ret = data;
            //try{
            //  ret = jQuery.parseJSON(data);
            //}
            //catch(ex){}
            
            //处理返回数据  
            if (ret != null && ret.code != null && ret.code.code == '0000') {         
              if (ret != null && ret.bo != null && ret.bo.rows != null) {
                //获取到列表数据时,给列表增加一个序号字段jsListSeq,这样在列表过滤后,还可以找到记录的位置
                for (var i = 0; i < ret.bo.rows.length; i++) {
                  ret.bo.rows[i].jsListSeq = i;
                }
              }
            }
            
            //将结果委托给业务回调函数
            busiFunc(ret);
    
            //根据返回结果，显示提示信息
            //zte.notify.ShowResult(ret);
          }
      };

      $.ajax(ajax_params);
    },
		rootUrl:function (url){
			return zte.url.root + url;
		}
  };
    
  zte.ajax.test = function() {
    zte.ajax.postUrl("test1.html",{'id':123,'name':'邓测试'},zte.ajax.busiFunc);
    return;
  };
  
  zte.ajax.busiFunc = function(ret) {
    alert(ret);
    return;
  };
 
  //单点登录
  zte.ajax.sso = function() {
	  //var udsType = uac.cookie.getCookie("ZTEDPGSSOVersionType");
	    var udsToken= uac.cookie.getCookie("ZTEDPGSSOCookie");
	    var udsLanguage= uac.cookie.getCookie("ZTEDPGSSOLanguage");
	    var udsUser= uac.cookie.getCookie("ZTEDPGSSOUser");
	    var udsVersion = uac.cookie.getCookie("udsVersion");
	    var udsClientIp = uac.cookie.getCookie("udsClientIp");
	    var clientSerialNo = uac.cookie.getCookie("clientSerialNo");
	    
	    var portalToken = uac.cookie.getCookie("PORTALSSOCookie");
	    var portalUser = uac.cookie.getCookie("PORTALSSOUser");
	    var portalLanguage = uac.cookie.getCookie("PORTALSSOLanguage");
	    var paramAccount = '';
	    var paramToken='';
	    var language = 'zh_CN'; //默认中文 英文en_US
	    if(portalToken != '' && portalToken != undefined) {
	    	paramToken = portalToken;
	    } else {
	    	paramToken = udsToken;
	    }
	    
	    if(portalUser != '' && portalUser != undefined) {
	    	paramAccount = portalUser;
	    } else {
	    	paramAccount = udsUser;
	    }

	    if(portalLanguage != '' && portalLanguage != undefined) {
	    	language = portalLanguage;
	    } else if(udsLanguage != '' && udsLanguage != undefined){
	    	language = udsLanguage;
	    }
	  	//1、进行单点认证
	  	if(zte.user.token == "" || zte.user.token == undefined) {
            //判断是否ip 登录，ip登录则用系统本身登录页面
            /*if(window.location.href.indexOf('zte.com.cn')<0 && window.location.href.indexOf('login.html')<0 ){
                window.location.href="login.html";
                return false;
            }else if(window.location.href.indexOf('login.html')!=-1){
                return false;
            }*/
	  		var row = {
	 			   udsType : "1",       //强制进行新的UDS单点登录
	 			   account : paramAccount,
	 			   token : paramToken,
	 			   clientIp : udsClientIp,
	 			   udsVersion : udsVersion,
	 			   clientSerialNo : clientSerialNo,
	 			   sysCode : zte.contants.getSystemCode(),
	 			   sysNo : zte.contants.getSystemNo()
	 	   };
	 	   zte.ajax.postUrl("/uac/sso/login.serv", row,
	  		//zte.ajax.postUrl("/sysman/User/uacLogin.serv", row,
	   		function(ret) {
	 			if (ret != null && ret.code != null
	 					&& ret.code.code != null
	 					&& ret.code.code == '0000' && ret.bo.code == '0000') {
	 				var ZTELonginUserDeptId = "";
                	var ZTELonginUserDeptName = "";
	                var ZTEFormSecretRole = "";
                	if(ret.other.otherMap != null) {
                		ZTELonginUserDeptId = ret.other.otherMap.ZTELonginUserDeptId;
                		ZTELonginUserDeptName = ret.other.otherMap.ZTELonginUserDeptName;
	                	ZTEFormSecretRole = ret.other.otherMap.ZTEFormSecretRole;	
                	}
	 				zte.user.isLogin = true;
					zte.user.loginUser = ret.other.user;
					zte.user.token = encodeURIComponent(encodeURIComponent(ret.other.token));	
				    zte.user.orgId = ret.other.orgId;
	 				zte.storage.putjson("ZTELonginUser",zte.user);
	 				zte.storage.putjson("ZTELonginUserDeptId",ZTELonginUserDeptId);
					zte.storage.putjson("ZTELonginUserDeptName",ZTELonginUserDeptName);
					zte.storage.putjson("ZTEFormSecretRole",ZTEFormSecretRole);
			    	$('#span-loginmsg').text('认证成功,请稍候...');
	 				location.href ="index.html";
	 			} else {
	 				location.href = zte.contants.getPortalUrl();
	 			}
	 		});
	  	}
  };
  
  
})(jQuery);

if(location.href.indexOf('zte.com.cn')>=0){
	zte.ajax.sso();//单点认证
}