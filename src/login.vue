<template>
    <el-row style="height: 100%;">
        <div  style="height: 100%;" class="main-container login-layout" :class="{'light-login': light, 'blur-login': blur}">
            <div class="main-content">
                <div class="row">
                    <div class="col-sm-10 col-sm-offset-1">
                        <div class="login-container" style="width: 415px;" v-loading.body="startLoading">
                            <div class="center">
                                <h1>
                                    <i class="ace-icon fa fa-leaf green"></i>
                                    <span class="red">ZTE</span>
                                    <span :class="{grey: light, white: !light}">Application</span>
                                </h1>
                                <h4 :class="{'light-blue': blur, blue: !blur}">&nbsp;</h4>
                            </div>

                            <div class="space-6"></div>

                            <div class="position-relative">
                                <div id="login-box" class="login-box widget-box no-border" :class="{visible: login}">
                                    <div class="widget-body">
                                        <div class="widget-main">
                                            <h4 id="login-title-txt" class="header blue lighter bigger">
                                                <i class="ace-icon fa fa-coffee green"></i>
                                                {{i18n["login_title_text"]}}
                                            </h4>

                                            <div class="space-6"></div>

                                            <form>
                                                <fieldset>
                                                    <label class="block clearfix">
                                                        <span class="block input-icon input-icon-right">
                                                            <input v-model="account" type="text" class="form-control" :placeholder="i18n['login_hr_account']" @keydown.enter="doLogin" />
                                                            <i class="ace-icon fa fa-user"></i>
                                                        </span>
                                                    </label>

                                                    <label class="block clearfix">
                                                        <span class="block input-icon input-icon-right">
                                                            <input v-model="pwd" type="password" class="form-control" :placeholder="i18n['login_hr_password']" @keydown.enter="doLogin" />
                                                            <i class="ace-icon fa fa-lock"></i>
                                                        </span>
                                                    </label>

                                                    <div class="space"></div>

                                                    <div class="clearfix" style="position: relative;">

                                                        <button id="btn-loginbtn" type="button" class="width-35  btn btn-sm btn-primary" @click="doLogin">
                                                            <i class="ace-icon fa fa-key"></i>
                                                            <span class="bigger-110" v-i18n="'login_submit'"></span>
                                                        </button>
                                                        <select id="en_zh" style="position: absolute;right: 0;top: 0;height: 35px;">
                                                            <option>中文</option>
                                                            <option>English</option>
                                                        </select>
                                                    </div>

                                                    <div class="space-4"></div>
                                                </fieldset>
                                            </form>

                                            <div class="social-or-login center">
                                                <span class="bigger-110 red">{{loginInfo}}</span>
                                            </div>

                                            <div class="space-6"></div>

                                        </div>
                                        <!-- /.widget-main -->

                                        <div class="toolbar clearfix">
                                            <div>
                                                <a @click="showForgot" class="forgot-password-link">
                                                    <i class="ace-icon fa fa-arrow-left"></i>
                                                    {{i18n["forgot_pwd"]}}
                                                </a>
                                            </div>

                                            <div>
                                                <a @click="showSignup" class="user-signup-link">
                                                    {{i18n["feedback"]}}
                                                    <i class="ace-icon fa fa-arrow-right"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- /.widget-body -->
                                </div>
                                <!-- /.login-box -->

                                <div id="forgot-box" class="forgot-box widget-box no-border" :class="{visible: forgot}">
                                    <div class="widget-body">
                                        <div class="widget-main">
                                            <h4 class="header red lighter bigger">
                                                <i class="ace-icon fa fa-key"></i>
                                                {{i18n["get_pwd"]}}
                                            </h4>

                                            <div class="space-6"></div>
                                            <p>
                                                {{i18n["login_need_help"]}}
                                            </p>

                                            <form>
                                                <fieldset>
                                                    <label class="block clearfix">
                                                        <span class="block input-icon input-icon-right">
                                                            <input type="email" class="form-control" :placeholder="i18n['email']" />
                                                            <i class="ace-icon fa fa-envelope"></i>
                                                        </span>
                                                    </label>

                                                    <div class="clearfix">
                                                        <button type="button" class="width-35 pull-right btn btn-sm btn-danger">
                                                            <i class="ace-icon fa fa-lightbulb-o"></i>
                                                            <span class="bigger-110">{{i18n["send"]}}!</span>
                                                        </button>
                                                    </div>
                                                </fieldset>
                                            </form>
                                        </div>
                                        <!-- /.widget-main -->

                                        <div class="toolbar center">
                                            <a @click="showLogin" class="back-to-login-link">
                                                {{i18n["go_back_login"]}}
                                                <i class="ace-icon fa fa-arrow-right"></i>
                                            </a>
                                        </div>
                                    </div>
                                    <!-- /.widget-body -->
                                </div>
                                <!-- /.forgot-box -->

                                <div id="signup-box" class="signup-box widget-box no-border" :class="{visible: signup}">
                                    <div class="widget-body">
                                        <div class="widget-main">
                                            <h4 class="header green lighter bigger">
                                                <i class="ace-icon fa fa-users blue"></i>
                                                {{i18n["summit_adv"]}}
                                            </h4>

                                            <div class="space-6"></div>
                                            <p v-i18n="'adv_detail_label'"></p>

                                            <form>
                                                <fieldset>
                                                    <label class="block clearfix">
                                                        <span class="block input-icon input-icon-right">
                                                            <input type="email" class="form-control" :placeholder="i18n['email']" />
                                                            <i class="ace-icon fa fa-envelope"></i>
                                                        </span>
                                                    </label>

                                                    <label class="block clearfix">
                                                        <span class="block input-icon input-icon-right">
                                                            <input type="text" class="form-control" :placeholder="i18n['login_hr_account']" />
                                                            <i class="ace-icon fa fa-user"></i>
                                                        </span>
                                                    </label>

                                                    <label class="block clearfix">
                                                        <span class="block input-icon input-icon-right">
                                                            <input type="password" class="form-control" :placeholder="i18n['login_hr_password']" />
                                                            <i class="ace-icon fa fa-lock"></i>
                                                        </span>
                                                    </label>

                                                    <label class="block clearfix">
                                                        <span class="block input-icon input-icon-right">
                                                            <input type="password" class="form-control" :placeholder="i18n['repeat_password']" />
                                                            <i class="ace-icon fa fa-retweet"></i>
                                                        </span>
                                                    </label>

                                                    <label class="block">
                                                        <input type="checkbox" class="ace" />
                                                        <span class="lbl">
                                                            {{i18n["login_accept"]}}
                                                            <a v-i18n="'user_agreement'"></a>
                                                        </span>
                                                    </label>

                                                    <div class="space-24"></div>

                                                    <div class="clearfix">
                                                        <button type="reset" class="width-30 pull-left btn btn-sm">
                                                            <i class="ace-icon fa fa-refresh"></i>
                                                            <span class="bigger-110">{{i18n["reset"]}}</span>
                                                        </button>

                                                        <button type="button" class="width-65 pull-right btn btn-sm btn-success">
                                                            <span class="bigger-110">{{i18n["register"]}}</span>

                                                            <i class="ace-icon fa fa-arrow-right icon-on-right"></i>
                                                        </button>
                                                    </div>
                                                </fieldset>
                                            </form>
                                        </div>

                                        <div class="toolbar center">
                                            <a @click="showLogin" class="back-to-login-link">
                                                <i class="ace-icon fa fa-arrow-left"></i>
                                                {{i18n["go_back_login"]}}
                                            </a>
                                        </div>
                                    </div>
                                    <!-- /.widget-body -->
                                </div>
                                <!-- /.signup-box -->
                            </div>
                            <!-- /.position-relative -->

                            <div class="navbar-fixed-top align-right">
                                <br /> &nbsp;
                                <a @click="showDark">Dark</a>
                                &nbsp;
                                <span class="blue">/</span>
                                &nbsp;
                                <a @click="showBlur">Blur</a>
                                &nbsp;
                                <span class="blue">/</span>
                                &nbsp;
                                <a @click="showLight">Light</a>
                                &nbsp; &nbsp; &nbsp;
                            </div>
                        </div>
                    </div>
                    <!-- /.col -->
                </div>
                <!-- /.row -->
            </div>
            <!-- /.main-content -->
        </div>
        <!-- /.main-container -->
    </el-row>
