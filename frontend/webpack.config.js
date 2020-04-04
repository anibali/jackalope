const webpack = require('webpack');
const path = require('path');
const process = require('process');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


// Determine whether we are in development or production mode.
const possibleModes = ['development', 'production'];
const mode = process.env.NODE_ENV || 'development';
console.assert(possibleModes.includes(mode));

// Put chunk hash in asset filenames when in production mode.
const assetBasename = mode === 'production' ? '[name]-[chunkhash]' : '[name]';

const nodeModulesPath = path.resolve(process.env.NODE_PATH || 'node_modules');


const cssPipeline = ({ modules }) => [
  { loader: MiniCssExtractPlugin.loader },
  {
    loader: 'css-loader',
    options: {
      modules,
    }
  },
];


module.exports = {
  mode,
  entry: {
    app: ['./src/entryPoint.js', './src/styles/main.global.css'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `${assetBasename}.js`,
    chunkFilename: `${assetBasename}.js`,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
      },
    }),
    new webpack.HashedModuleIdsPlugin(),
    new MiniCssExtractPlugin({
      filename: `${assetBasename}.css`,
      chunkFilename: `${assetBasename}.css`,
    }),
    new HtmlWebpackPlugin({
      title: 'Jackalope',
      template: 'src/template.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve('src'),
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              sourceType: 'unambiguous',
              presets: [
                ['@babel/preset-env', {
                  modules: false,
                  corejs: '3',
                  useBuiltIns: 'usage',
                }],
                '@babel/preset-react'
              ],
            }
          },
        ]
      },
      {
        test: /\.global.css$/,
        include: [
          path.resolve('src/styles'),
        ],
        use: cssPipeline({ modules: false }),
      },
      {
        test: /^((?!\.global).)*css$/,
        include: [
          path.resolve('src/styles'),
        ],
        use: cssPipeline({ modules: 'local' }),
      },
      {
        test: /\.css$/,
        include: [
          nodeModulesPath,
        ],
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              modules: false,
            }
          },
        ]
      },
    ],
  },
  resolveLoader: {
    modules: [nodeModulesPath],
  },
  resolve: {
    modules: [nodeModulesPath],
  }
};
