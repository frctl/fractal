const utils = require('../src/utils');

const highlighter = require('../src/highlighter');

const code = `
module.exports = {
    foo: 'bar',
};
`;

describe('Highlighter', () => {
    afterEach(() => {
        highlighter._cache.reset();
    });

    it('highlights code with lang', () => {
        const ret = highlighter(code, 'javascript');
        expect(ret).toEqual(
            `
<span class="hljs-built_in">module</span>.exports = {
    <span class="hljs-attr">foo</span>: <span class="hljs-string">&#x27;bar&#x27;</span>,
};
`
        );
    });

    it('highlights code without lang', () => {
        const ret = highlighter(code);
        expect(ret).toEqual(
            `
<span class="hljs-built_in">module</span>.<span class="hljs-built_in">exports</span> = {
    foo: <span class="hljs-string">&#x27;bar&#x27;</span>,
};
`
        );
    });

    it('highlights code with invalid lang', () => {
        console.error = jest.fn();
        const ret = highlighter(code, 'xsfsd');
        expect(ret).toEqual(
            `
<span class="hljs-built_in">module</span>.<span class="hljs-built_in">exports</span> = {
    foo: <span class="hljs-string">&#x27;bar&#x27;</span>,
};
`
        );
        expect(console.error).toHaveBeenCalledWith(
            "Could not find the language 'xsfsd', did you forget to load/include a language module?"
        );
    });

    it('saves highlighted code to cache with md5 key from content', () => {
        const md5 = utils.md5(code);
        const hCode = `
<span class="hljs-built_in">module</span>.exports = {
    <span class="hljs-attr">foo</span>: <span class="hljs-string">&#x27;bar&#x27;</span>,
};
`;
        const ret = highlighter(code, 'javascript');
        expect(ret).toEqual(hCode);
        expect(highlighter._cache.get(md5)).toEqual(ret);
    });

    it('returns from cache on second run', () => {
        const spy = jest.spyOn(highlighter, '_highlight');
        const ret = highlighter(code, 'javascript');
        const ret2 = highlighter(code, 'javascript');

        expect(ret).toEqual(ret2);
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
