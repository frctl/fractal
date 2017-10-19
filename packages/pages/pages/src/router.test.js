const {expect} = require('../../../../test/helpers');
// const {ComponentCollection, FileCollection} = require('@frctl/support');
const PageCollection = require('./support/page-collection');
const Router = require('./router');

// const collections = {
//   site: {
//     files: new FilesCollection(),
//     components: new ComponentCollection()
//   },
//   library: {
//     files: new FileCollection(),
//     templates: new FileCollection(),
//     assets: new FileCollection()
//   }
// };

// const routes = {
//   stringRoute: 'library.assets',
//   simpleFilesRouteWithPermalink: {
//     collection: 'library.assets',
//     permalink: '/custom/{target.permalink}'
//   }
// };

describe('Router', function () {
  describe('.getPages()', function () {
    it('returns a PageCollection', function () {
      const router = new Router();
      expect(router.getPages()).to.be.instanceOf(PageCollection);
    });
  });

  // describe('Router.buildPages()', function () {
  //   it('throws an error if an invalid builder is provided', function () {
  //     expect(() => Router.buildPages(123)).to.throw('[builder-invalid]');
  //   });
  // });
});
