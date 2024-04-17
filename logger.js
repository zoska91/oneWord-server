import winston from 'winston'
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      filename:
        new Date().toLocaleDateString().replace(/\//g, '-') + '-combined.log',
      format: format.combine(format.timestamp(), format.json()),
      rotation: {
        type: 'time',
        period: '1w',
      },
    }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  )
}

export const saveLog = (type, httpType, endpoint, message, data) => {
  const meta = {
    endpoint,
    httpType,
    message,
    data,
  }

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
