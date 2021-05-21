import path from 'path'

export default config => {
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
  const srcDir = path.join(__dirname, '../src/')
  config.module
    .rule('media')
    .test(/.wav$/)
    .use('file-loader')
    .loader(require.resolve('file-loader'))
  config.merge({
    resolve: {
      alias: {
        assets: path.resolve(srcDir, 'assets/'),
        'mui-pro-jss': path.resolve(srcDir, 'assets/jss/'),
        'mui-pro-scss': path.resolve(srcDir, 'assets/scss/'),
        'mui-pro-components': path.resolve(srcDir, 'components/mui-pro/'),
        'medisys-model': path.resolve(srcDir, 'utils/model/'),
        utils: path.resolve(srcDir, 'utils/utils/'),
        'medisys-components': path.resolve(srcDir, 'components/_medisys/'),
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
  // console.log(config.toString())
}
