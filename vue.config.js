/*
 * @Description: 这是配置页面（组件）
 * @Date: 2020-08-13 10:05:49
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 11:18:28
 */
module.exports = {
  publicPath: "./",
  lintOnSave: false,
  productionSourceMap: false, //生产环境是否生产syourceMap文件,设置为false可减小打包后的体积
  devServer: {
    // 项目运行自动打开浏览器
    open: true,
    //关闭eslin语法检查
    overlay: {
      warnings: true,
      errors: true,
    },
    //解决跨域
    proxy: {
      "/api": {
        // http://192.168.1.116:9009
        target: "http://192.168.2.154:8080", // 后台接口域名
        ws: true, //如果要代理 websockets，配置这个参数
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, //是否跨域
        pathRewrite: {
          "^/api": "/",
        },
      },
    },
  },
};
