const path = require('path');
const webpack = require('webpack');

module.exports = ({ config, mode }) => {
  // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
  config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/]

  // use installed babel-loader which is v8.0-beta (which is meant to work with @babel/core@7)
  config.module.rules[0].use[0].loader = require.resolve("babel-loader")

  // use @babel/preset-react for JSX and env (instead of staged presets)
  config.module.rules[0].use[0].options.presets = [
    require.resolve("@babel/preset-react"),
    require.resolve("@babel/preset-env"),
  ]

  // use @babel/plugin-proposal-class-properties for class arrow functions
  config.module.rules[0].use[0].options.plugins = [
    require.resolve("babel-plugin-remove-graphql-queries"),
    require.resolve("@babel/plugin-proposal-class-properties"),
  ]

  // Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
  config.resolve.mainFields = ["browser", "module", "main"]

  // Config for TypeScript
  config.module.rules.push({
    test: /\.tsx?$/,
    include: [
      path.resolve(__dirname, "../src"),
      path.resolve(__dirname, "../stories"),
    ],
    loader: require.resolve("babel-loader"),
    options: {
      presets: ['react-app'],
      plugins: [
        require.resolve("babel-plugin-remove-graphql-queries"),
        require.resolve("@babel/plugin-proposal-class-properties"),
      ],
    }
  })
  config.resolve.extensions.push(".ts", ".tsx");

  // Config for addon-storysource
  config.module.rules.push({
    test: /\.stories\.tsx?$/,
    loaders: [
      {
        loader: require.resolve('@storybook/addon-storysource/loader'),
        options: { 
          parser: 'typescript' 
        },
      }
    ],
    enforce: 'pre',
  });

  // Config for SASS
  config.module.rules.push({
    test: /\.module\.(scss|sass)$/,
    use: [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 2,
          camelCase: true, 
          modules: true
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
  });

  // Misc
  const coPaths = require(path.resolve(__dirname, '../tsconfig.json')).compilerOptions.paths;
  config.resolve.alias = Object.keys(coPaths).filter(rPath => {
      return /^\S+\/\*$/.test(rPath) && coPaths[rPath].length === 1;
    }).reduce((pv, cv) => {
      const dirInPaths = cv.replace(/\/\*$/, '');
      const dirMapped = coPaths[cv][0].replace(/\/\*$/, '');
      pv[dirInPaths] = path.resolve(__dirname, '..', dirMapped);
      return pv;
    }, {});
  config.node = {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  };
  config.plugins.push(
    new webpack.DefinePlugin({
      //double stringify because node-config expects this to be a string
      'process.env.NODE_CONFIG': JSON.stringify(JSON.stringify(require('config'))),
    })
  );

  return config
}