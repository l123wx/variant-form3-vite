export const loadExtension = function (app) {
    const modules = import.meta.globEager('./*/index.js')
    for (const path in modules) {
        const defaultFunction = modules[path].default

        if (Object.prototype.toString.call(defaultFunction) === '[object Function]') {
            try {
                defaultFunction(app)
            } catch (e) {
                console.error(e)
            }
        }
    }
}
