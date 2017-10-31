import '@/skins/alibaba_font/iconfont.css'
import '@/skins/css/bootstrap.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/common/components/libs'
import installI18n from '@/common/data-i18n/initI18n'

installI18n(sessionStorage.getItem('locale'));
window.Vue.config.productionTip = false;

export const appConsts = {
  'NeedAuthToken': true, //是否做令牌验证全局开关
  'HTTP_HEADER_X_AUTH_FLAG': 'X-Auth-Flag', //是否令牌验证的HTTP头
  'HTTP_HEADER_X_AUTH_VALUE': 'X-Auth-Value', //存放令牌数据验证的HTTP头,
  'HTTP_HEADER_X_ORG_ID': 'X-Org-Id', // 组织ID
  'NeedLangId': true, //是否上传多语言ID全局开关
  'HTTP_HEADER_X_LANG_ID': 'X-Lang-Id', //存放多语言ID的HTTP头
  'ZH_CN': {
    lang: 'zh',
    langId: '2052'
  }, //中文常量
  'EN': {
    lang: 'en',
    langId: '1033'
  }, //英文常量
  'LocaleKey': 'Frame-Lang' //本地多语言标志KEY
};
