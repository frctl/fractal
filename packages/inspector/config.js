module.exports = {

  port: 8888,
  plugins: [
    require('./src/plugins/engines')()
  ]

};
