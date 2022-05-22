const path = require('path');

let params = {
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
};
if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production') {
  params = {
    mode: 'production',
    devtool: false,
    watch: false,
  };
}

module.exports = {
  ...params,
  entry: {
    main: './index.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js' // <--- Will be compiled to this single file
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: []
  }
};