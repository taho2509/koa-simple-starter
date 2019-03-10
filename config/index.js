const envKeys = ['PORT', 'NODE_ENV', 'LOG_LEVEL']
module.exports = (function() {
    const configurations = new Map();
    envKeys.forEach(key => configurations.set(key, process.env[key]))
    
    console.log('configuration loaded', configurations)
    return {
        get: key => configurations.get(key)
    }
})()