const path = require('path');

class ComponentResolver {
  constructor(options) {
    this.components = options.components;
  }
  apply(resolver) {
    const components = this.components;
    resolver.plugin('module', function (initialRequest, callback) {
      const request = initialRequest.request;
      // ignore relative or absolute paths
      if (/^\W+/.test(request)) {
        return callback();
      }
      const componentId = getPathHead(request);
      const requestTail = getPathTail(request);
      const component = components.find('id', componentId);

      //ignore paths which don't match a component
      if (!component) {
        return callback();
      }
      const componentPath = component.path;
      const newPath = path.join(componentPath, requestTail);
      //create a new request to resolve the full path
      const resolvedRequest = {
        path: newPath,
        query: initialRequest.query,
        file: true, resolved: true
      };
      return resolver.doResolve('file', resolvedRequest, `expanded component path "${request}" to "${newPath}"`, callback);
    });
  }
}

const getPathHead = request => {
  return request.split(path.sep)[0];
}
const getPathTail = request => {
  return request.split(path.sep).slice(1).join(path.sep);
}

module.exports = ComponentResolver;
