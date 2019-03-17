import fs from 'fs'
import path from 'path'

function parseMsToHumanTime(ms: number, delim = ": ") {
  const showWith0 = (value: number) => (value < 10 ? `0${value}` : `${value}`);
  const hours = showWith0(Math.floor((ms / (1000 * 60 * 60)) % 60));
  const minutes = showWith0(Math.floor((ms / (1000 * 60)) % 60));
  const seconds = showWith0(Math.floor((ms / 1000) % 60));
  return `${parseInt(hours) ? `${hours} hrs${delim}` : ""}${minutes} min${delim}${seconds} sec`;
}

const healthyCheckController = {
  getSoftwareData: (startTime: number) => {
    const projectConf = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), { encoding: 'utf8' }))
    return {
      name: projectConf.name,
      version: projectConf.version,
      author: projectConf.author,
      upTime: parseMsToHumanTime((Date.now() - startTime))
    }
  }
}

export default healthyCheckController 