</template>

<script>
import initHttp from '@/common/http';
import { Lang } from '@/common/data-i18n/initI18n';
import { mapMutations, mapGetters } from 'vuex';

export default {
    data() {
        return {
            login: true,
            forgot: false,
            signup: false,
            dark: false,
            blur: false,
            light: true,
            account: '',
            pwd: '',
            loginInfo: '',
            startLoading: false,
            i18n: Lang()
        }
    },
    computed: {
        ...mapGetters([
            'appContextPath'
        ])
    },
    methods: {
        ...mapMutations([
             'setUser',
             'setDept'
        ]),
        showLogin() {
            this.login = true;
            this.forgot = this.signup = false;
        },
        showForgot() {
            this.forgot = true;
            this.login = this.signup = false;
        },
        showSignup() {
            this.signup = true;
            this.login = this.forgot = false;
        },
        showDark() {
            this.dark = true;
            this.light = this.blur = false;
        },
        showBlur() {
            this.blur = true;
            this.light = this.dark = false;
        },
        showLight() {
            this.light = true;
            this.dark = this.blur = false;
        },
        mounted () {
            sessionStorage.clear();
        },
        doLogin() {
            const scope = this;
            this.loginInfo = this.i18n["login-waiting"];
            this.startLoading = true;
            this.$http.post(`${this.appContextPath}sysman/User/login.serv`, {
                account: this.account,
                pwd: this.pwd,
                id: null
            }).then(
                success => {
                    scope.startLoading = false;
                    try {
                        if (success.data.code.code == '0000') {
                            scope.loginInfo = scope.i18n["login-success"];
                            scope.setUser(success.data.bo);
                            scope.setDept(success.data.other);
                            setTimeout(()=>{
                                scope.$router.push({ name: 'home' });
                            })
                        } else {
                            scope.loginInfo = scope.i18n["login-fail"] + success.data.code.msg;
                        }
                    } catch (e) {
                        scope.loginInfo = scope.i18n["login-fail"] +', ' + scope.i18n["system-error"];
                    }

                },
                error => {
                    scope.startLoading = false;
                    scope.loginInfo = scope.i18n["login-fail"];
                }
                );
        }
    }
}
</script>

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
</style>