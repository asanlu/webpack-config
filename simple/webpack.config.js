const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 获取html-webpack-plugin参数的方法
var getHtmlConfig = function (name, title) {
  return {
    template: './src/views/' + name + '.html',
    filename: name + '.html',
    // favicon: './favicon.ico',
    title: title,
    // inject: true,
    // hash: true,
    // chunks: ['common', name]
  };
};


module.exports = {

  // 入口文件，单入口是string/array,多入口为object
  entry: './src/main.js',

  // 输出文件
  output: {
    path: path.join(__dirname, 'dist'), // 出口目录，dist文件
    filename: 'static/js/[name].[hash].js',       // name是entry入口的key值，单入口就是main
    publicPath: '/'                     // 同时要处理打包图片路径问题，
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']  // 转es6 
          }
        },
        include: path.join(__dirname, 'src'), // 限制范围，提高打包速度
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'], // 从右往左执行
        include: path.join(__dirname, 'src'),   //限制范围，提高打包速度0
        exclude: /node_modules/
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',    // 处理html图片路径打包
          // options: {
          //   attrs: [':data-src']
          // }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)/,
        use: {
          loader: 'url-loader',
          options: {
            outputPath: 'static/img/',  // 图片输出的路径
            // publicPath: '/static/images/',
            limit: 5 * 1024                // 限制打包范围
          }
        }
      },
    ]
  },

  resolve: {
    extensions: ['.js', '.json', '.scss'],   // 省略扩展名
    // 配置别名可以加快webpack查找模块的速度
    // alias: {
    // 'vue$': 'vue/dist/vue.esm.js',
    // '@': resolve('src'),
    // }
  },

  plugins: [
    // 热加载
    // new webpack.HotModuleReplacementPlugin(),

    // 暴露全局变量
    new webpack.ProvidePlugin({
      '$': 'jquery',
      jQuery: "jquery"
    }),

    // 抽离css做单独文件
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      // filename: devMode ? '[name].css' : '[name].[hash].css',
      // chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
      filename: 'static/css/global.[hash].css',
    }),

    //  设置html模版，让入口js加载到相应的html里
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, './index.html'),
    //   filename: 'index.html',
      // chunks: ['index', 'common'],
      // hash: true,//防止缓存
      // minify: { // html压缩
      //   removeAttributeQuotes: true//压缩 去掉引号
      // }
    // }),
    new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
    new HtmlWebpackPlugin(getHtmlConfig('login', '登录')),

    // 复制静态资源
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'static'),
        to: path.resolve(__dirname, 'dist/static'),
        ignore: ['.*']
      }
    ]),

    // 清空打包输出目录
    new CleanWebpackPlugin([path.join(__dirname, 'dist')])
  ],

  // watch监听文件打包变化
  watch: true,
  watchOptions: {
    ignored: /node_modules/, //忽略不用监听变更的目录
    aggregateTimeout: 500, //防止重复保存频繁重新编译,500毫米内重复保存不打包
    poll: 1000   //每秒询问的文件变更的次数
  },

  devServer: {
    contentBase: path.join(__dirname, "dist"), //静态文件根目录
    port: 8088,   // 端口
    host: 'localhost',
    overlay: true,
    compress: true // 服务器返回浏览器的时候是否启动gzip压缩
  }

}