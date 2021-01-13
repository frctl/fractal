module.exports = function tree(fractal) {
    it('inherits context from parents', () => {
        expect(fractal.components.find('@subtree-leaf').context.root).toBe(true);
        expect(fractal.components.find('@subtree-leaf').context.subTree).toBe(true);
        expect(fractal.components.find('@subtree-leaf').context.subTreeLeaf).toBe(true);
    });

    it('overrides context from parents', () => {
        expect(fractal.components.find('@tree-leaf--another').context.level).toBe(2);
    });

    it('overrides context from parents and pass it further down', () => {
        expect(fractal.components.find('@subtree-leaf').context.level).toBe(2);
    });
};
