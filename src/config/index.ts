type EnvKey = 'PORT' | 'NODE_ENV' | 'LOG_LEVEL'
const envKeys: EnvKey[] = ['PORT', 'NODE_ENV', 'LOG_LEVEL']

interface Configurations {
  get: (key: EnvKey) => string
  getAll: () => Map<string, string | undefined>
}

function configureEnvironmentVariables(): Configurations {
  const configurations = new Map<string, string | undefined>()
  envKeys.forEach(
    (key): void => {
      configurations.set(key, process.env[key])
    },
  )

  return {
    get: (key): string => configurations.get(key) || '',
    getAll: (): Map<string, string | undefined> => configurations,
  }
}

const configuration = configureEnvironmentVariables()
export default configuration
