const app = require('../../src/fractal/fractal')();

const Theme = require('../../src/web/theme');

const Server = require('../../src/web/server');

describe('Server', () => {
    let server;

    beforeEach(() => {
        server = new Server(new Theme(), {}, app);
    });

    it('is an event emitter', () => {
        expect(server.hasMixedIn('Emitter')).toBe(true);
    });
});
