const app = require('../../src/fractal')();
const Cli = require('../../src/cli');
const Console = require('../../src/cli/console');

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

    describe('.add()', () => {
        it('adds a command with no configuration', () => {
            cli.command('test-command', () => {
                // do nothing
            });
            expect(cli.has('test-command')).toBe(true);
        });

        it('adds a command configuration', () => {
            cli.command(
                'test-command',
                {
                    description: 'This is the description',
                },
                () => {
                    // do nothing
                }
            );
            expect(cli.has('test-command')).toBe(true);
        });
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
