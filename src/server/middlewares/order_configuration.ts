export interface MiddlewaresOrder {
  [s: string]: { active: boolean }
}

const middlewaresOrder: MiddlewaresOrder = {
  'errors-handler': { active: true },
  cors: { active: true },
  'body-parser': { active: true },
  'requests-logger': { active: true },
  'response-time': { active: true },
  'not-found': { active: true },
}

export default middlewaresOrder
