import Vuex from 'vuex';
import {
  appConsts
} from '@/app';
import initHttp from '@/common/http';

window.Vue.use(Vuex);

const userInfo = JSON.parse(sessionStorage.getItem('user'));
userInfo && initHttp(userInfo);
export default new Vuex.Store({
  state: {
    userInfo: userInfo || {
      account: '',
      createdBy: 0,
      createdDate: '',
      effectiveDate: '',
      email: '',
      enableFlag: '',
      enciv: '',
      enckey: '',
      expirationDate: '',
      id: 0,
      lastUpdatedBy: 0,
      lastUpdatedDate: '',
      mobileNo: '',
      name: '',
      orgId: 0,
      pwd: '',
      token: ''
    },
    userDept: {
      ZTELonginUserDeptId: '',
      ZTELonginUserDeptName: '',
      ZTEFormSecretRole: ''
    },
    userOrg: [{
      id: 0,
      parentId: 0,
      parentDictCode: null,
      dictCode: '',
      dictName: '',
      dictValue: 0,
      viewLevel: null,
      levelName: null,
      orderBy: null,
      effectiveDate: null,
      expirationDate: null,
      remark: null,
      createdBy: null,
      createdDate: null,
      lastUpdatedBy: null,
      lastUpdatedDate: null,
      enableFlag: '',
      orgId: 0
    }]
  },
  mutations: {
    setUser(state, user) {
      sessionStorage.setItem('user', JSON.stringify(user))
      state.userInfo = user;
      initHttp(user);
    },
    setDept(state, dept) {
      state.userDept = dept;
    },
    setOrg(state, orgList) {
      state.userOrg = orgList;
    }
  },
  getters: {
    isLocal: () => (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? true : false,
    appContextPath: () => ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? true : false) ? `${window.location.origin}/dev_api/` : (window.location.origin + '/'),
    appConsts: () => appConsts,
    loginUser: (state) => (state.userInfo),
    loginUserDept: (state) => (state.userDept),
    loginUserOrgList: (state)=>(state.userOrg)
  }
});
