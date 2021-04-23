const Login = () => import('views/login/Login')
const Register = () => import('views/register/Register')
const Home = () => import('views/home/Home')

const Setting = () => import('views/setting/Setting')

export default [
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
        //主页
        path: "/home",
        component: Home,
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
]