type EnvKey = 'PORT'| 'NODE_ENV'| 'LOG_LEVEL'
const envKeys: Array<EnvKey> = ['PORT', 'NODE_ENV', 'LOG_LEVEL']

interface Configurations {
  get: (key: EnvKey) => string | number
}

function configureEnvironmentVariables(): Configurations {
  const configurations = new Map<string, any>()
  envKeys.forEach(key => configurations.set(key, process.env[key]))
  
  console.log('Configurations loaded::', configurations)
  return {
    get: key => configurations.get(key)
  }
}

const configuration = configureEnvironmentVariables()
export default configuration
