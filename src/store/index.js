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
        have_banlance: false
    },
    //变更集
    mutations: {
        change_user_right (state) {
            state.user_right = 2
        },
        pay_password_status (state) {
            state.have_pay_password = true
        },
        banalce_status (state) {
            state.have_banlance = true
        }
    },
    plugins: [createPersistedState({
        reducer (val) {
            //配置需要存储到localstorage的state
            return {
                // 只储存state中的assessmentData
                user_right: val.user_right,
                have_pay_password: val.have_pay_password,
                have_banlance: val.have_banlance
            }
        }

    })]
})

export default store