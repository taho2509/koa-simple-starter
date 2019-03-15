type EnvKey = 'PORT'| 'NODE_ENV'| 'LOG_LEVEL'
const envKeys: Array<EnvKey> = ['PORT', 'NODE_ENV', 'LOG_LEVEL']

interface Configurations {
  get: (key: EnvKey) => string
  getAll: () => Map<string, any>
}

function configureEnvironmentVariables(): Configurations {
  const configurations = new Map<string, any>()
  envKeys.forEach(key => configurations.set(key, process.env[key]))
  
  return {
    get: key => configurations.get(key),
    getAll: () => configurations
  }
}

const configuration = configureEnvironmentVariables()
export default configuration
