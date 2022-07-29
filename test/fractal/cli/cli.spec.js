const app = require('../../../src/fractal/fractal')();
const Cli = require('../../../src/fractal/cli');
const Console = require('../../../src/fractal/cli/console');

describe('Cli', () => {
    let cli;

    beforeEach(() => {
        cli = new Cli(app);
        cli.console = new Console({
            log: () => {},
        });
    });

    it.todo('is configurable');

    describe('.console', () => {
        it('is an instance of Console', () => {
            expect(cli.console).toBeInstanceOf(Console);
        });
    });

    describe('.theme()', () => {
        it.todo('sets the CLI theme');
    });

    describe('.exec()', () => {
        it.todo('executes a command from a string');
    });

    describe('.exec()', () => {
        it.todo('executes a command');
    });

    for (let method of ['log', 'error', 'warn', 'success', 'debug']) {
        describe(`.${method}()`, () => {
            it(`calls the console ${method} method`, () => {
                const spy = jest.spyOn(cli.console, method);
                cli[method]('Message');
                expect(spy).toHaveBeenCalled();
                expect(spy).toHaveBeenCalledWith('Message');
            });
        });
    }
});
