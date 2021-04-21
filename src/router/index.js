/* 配置项目的路由 */
import Vue from "vue"
import Router from 'vue-router'
import userRequest from 'network/http'
import { Toast } from 'vant'

const Login = () => import('views/login/Login')
const Register = () => import('views/register/Register')
//用户信息
const Profile = () => import('views/profile/Profile')
const EditProfile = () => import('views/profile/EditProfile')
const EditPassword = () => import('views/profile/EditPassword')

const Home = () => import('views/home/Home')
//用户任务
const UserTask = () => import('views/usertask/UserTask')
const ReleaseTask = () => import('views/task/ReleaseTask')
const TaskDetails = () => import('views/task/TaskDetails')
const ReceiveTaskStatus = () => import('views/task/ReceiveTaskStatus')
const Category = () => import('views/task/Category')
//用户聊天，接受消息
const Message = () => import('views/message/Message')
const Chat = () => import('views/message/Chat')

const Setting = () => import('views/setting/Setting')
//学生认证
const Verify = () => import('views/verify/Verify')
const SubmitInfo = () => import('views/verify/SubmitInfo')
//余额页面
const Balance = () => import('views/balance/Balance')
const Recharge = () => import('views/balance/Recharge')
const Withdraw = () => import('views/balance/Withdraw')
//地址管理
const Address = () => import('views/address/Address')

//安装路由
Vue.use(Router)
//配置每个页面的路由信息
const routes = [
    {
        //启动项目默认进入登录页面
        path: '',
        redirect: '/user/login'
    },
    {
        //用户登录页面
        path: "/user/login",
        component: Login
    },
    {
        //用户注册页面
        path: "/user/register",
        component: Register
    },
    {
        //用户个人信息页面
        path: "/user/profile",
        component: Profile,
        meta: {
            needLogin: true
        }
    },
    {
        //主页
        path: "/home",
        component: Home,
        meta: {
            needLogin: true
        }
    },
    {
        //用户已发布或已接取任务页面
        path: "/usertask",
        component: UserTask,
        meta: {
            needLogin: true,
        }
    },
    {
        //消息界面
        path: '/user/message',
        component: Message,
        meta: {
            needLogin: true
        }
    },
    {
        //用户聊天界面
        path: '/chat/:uid',
        component: Chat,
        meta: {
            needLogin: true
        }
    },
    {
        //设置界面
        path: '/user/setting',
        component: Setting,
        meta: {
            needLogin: true
        }
    },
    {
        //用户信息编辑界面
        path: '/user/editProfile',
        component: EditProfile,
        meta: {
            needLogin: true
        }
    },
    {
        //用户学生认证界面
        path: '/user/verify',
        component: Verify,
        meta: {
            needLogin: true
        }
    },
    {
        //用户学生信息提交界面
        path: '/user/verify/submitInfo',
        component: SubmitInfo,
        meta: {
            needLogin: true
        }
    },
    {
        //用户余额界面
        path: '/user/balance',
        component: Balance,
        meta: {
            needLogin: true
        }
    },
    {
        //用户地址管理页面
        path: '/user/address',
        component: Address,
        meta: {
            needLogin: true
        }
    },
    {
        //模拟充值页面
        path: '/user/recharge',
        component: Recharge,
        meta: {
            needLogin: true
        }
    },
    {
        //模拟提现页面
        path: '/user/withdraw',
        component: Withdraw,
        meta: {
            needLogin: true
        }
    },
    {
        //用户修改密码界面
        path: '/user/EditPassword',
        component: EditPassword,
        meta: {
            needLogin: true
        }
    },
    {
        //用户发布任务界面
        path: '/user/releaseTask',
        component: ReleaseTask,
        meta: {
            needLogin: true
        }
    },
    {
        //任务详情页面
        path: '/task/:tid',
        component: TaskDetails,
        meta: {
            needLogin: true
        }
    },
    {
        //任务代跑状态页
        path: '/task/receiveTask/:tid',
        component: ReceiveTaskStatus,
        meta: {
            needLogin: true
        }
    },
    {
        //任务分类页
        path: '/category',
        component: Category,
        meta: {
            needLogin: true
        }
    }
]
//创建路由实例
const router = new Router({
    routes,
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