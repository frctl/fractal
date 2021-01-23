const md = require('../src/markdown');

const code = `
\`\`\`
module.exports = {
    foo: 'bar',
};
\`\`\`
`;

const codeWithLang = `
\`\`\`js
module.exports = {
    foo: 'bar',
};
\`\`\`
`;

describe('Markdown renderer', () => {
    it('does not directly mutate the supplied configuration object', () => {
        const config = {};
        md('**foo**', config);
        expect(config).toEqual({});
    });

    it('renders markdown correctly', () => {
        const result = md('**foo**');
        expect(result).toMatchSnapshot();
    });

    it('renders code correctly', () => {
        const result = md(code);
        expect(result).toMatchSnapshot();
    });

    it('renders code with lang correctly', () => {
        const result = md(codeWithLang);
        expect(result).toMatchSnapshot();
    });
});
