const envKeys: Array<string> = ['PORT', 'NODE_ENV', 'LOG_LEVEL']

interface Configurations {
  get: (key: string) => string | number
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
