const Profile = () => import('views/profile/Profile')
const EditProfile = () => import('views/profile/EditProfile')
const EditPassword = () => import('views/profile/EditPassword')
//学生认证
const Verify = () => import('views/verify/Verify')
const SubmitInfo = () => import('views/verify/SubmitInfo')
//地址管理
const Address = () => import('views/address/Address')

export default [
    {
        //用户个人信息页面
        path: "/user/profile",
        component: Profile,
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
        //用户修改密码界面
        path: '/user/EditPassword',
        component: EditPassword,
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
        //用户地址管理页面
        path: '/user/address',
        component: Address,
        meta: {
            needLogin: true
        }
    },
]