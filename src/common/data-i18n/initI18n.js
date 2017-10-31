import EN from './en';
import ZH_CN from './zh_cn';
import ElementUI from 'element-ui'
import en_lang from 'element-ui/lib/locale/lang/en'
import zh_lang from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'

let la = 'ZH_CN';

window.Vue.config.warnHandler = (msg, vm, trace) => {
  if(msg==='Injection "elForm" not found' && 
     msg==='Injection "elFormItem" not found' && 
     msg==='Invalid prop: type check failed for prop "hideAfter". Expected Number, got String.') 
    console.error(("[Vue warn]: " + msg + trace));
}

export default (lang) => {
  la = lang;
  initI18nDirective(lang)
  if (lang === 'EN') {
    window.Vue.use(ElementUI, {
      locale: en_lang,
      size: 'small'
    });
  } else {
    window.Vue.use(ElementUI, {
      locale: zh_lang,
      size: 'small'
    });
  }

}

export const Lang = () => {
  if (la === 'EN') return EN;
  else return ZH_CN;
};

function initI18nDirective(lang) {
  window.Vue.directive('i18n', {
    bind(el, binding) {
      if (lang === 'EN') {
        el.textContent = EN[binding.value];
      } else {
        el.textContent = ZH_CN[binding.value];
      }
    }
  });
}
