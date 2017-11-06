import {
  Lang
} from '@/common/data-i18n/initI18n';

const i18n = Lang();

export const APPROVE_TYPE = [{
    id: '00',
    value: i18n['signcon']
  },
  {
    id: '01',
    value: i18n['sendcon']
  },
  {
    id: '02',
    value: i18n['changecon']
  },
  {
    id: '03',
    value: i18n['specialcon']
  },
]

export const REVIEW_STATUS = [
  {
    id: '00',
    value: i18n['draft']
  },
  {
    id: '01',
    value: i18n['isreview']
  },
  {
    id: '05',
    value: i18n['isover']
  },
  {
    id: '03',
    value: i18n['ispause']
  },
  {
    id: '06',
    value: i18n['backdraft']
  },
  {
    id: '07',
    value: i18n['retreatdraft']
  }
]

export const REVIEW_RESULT = [{
  id: '00',
  value: i18n['pass']
},
{
  id: '01',
  value: i18n['nopass']
}]

export const FUNCTION_TYPE = [
  {
    id: '0',
    value: i18n['business_menu']
  },
  {
    id: '1',
    value: i18n['system_menu']
  },
  {
    id: '2',
    value: i18n['service']
  },
  {
    id: '3',
    value: i18n['func_btn']
  }
]

export const ROLE_TYPE = [
  {
    id: '0',
    value: i18n['sys_default']
  },
  {
    id: '1',
    value: i18n['custom_define']
  }
]

export const VIEW_LEVEL = [
  {
    id: '1',
    value: i18n['level_1']
  },
  {
    id: '1',
    value: i18n['level_2']
  },
]