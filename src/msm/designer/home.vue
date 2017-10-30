<template>
  <!-- <div v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="加载中, 请稍后..."></div> -->
  <div style="width:100%; height:100%">
    <el-row style="height: 60px;">
      <el-menu theme="dark" class="el-menu-demo" mode="horizontal">
        <div class="pull-left">
          <a class="navbar-brand">
            <i class="fa fa-leaf "></i>ZTE IT Admin</a>
        </div>
        <el-submenu v-for="(menu, index) in menus" :key="menu.id" :index="index.toString()">
          <template slot="title">
            <i style="margin:5px;" class="menu-icon" :class="menu.icon.split(' ')"></i>{{menu.text}}
          </template>
          <el-menu-item v-for="item in menu.menus" v-if="item.menus.length==0" :key="item.id" :index="index.toString() + item.id" @click="addTab(item)">
            <i style="margin:5px;" class="menu-icon" :class="item.icon && item.icon.split(' ')"></i>{{item.text}}
          </el-menu-item>
          <el-submenu v-for="item in menu.menus" v-if="item.menus.length>0" :key="item.id" :index="index.toString()+item.id">
            <template slot="title">
              <i style="margin:5px;" class="menu-icon" :class="item.icon.split(' ')"></i>{{item.text}}
            </template>
            <el-menu-item v-for="item_1 in item.menus" v-if="item_1.menus.length==0" :key="item_1.id" :index="index.toString() + item.id + item_1.id" @click="addTab(item_1)">
              <i style="margin:5px;" class="menu-icon" :class="item_1.icon && item_1.icon.split(' ')"></i>{{item_1.text}}
            </el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-dropdown @command="handleCommand" trigger="click" style="cursor: pointer; padding: 2px;width:12%; float: right;background: #62A8D1;color: #FFF;">
          <span class="el-dropdown-link">
            <img class="nav-user-photo" src="../../skins/avatars/user.jpg"> {{i18n["welcome"]}} {{userInfo.name}}<br> {{orgList[0]&&orgList[0].dictName||''}}
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" style="width: 12%;">
            <el-dropdown-item disabled>
              <i class='ace-icon fa fa-cogs'></i>{{orgList.length}}</el-dropdown-item>
            <el-dropdown-item v-for="org in orgList" :key="org.dictCode" :command="org.dictCode">
              <i class='ace-icon fa fa-cog'></i>{{org.dictName}}</el-dropdown-item>
            <el-dropdown-item divided style="width: 100%; margin: 0;" command="logout">
              <i class="ace-icon fa fa-power-off"></i>{{i18n["sign_out"]}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown @command="langCommand" trigger="click" style="cursor: pointer; padding: 2px;width:12%; float: right;color: #FFF;">
          <span class="el-dropdown-link">
            {{i18n['language']}} {{langText}}
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" style="width: 8%;">
            <el-dropdown-item v-for="(lang, index) in langList" :key="lang.id" :command="index">
              <i class='ace-icon fa fa-cog'></i>{{lang.value}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu>
    </el-row>
    <el-row style="height:90%">
      <el-tabs style="height: 100%;" v-model="tabPageIndex" type="border-card" @tab-remove="removeTab">
        <el-tab-pane style="height: 100%;" name="0">
          <span slot="label">
            <i class="menu-icon glyphicon glyphicon-home"></i> {{i18n["home_page"]}}</span>
          <notice-show></notice-show>
        </el-tab-pane>
        <el-tab-pane v-for="(item, index) in tabPages" :key="item.id" :name="item.id" closable>
          <span slot="label">
            <i class="menu-icon" :class="item.icon.split(' ')"></i> {{item.text}}
          </span>
          <div v-if="item.id==='3'">
            <create-review></create-review>
          </div>
          <div v-else-if="item.id==='4'">
            <review-list></review-list>
          </div>
          <div v-else-if="item.id==='12'">
            <proreview-list></proreview-list>
          </div>
          <div v-else-if="item.id==='13'">
            <my-pending-list></my-pending-list>
          </div>
          <div v-else-if="item.id==='14'">
            <query-review-list></query-review-list>
          </div>
          <div v-else-if="item.id==='8'">
            <resource-list></resource-list>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import noticeShow from './tabPages/noticeshow/noticeshow';
import createReview from './tabPages/createreview/createreview';
import reviewList from './tabPages/myreviewmanlist/myreviewmanlist';
import proreviewList from './tabPages/myproreview/myproreviewlist';
import myPendingList from './tabPages/mypending/mypendinglist';
import queryReviewList from './tabPages/queryreview/queryreviewlist';
import resourceList from './tabPages/resource/resourcelist';
import { Lang } from '@/common/data-i18n/initI18n';
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'home',
  components: { 
    noticeShow,
    createReview,
    reviewList,
    proreviewList,
    myPendingList,
    queryReviewList,
    resourceList
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      fullscreenLoading: false,
      menus: [],
      orgList: [],
      tabPageIndex: '0',
      tabPages: [],
      langText: '简体中文',
      langList: [{
        id: 'ZH_CN',
        value: '简体中文'
      },
      {
        id: 'EN',
        value: 'English'
      }],
      i18n: Lang()
    }
  },
  methods: {
    ...mapMutations([
      'setOrg'
    ]),
    addTab(tab) {
      let isOpend = this.tabPages.some(e => tab.id === e.id);
        !isOpend && this.tabPages.push(tab);
        this.tabPageIndex = tab.id;
    },
    removeTab(tab) {
      for (let i in this.tabPages){
        if(this.tabPages[i].id === tab) {
          this.tabPages.splice(parseInt(i), 1);
        }
      }
    },
    handleCommand(command) {
      if (command === 'logout') {
        sessionStorage.clear();
        window.location.reload();
      }
    },
    langCommand(index) {
      this.langText = this.langList[index].value;
      sessionStorage.setItem('locale', this.langList[index].id);
      window.location.reload();
    }
  },
  computed: {
    ...mapGetters([
      'appContextPath'
    ]),
    ...mapState([
      'userInfo'
    ])
  },
  created(){
    if (!sessionStorage.getItem('user')) {
      this.$router.push({ name: 'login' });
      this.$destroy();
    }
  },
  mounted() {
    const scope = this;
    if(this._isDestroyed) return;
    for (let i in this.langList) {
      if (sessionStorage.getItem('locale') === this.langList[i].id) {
        this.langText = this.langList[i].value;
        this.langList.splice(i, 1);
        break;
      }
    }

    const loading = this.$loading({
      fullscreen: true,
      text: this.i18n['hard_loading']
    });
    this.$http.post(`${this.appContextPath}sysman/Dictionary/getList.serv`,
      {
        "bo": {
          "dictCode": "003",
          "parentId": "0"
        }
      }
    ).then(
      success => {
        if (success) {
          return success.data.bo[0].id;
        }
      },
      error => {
        loading.close();
        return false;
      }).then(
      success => {
        if (success) {
          return scope.$http.post(`${this.appContextPath}sysman/Dictionary/getMyOrgList.serv`,
            { "bo": { "parentId": success } }
          ).then(
            success => {
              if (success) {
                scope.orgList = success.data && success.data.bo;
                scope.setOrg(scope.orgList);
                return true;
              }
            },
            error => {
              loading.close();
              return false;
            });
        }
      }).then(
      success => {
        success && scope.$http.post(`${this.appContextPath}sysman/Resource/getMenusPageJSON.serv`,
          { "bo": {}, "sort": "", "order": "desc" }
        ).then(
          success => {
            if (success) {
              scope.menus = success.data.bo.map(v=>{
                v.menus = v.menus.filter(e=>!['10743'].includes(e.id));
                return v;
              }).filter((e) => !['17', '10903'].includes(e.id));
              loading.close();
            }
          },
          error => {
            loading.close();
          });
      });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.menu-icon {
  display: inline-block;
  min-width: 30px;
  margin-right: 2px;
  vertical-align: sub;
  text-align: center;
  font-size: 18px;
  font-weight: normal;
}

.fa {
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.navbar-brand {
  float: left;
  padding: 20px 12px;
  font-size: 18px;
  line-height: 20px;
  height: 50px;
}

.nav-user-photo {
  margin: -4px 8px 0 0;
  border-radius: 100%;
  border: 2px solid #FFF;
  max-width: 40px;
}
</style>
