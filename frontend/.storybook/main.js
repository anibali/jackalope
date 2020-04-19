const path = require('path');


const nodeModulesPath = path.resolve(process.env.NODE_PATH || 'node_modules');


module.exports = {
  stories: ['../stories/**/*.js'],
  addons: ['@storybook/addon-viewport/register'],
  webpackFinal: async config => {
    config.entry.push('./src/styles/main.global.css');

    config.module.rules.find(
      rule => rule.test.toString() === '/\\.css$/',
    ).include = nodeModulesPath;

    config.module.rules.push(
      {
        test: /\.global.css$/,
        include: [
          path.resolve('src/styles'),
        ],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
          },
        ],
      },
      {
        test: /^((?!\.global).)*css$/,
        include: [
          path.resolve('src/styles'),
        ],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: 'local',
            },
          },
        ],
      },
    );
    return config;
  },
};
