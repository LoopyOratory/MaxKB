const directives = import.meta.glob('./*.ts', { eager: true });
const install = (app) => {
    Object.keys(directives)
        .filter((key) => {
        return !key.endsWith('index.ts');
    })
        .forEach((key) => {
        const directive = directives[key];
        app.use(directive.default);
    });
};
export default { install };
