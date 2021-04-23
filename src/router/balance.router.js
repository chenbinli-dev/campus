const Balance = () => import('views/balance/Balance')
const Recharge = () => import('views/balance/Recharge')
const Withdraw = () => import('views/balance/Withdraw')

export default [
    {
        //用户余额界面
        path: '/user/balance',
        component: Balance,
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
]