const middlewaresOrder: { [s: string]: { active: boolean } } = {
    "errors-handler": { "active": true },
    "cors": { "active": true },
    "body-parser": { "active": true },
    "requests-logger": { "active": true },
    "response-time": { "active": true }
}

export default middlewaresOrder 
