const Message = () => import('views/message/Message')
const Chat = () => import('views/message/Chat')

export default [
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
        path: '/chat',
        component: Chat,
        meta: {
            needLogin: true
        }
    },
]