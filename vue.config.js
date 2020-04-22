// const path = require('path');

// const webpack = require('webpack')
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const productionGzipExtensions = ['js', 'css']
// const isProduction = process.env.NODE_ENV === 'production'

// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css']

module.exports = {
  productionSourceMap: false,
  devServer: {
    // Paths
    host: '0.0.0.0', // ip
    port: 8080, // 设置端口号
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    proxy: null,  //设置代理
    disableHostCheck: true
  },
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],
  configureWebpack: {
    externals: {
      'vue': 'Vue',
      'vuex': 'Vuex',
      'vue-router': 'VueRouter',
      'axios': 'axios',
      // 'muse-ui':'MuseUI',
      'vant':'vant',
      
    },
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  }

  // publicPath: '/appShare/',
  // productionSourceMap: false,
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       '@': path.resolve(__dirname, './src'),
  //       '@i': path.resolve(__dirname, './src/assets'),
  //     }
  //   },
  //   plugins: [
  //     // Ignore all locale files of moment.js
  //     new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

  //     // 配置compression-webpack-plugin压缩
  //     new CompressionWebpackPlugin({
  //       algorithm: 'gzip',
  //       test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
  //       threshold: 10240,
  //       minRatio: 0.8
  //     }),
  //     new webpack.optimize.LimitChunkCountPlugin({
  //       maxChunks: 5,
  //       minChunkSize: 100
  //     })
  //   ]
  // }
}