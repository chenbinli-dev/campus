import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
//安装vuex插件
Vue.use(Vuex)

//创建Store实例


const store = new Vuex.Store({
    //状态集
    state: {
        //用户权限，1为普通用户，默认；2为学生用户
        user_right: 1,
        //是否设置了支付密码
        have_pay_password: false,
        have_banlance: false,
        showDot: false,
        is_forbidden: 0
    },
    //变更集
    mutations: {
        change_user_right (state) {
            state.user_right = 2
        },
        change_user_right_default (state) {
            state.user_right = 1
        },
        pay_password_status (state) {
            state.have_pay_password = true
        },
        pay_password_status_default (state) {
            state.have_pay_password = false
        },
        banalce_status (state) {
            state.have_banlance = true
        },
        banalce_status_default (state) {
            state.have_banlance = false
        },
        change_showDot_true (state) {
            state.showDot = true
        },
        change_showDot_false (state) {
            state.showDot = false
        },
        is_forbidden_true (state) {
            state.is_forbidden = 1
        },
        is_forbidden_false (state) {
            state.is_forbidden = 0
        }
    },
    plugins: [createPersistedState({
        storage: window.loaclStorage,
        reducer (val) {
            //配置需要存储到localstorage的state
            return {
                // 只储存state中的assessmentData
                user_right: val.user_right,
                have_pay_password: val.have_pay_password,
                have_banlance: val.have_banlance,
                showDot: val.showDot,
                is_forbidden: val.is_forbidden
            }
        }

    })]
})

export default store