// 用来配置文件的别名，方便路径的寻找
const path = require('path')//引入path模块
function resolve (dir) {
    return path.resolve(__dirname, dir)//path.join(__dirname)设置绝对路径
}
const vantChange = path.resolve(__dirname, './src/assets/less/vantChange.less')
module.exports = {
    publicPath: process.env.NODE_ENV === 'development' ? '/' : './',
    chainWebpack: (config) => {
        config.resolve.alias
            //set第一个参数：设置的别名，第二个参数：设置的路径
            .set('components', resolve('./src/components'))
            .set('views', resolve('./src/views'))
            .set('assets', resolve('./src/assets'))
            .set('network', resolve('./src/network'))
            .set('router', resolve('./src/router'))
            .set('location', resolve('./src/location'))
    },
    css: {
        loaderOptions: {
            less: {
                // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
                lessOptions: {
                    modifyVars: {
                        // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
                        hack: `true; @import "${vantChange}";`,
                    },
                },
            },
        },
    },
}