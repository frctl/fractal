const Theme = require('../src/theme');

describe('Theme', () => {
    it('is an event emitter', () => {
        const theme = new Theme();
        expect(theme.hasMixedIn('Emitter')).toBe(true);
    });

    it('is configurable', () => {
        const theme = new Theme();
        expect(theme.hasMixedIn('Configurable')).toBe(true);
    });

    it('has default error view', () => {
        const theme = new Theme();
        expect(theme.errorView()).toBe('__system/error.nunj');
    });

    it('can be configured to use custom error view', () => {
        const theme = new Theme();
        theme.setErrorView('custom_error_view.nunj');
        expect(theme.errorView()).toBe('custom_error_view.nunj');
    });

    it('has default redirect view', () => {
        const theme = new Theme();
        expect(theme.redirectView()).toBe('__system/redirect.nunj');
    });

    it('can be configured to use custom redirect view', () => {
        const theme = new Theme();
        theme.setRedirectView('custom_redirect_view.nunj');
        expect(theme.redirectView()).toBe('custom_redirect_view.nunj');
    });

    it('adds paths passed to constructor to load paths', () => {
        const theme = new Theme(['load_path']);
        expect(theme.loadPaths()).toEqual(['load_path']);
    });

    it('adds additional load paths', () => {
        const theme = new Theme(['load_path']);
        theme.addLoadPath(['second_load_path']);
        expect(theme.loadPaths()).toEqual(['second_load_path', 'load_path']);
    });

    it('does not add duplicate load paths', () => {
        const theme = new Theme(['load_path']);
        theme.addLoadPath(['load_path']);
        expect(theme.loadPaths()).toEqual(['load_path']);
    });

    it('adds static path', () => {
        const theme = new Theme();
        theme.addStatic('path', 'mount');
        theme.addStatic('path2', 'mount2');
        expect(theme.static()).toEqual([
            { path: 'path', mount: 'mount' },
            { path: 'path2', mount: 'mount2' },
        ]);
    });

    it('does not add duplicate static path', () => {
        const theme = new Theme();
        theme.addStatic('path', 'mount');
        theme.addStatic('path', 'mount');
        expect(theme.static()).toEqual([{ path: 'path', mount: 'mount' }]);
    });

    it('adds route and resolver for path without handle', () => {
        const theme = new Theme();
        theme.addRoute('/', {});
        expect(theme.routes()).toEqual([
            {
                path: '/',
                handle: '/',
                keys: [],
                // eslint-disable-next-line no-useless-escape
                matcher: /^\/[\/#\?]?$/i,
            },
        ]);
        expect(theme.resolvers()).toEqual({ '/': [null] });
    });

    it('adds route and resolver for path with handle', () => {
        const theme = new Theme();
        theme.addRoute('/', { handle: 'handle' });
        expect(theme.routes()).toEqual([
            {
                path: '/',
                handle: 'handle',
                keys: [],
                // eslint-disable-next-line no-useless-escape
                matcher: /^\/[\/#\?]?$/i,
            },
        ]);
        expect(theme.resolvers()).toEqual({ handle: [null] });
    });

    it('adds route and resolver with function', () => {
        const theme = new Theme();
        const resolver = jest.fn();
        theme.addRoute('/', {}, resolver);
        expect(theme.routes()).toEqual([
            {
                path: '/',
                handle: '/',
                keys: [],
                // eslint-disable-next-line no-useless-escape
                matcher: /^\/[\/#\?]?$/i,
            },
        ]);
        expect(theme.resolvers()).toEqual({ '/': [resolver] });
    });

    it('does not return route if route does not exist', () => {
        const theme = new Theme();
        expect(theme.matchRoute('/test-route')).toEqual(false);
    });

    it('returns default index route for root if no matching route has been registered', () => {
        const theme = new Theme();
        expect(theme.matchRoute('/')).toEqual({
            route: {
                handle: '__system-index',
                view: '__system/index.nunj',
            },
            params: {},
        });
    });

    it('returns route from registered routes if path matches', () => {
        const theme = new Theme();
        // add 404 as first route to match the second route in routes for coverage
        theme.addRoute('/404', {});
        theme.addRoute('/', {});
        expect(theme.matchRoute('/')).toEqual({
            route: {
                path: '/',
                handle: '/',
                keys: [],
                // eslint-disable-next-line no-useless-escape
                matcher: /^\/[\/#\?]?$/i,
            },
            params: {},
        });
    });

    it('returns route with params if route has keys', () => {
        const theme = new Theme();
        // add 404 as first route to match the second route in routes for coverage
        theme.addRoute('/:name', {});
        expect(theme.matchRoute('/test')).toEqual({
            route: {
                path: '/:name',
                handle: '/:name',
                keys: [
                    {
                        modifier: '',
                        name: 'name',
                        pattern: '[^\\/#\\?]+?',
                        prefix: '/',
                        suffix: '',
                    },
                ],
                // eslint-disable-next-line no-useless-escape
                matcher: /^(?:\/([^\/#\?]+?))[\/#\?]?$/i,
            },
            params: {
                name: 'test',
            },
        });
    });

    it('returns url from route handle if matching route exists', () => {
        const theme = new Theme();
        theme.addRoute('/:name', {});
        expect(theme.urlFromRoute('/:name', { name: 'test' })).toEqual('/test');
    });

    it('returns redirect url if route has redirect', () => {
        const theme = new Theme();
        theme.addRoute('/:name', { redirect: '/' });
        expect(theme.urlFromRoute('/:name', { name: 'test' })).toEqual('/');
    });

    it('does not return url if no matching route exists', () => {
        const theme = new Theme();
        expect(theme.urlFromRoute('/')).toEqual(null);
    });
});
