const {join} = require('path');

module.exports = {
  entry: [
    join(__dirname, 'src/client/app/main.js')
  ],
  output: {
    path: join(__dirname, 'dist'),
    publicPath: '/_inspector/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader'
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [],
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      styles: join(__dirname, 'src/client/assets/scss')
    }
  }
};
