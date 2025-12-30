const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
  const PRODUCTION = env === 'production';
  console.log(`Build ENV=${env}`);

  const mode = PRODUCTION ? 'production' : 'development';

  return [
    {
      // Sass
      mode,
      devtool: !PRODUCTION ? 'inline-source-map' : false,
      context: path.join(__dirname, 'src/sass'),
      entry: {
        main: './main.scss',
      },
      output: {
        path: path.join(__dirname, 'docs/css'),
      },
      module: {
        rules: [
          {
            test: /\.scss$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  url: false,
                  sourceMap: !PRODUCTION,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: !PRODUCTION,
                },
              },
            ],
          },
        ],
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: '[name].css',
        }),
      ],
    },
    {
      // ECMA Script2015(ES6)
      mode,
      devtool: !PRODUCTION ? 'inline-source-map' : false,
      context: path.join(__dirname, 'src/es2015'),
      entry: {
        main: './main.js',
      },
      output: {
        path: path.join(__dirname, 'docs/js'),
        filename: '[name].js',
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
          },
        ],
      },
    },
  ];
};
