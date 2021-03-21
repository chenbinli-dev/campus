/* 配置项目的路由 */
import Vue from "vue";
import Router from 'vue-router';

const Login = () => import('views/login/Login');
const Register = () => import('views/register/Register');
const Profile = () => import('views/profile/Profile');
const Home = () => import('views/home/Home');
const UserTask = () => import('views/usertask/UserTask');


//安装路由
Vue.use(Router);
//配置每个页面的路由信息
const routes = [
    {
        //启动项目默认进入登录页面
        path:'',
        redirect:'/user/login'
    },
    {
        //用户登录页面
        path:"/user/login",
        component:Login
    },
    {
        //用户注册页面
        path:"/user/register",
        component:Register
    },
    {
        //用户个人信息页面
        path:"/user/profile",
        component:Profile,
    },
    {
        //主页
        path:"/home",
        component:Home
    },
    {
        //用户已发布或已接取任务页面
        path:"/usertask",
        component:UserTask
    }
]
//创建路由实例
const router = new Router({
    routes,
    mode:"history"
})

export default router;