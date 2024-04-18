import path from 'path'
import { createLogger, transports, format } from 'winston'

const logger = createLogger({
  level: 'info',
  format: format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({
      filename: path.join(
        'logs',
        new Date().toLocaleDateString().replace(/\//g, '-') + '-combined.log'
      ),
      format: format.combine(format.timestamp(), format.json()),
      rotation: {
        type: 'time',
        period: '1d',
      },
    }),
    new transports.Console(),
  ],
})

// if (process.env.NODE_ENV !== 'production') {
//   logger.add(
//     new transports.Console({
//       format: format.simple(),
//     })
//   )
// }

export const saveLog = (type, httpType, endpoint, message, data) => {
  console.log(type, httpType, endpoint, message, data)
  const meta = {
    endpoint,
    httpType,
    message,
    data,
  }
  console.log(type, httpType, endpoint, message, data)

  switch (type) {
    case 'info':
      logger.info(`[${httpType}] ${endpoint}: ${message}`, meta)
      break
    case 'warn':
      logger.warn(`[${httpType}] ${endpoint}: ${message}`, meta)
      break
    case 'error':
      logger.error(`[${httpType}] ${endpoint}: ${message}`, meta)
      break

    default:
      break
  }
}

export default logger
