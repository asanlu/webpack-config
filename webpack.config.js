const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: './src/index.js', //入口文件，src下的index.js
  output: {
    path: path.join(__dirname, 'dist'), // 出口目录，dist文件
    filename: '[name].[hash].js', //这里name就是打包出来的文件名，因为是单入口，就是main，多入口下回分解
    publicPath: '/'      // 同时要处理打包图片路径问题，
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: path.join(__dirname, 'src'), //限制范围，提高打包速度
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        // use: ExtractTextPlugin.extract({
        //   fallback: 'style-loader',
        //   // use: ['css-loader', 'postcss-loader', 'sass-loader']
        //   use: ['css-loader', 'postcss-loader', 'sass-loader']
        // }),
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        include: path.join(__dirname, 'src'), //限制范围，提高打包速度
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
      }
    ]
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
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      filename: 'index.html',
      // hash: true,//防止缓存
      // minify: { // html压缩
      //   removeAttributeQuotes: true//压缩 去掉引号
      // }
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
      filename: 'test.css',
      chunkFilename: '[id].[hash].css'
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
    // new CleanWebpackPlugin([path.join(__dirname, 'dist')])
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