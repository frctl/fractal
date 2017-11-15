module.exports = {

  port: 8888,
  plugins: [],
  components: {
    filter: component => component.getConfig('inspector') !== false
  }

};
