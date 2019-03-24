const wp = require('@cypress/webpack-preprocessor')
module.exports = (on) => {
  const options = {
    webpackOptions: {
      resolve: {
        extensions: [".ts", ".tsx", ".js"]
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      }
    },
  }
  on('file:preprocessor', wp(options))
}
