/* 配置项目的路由 */
import Vue from "vue"
import Router from 'vue-router'
import userRequest from 'network/http'
import { Toast } from 'vant'
//导入模块路由
import common from './common.router'
import userRouter from './user.router'
import taskRouter from './task.router'
import messageRouter from './message.router'
import balanceRouter from './balance.router'

//安装路由
Vue.use(Router)
//创建路由实例
const router = new Router({
    routes: [
        ...common,
        ...userRouter,
        ...taskRouter,
        ...messageRouter,
        ...balanceRouter
    ],
    mode: "hash"
})


//设置路由跳转重复的处理
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
}
//监听路由跳转，判断页面是否需要用户登录
router.beforeEach((to, from, next) => {
    if (to.meta.needLogin === true && localStorage.getItem('TOKEN')) {
        //页面需要登录，且本地有用户token,验证用户token是否过期
        userRequest.get(
            '/user/verifyToken',
            {
                headers: { 'Authorization': localStorage.getItem('TOKEN') }

            }
        )
            .then(res => {
                // console.log(res.data);
                //用户登录信息过期，跳转至登录页面
                if (!res.data.VerifyTokenMessage && !res.data.VerifyCode) {
                    Toast({
                        type: 'fail',
                        duration: 1000,
                        message: '登录信息过期',
                        onClose: () => {
                            router.push('/user/login')
                        }

                    })
                }
            })
            .catch(err => {
                console.log(err)

            })

    } else if (to.meta.needLogin === true && !localStorage.getItem('TOKEN')) {
        //token已过期或本地不存在
        Toast({
            type: 'fail',
            duration: 1000,
            message: '登录信息过期',
            onClose: () => {
                router.push('/user/login')
            }

        })
    }

    next()
})
export default router