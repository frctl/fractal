const app = require('../../fractal/src/fractal')();

const Theme = require('../src/theme');

const Server = require('../src/server');

describe('Server', () => {
    let server;

    beforeEach(() => {
        server = new Server(new Theme(), {}, app);
    });

    it('is an event emitter', () => {
        expect(server.hasMixedIn('Emitter')).toBe(true);
    });
});
