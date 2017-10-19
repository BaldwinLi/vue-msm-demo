import axios from 'axios';
import { appConsts } from '@/app';

window.Vue.http = window.Vue.prototype.$http = axios;

export default (user) => {
    window.Vue.prototype.$http.interceptors.request.use(
      config => {
        config.headers.common[appConsts['HTTP_HEADER_X_AUTH_VALUE']] = user.token;
        config.headers.common[appConsts['HTTP_HEADER_X_ORG_ID']] = user.orgId;
        config.headers.common[appConsts['HTTP_HEADER_X_LANG_ID']] = appConsts['NeedLangId']?appConsts[sessionStorage.getItem('locale')||'ZH_CN'].langId:2052;
  
        return config;
      },
      err => Promise.reject(err)
    );
    window.Vue.prototype.$http.interceptors.response.use(
      response => {
        if (response && response.data && response.data.code) {
          if (response.data.code.code === '0003') {
            window.location.href = `${window.location.origin}/#/login`;
            window.sessionStorage.clear();
            return false;
          }
          if (response.data.code.code === '0000') {
            return response;
          }
          if (response.data.code.msg) {
            window.Vue.prototype.$message.error(`${response.data.code.msg} ${response.data.other.msg||''}`);
          }
        }
        return false;
      },
      error => {
        if (error.response) {
          window.Vue.prototype.$alert(error.response.body, i18n["system_error"])
        }
        return Promise.reject(error.response.data) // 返回接口返回的错误信息
      }
    );
  }