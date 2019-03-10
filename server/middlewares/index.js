const fs = require('fs')
const path = require('path')

module.exports = {
    register: (app) => {
        console.log('Registering middlewares');
        let middlewaresConfig = {}
        try {
            middlewaresConfig = JSON.parse(
                fs.readFileSync(path.join(__dirname, 'order_configuration.json'), { encoding: 'utf8'})
            )        
        } catch (error) {
            throw new Error('"order_configuration.json" file no found.')
        }
        
        Object.keys(middlewaresConfig)
            .forEach(middlewareFolder => {
                const stats = fs.lstatSync(path.join(__dirname, middlewareFolder))
                if (stats.isDirectory()) {
                    const middleware = require(path.join(__dirname, middlewareFolder))
                    app.use(middleware)
                    console.log(`-- registered "${middlewareFolder}"`);
                }
            })
    }
}