import Vue from 'vue'
import * as JQuery from 'jquery'
import * as Lodash from 'lodash'
window.Vue = Vue
window.$ = window.jQuery = JQuery
window._ = Lodash
import userSelectItem from './userselectitem'

window.Vue.component('user-select-item', userSelectItem);