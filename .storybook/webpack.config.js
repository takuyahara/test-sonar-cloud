const path = require('path');
const fs = require('fs');

const srcDir = path.resolve(__dirname, '../src');
const alias = fs.readdirSync(srcDir).filter(filename => {
  return fs.statSync(path.resolve(srcDir, filename)).isDirectory();
}).reduce((obj, dir) => {
  obj[dir] = path.resolve(srcDir, dir);
  return obj;
}, {});

module.exports = {
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(ts|tsx)$/,
            use: [
              {
                loader: require.resolve("babel-loader")
              }
            ],
          },
          {
            test: /\.module\.(scss|sass)$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 2,
                  modules: true,
                  camelCase: true, 
                  localIdentName: '[local]-[hash:base64:5]',
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    require('postcss-preset-env')({
                      autoprefixer: {
                        flexbox: 'no-2009',
                      },
                      stage: 3,
                    }),
                  ],
                },
              },
              {
                loader: require.resolve('sass-loader'),
              }
            ]
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/, /\.ejs$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ]
      }
    ]
  },
  resolve: {
    extensions: [
      ".ts", 
      ".tsx"
    ],
    alias: alias
  }
};
