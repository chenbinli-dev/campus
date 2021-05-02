const UserTask = () => import('views/usertask/UserTask')
const ReleaseTask = () => import('views/task/ReleaseTask')
const TaskDetails = () => import('views/task/TaskDetails')
const ReceiveTaskStatus = () => import('views/task/ReceiveTaskStatus')
const Category = () => import('views/task/Category')
const Comment = () => import('views/task/Comment')
const Complaint = () => import('views/task/Complaint')
export default [
    {
        //用户已发布或已接取任务页面
        path: "/usertask",
        component: UserTask,
        meta: {
            needLogin: true,
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
        //任务评价页
        path: '/task/comment/:tid',
        component: Comment,
        meta: {
            needLogin: true
        }
    },
    {
        //任务投诉页
        path:'/task/complaint/:tid',
        component:Complaint,
        meta:{
            needLogin:true
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