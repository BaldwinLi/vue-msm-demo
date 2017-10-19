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
      createdDate:'',
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
    }
  },
  mutations: {
    setUser(state, user) {
      sessionStorage.setItem('user', JSON.stringify(user))
      state.userInfo = user;
      initHttp(user);
    },
    setDept(state, dept) {
      sessionStorage.setItem('dept', JSON.stringify(dept))
      state.userDept = dept;
    }
  },
  getters: {
    isLocal: () => (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? true : false,
    appContextPath: () => ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? true : false) ? `${window.location.origin}/dev_api/` : (window.location.origin + '/'),
    appConsts: () => appConsts,
    loginUser: (state) => (state.userInfo)
  }
});
