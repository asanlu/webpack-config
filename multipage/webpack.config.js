const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const glob = require('glob')

module.exports = {
  devtool: 'eval-source-map',
  // entry: './src/index.js', // 入口文件 单入口 string/array，多入口object
  entry: {
    index: './src/index.js',
    test: './src/b.js'
  },
  output: {
    path: path.join(__dirname, 'dist'), // 出口目录，dist文件
    filename: 'static/js/[name].[hash].js', // name是entry入口的key值，单入口就是main
    publicPath: '/'      // 同时要处理打包图片路径问题，
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        // use: ExtractTextPlugin.extract({
        //   fallback: 'style-loader',
        //   use: ['css-loader', 'postcss-loader', 'sass-loader']
        // }),
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        include: path.join(__dirname, 'src'), //限制范围，提高打包速度0
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)/,
        use: {
          loader: 'url-loader',
          options: {
            outputPath: 'static/images/',  // 图片输出的路径
            limit: 5 * 1024
          }
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'] // 转es6
          }
        },
        include: path.join(__dirname, 'src'), //限制范围，提高打包速度
        exclude: /node_modules/
      },
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'initial',    // all, async, initial 三选一, 插件作用的chunks范围
      cacheGroups: {
        // split `node_modules`目录下被打包的代码到 `page/vendor.js && .css` 没找到可打包文件的话，则没有
        // vendor: {
        //   test: /node_modules\//,
        //   name: 'vendor',
        //   priority: 10,
        //   enforce: true
        // },
        // split `common`和`components`目录下被打包的代码到`page/commons.js && .css`
        commons: {
          // test: /common\/|components\//,
          minSize: 0,           // 最小尺寸
          minChunks: 2,         // 最小chunks
          // maxAsyncRequests： 5 // 最大异步请求chunks
          maxInitialRequests: 5, // 最大初始化chunks
          name: 'common'
        }
      }
    }
  },
  resolve: {
    extensions: ['.js', '.json', '.scss'],
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
    // new ExtractTextPlugin({
    //   // filename: 'static/css/[name].[hash].css' //放到dist/css/下
    //   filename: 'static/css/test.css' //放到dist/css/下
    // }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      // filename: devMode ? '[name].css' : '[name].[hash].css',
      // chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
      filename: 'static/file/[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    }),

    //  设置html模版，让入口js加载到相应的html里
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/view/index.html'),
      filename: 'index.html',
      chunks: ['index', 'common'],
      // hash: true,//防止缓存
      // minify: { // html压缩
      //   removeAttributeQuotes: true//压缩 去掉引号
      // }
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/view/test.html'),
      filename: 'test.html',
      chunks: ['test', 'common'],
    }),

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
  devServer: {
    contentBase: path.join(__dirname, "dist"), //静态文件根目录
    port: 8088, // 端口
    host: 'localhost',
    overlay: true,
    compress: true // 服务器返回浏览器的时候是否启动gzip压缩
  }
}

// webpack4.x 内置optimization.minimize压缩代码
