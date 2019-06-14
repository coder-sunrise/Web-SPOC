// Change theme plugin

import MergeLessPlugin from 'antd-pro-merge-less'
import AntDesignThemePlugin from 'antd-theme-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

import path from 'path'

export default (config) => {
  // config.module
  //   .rule('compile')
  //   .use('babel')
  //   .tap(options => ()=>{
  //     options.plugins.push('@extjs/reactor-babel-plugin')
  //     return options
  //   })
  // .loader('babel-loader')
  // .options({
  //   // presets: ['react-app'],
  //   plugins:["@extjs/reactor-babel-plugin"],
  // })
  // config.plugin('ext-js-react').use(new ExtReactWebpackPlugin())
  const outFile = path.join(__dirname, '../.temp/ant-design-pro.less')
  const srcDir = path.join(__dirname, '../src/')
  // pro 和 开发环境再添加这个插件
  if (
    process.env.APP_TYPE === 'site' ||
    process.env.NODE_ENV !== 'production'
  ) {
    // config.module.rule('font')
    // .pre()
    // .test(/\.(eot|ttf|woff|woff2)$/)
    // // .include
    // //   .add(/node_modules/)
    // //   .end()
    // .use('font-loader').loader('file-loader?name=/[name].[ext]')
    // 将所有 less 合并为一个供 themePlugin使用
    // config.plugin('merge-less').use(MergeLessPlugin, [
    //   {
    //     stylesDir:srcDir,
    //     outFile,
    //   },
    // ])
    // config.plugin('ant-design-theme').use(AntDesignThemePlugin, [
    //   {
    //     antDir: path.join(__dirname, '../node_modules/antd'),
    //     stylesDir:srcDir,
    //     varFile: path.join(__dirname, '../node_modules/antd/lib/style/themes/default.less'),
    //     // varFile: path.join(__dirname, '../src/assets/scss/material-dashboard-pro-react'),
    //     mainLessFile: outFile, //     themeVariables: ['@primary-color'],
    //     indexFileName: 'index.html',
    //     generateOne: true,
    //     lessUrl: 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js',
    //   },
    // ])
    // config.plugin('add-scss').use(ExtractTextPlugin, [
    //   {
    //     filename:'style.css',
    //   },
    // ])
    // const extract = ExtractTextPlugin.extract({
    //   fallback: 'style-loader',
    //   use: ['css-loader', 'sass-loader'],
    // })
    // const styleRule = config.module.rule('sass')
    // extract.forEach(({ loader, options }, i) => {
    //   console.log(JSON.stringify(loader))
    //   console.log(JSON.stringify(options))
    //   styleRule.use(`extract-text-webpack-plugin-loader${i}`).loader(loader, loader, options)
    // })
    // config.module.rule('sass').use('extract-text-webpack-plugin-loader').loader(ExtractTextPlugin.extract({
    //   fallback: 'style-loader',
    //   use: ['css-loader', 'sass-loader']
    // }))
    // config.module.rule('scss').use('style-loader').loader("style-loader!css-loader")
    //   config.resolve
    // .rule('font')
    //   .before('css')
    // config.module.rule('css').use('style-loader').loader("style-loader!css-loader")
    // config.plugin('ext-js-react').use(require('@sencha/ext-react-webpack-plugin'),[{
    //   framework: 'react',
    //     // port,
    //   profile: process.env.npm_package_extbuild_defaultprofile,
    //   environment: process.env.npm_package_extbuild_defaultenvironment,
    //   verbose: process.env.npm_package_extbuild_defaultverbose,
    // }])
    // config.module.rule('js').use('babel-loader')
    // .tap(options =>{
    //   options.plugins.push(['@sencha/ext-react-babel-plugin'])
    //   return options
    // })
    // config.plugin('ext-js-react').use(require('uglifyjs-webpack-plugin'))
    // ExtJs React
    // config.merge({
    //   plugin: {
    //     install: {
    //       plugin: require('@sencha/ext-react-webpack-plugin'),
    //       args: [{}],
    //     },
    //   },
    // })
    // config.merge({
    //   plugin: {
    //     install: {
    //       plugin: require('uglifyjs-webpack-plugin'),
    //       args: [{
    //         sourceMap: false,
    //         uglifyOptions: {
    //           compress: {
    //             // 删除所有的 `console` 语句
    //             drop_console: true,
    //           },
    //           output: {
    //             // 最紧凑的输出
    //             beautify: false,
    //             // 删除所有的注释
    //             comments: false,
    //           },
    //         },
    //       }],
    //     },
    //   },
    // })
    //   config.module
    // .rule('compile')
    //   .use('babel')
    //     .tap(options => merge(options, {
    //       plugins: ['@babel/plugin-proposal-class-properties']
    //     }));
    // config.merge({
    //   module: {
    //     rule:[{
    //       test: /\.(eot|svg|ttf|woff|woff2)$/,
    //       use:[
    //         { loader: "url-loader?name=[name].[ext]" },
    //       ],
    //     }],
    //   },
    // })
  }
  config.merge({
    resolve: {
      alias: {
        assets: path.resolve(srcDir, 'assets/'),
        'mui-pro-jss': path.resolve(srcDir, 'assets/jss/'),
        'mui-pro-scss': path.resolve(srcDir, 'assets/scss/'),
        'mui-pro-components': path.resolve(srcDir, 'components/mui-pro/'),
        'medisys-model': path.resolve(srcDir, 'utils/model/'),
        'medisys-util': path.resolve(srcDir, 'utils/cdrss/'),
        utils: path.resolve(srcDir, 'utils/utils/'),
      },
    },
    // entry: {
    //   sass:path.resolve(srcDir, 'assets/scss/material-dashboard-pro-react.scss')
    // },

    // module:{
    //   rules:[
    //     { // sass / scss loader for webpack
    //       test: /\.(sass|scss)$/,
    //       loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
    //     }
    //   ],
    // },
    // plugins: [
    //   new ExtractTextPlugin('mui-pro.bundle.css'),
    // ]
  })
  // config.plugins.delete('extract-css')
  console.log(config.toString())
}
