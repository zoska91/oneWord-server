import { createLogger, transports, format } from 'winston';

type LogType = 'info' | 'warn' | 'error';
type HttpType = 'GET' | 'POST' | 'PUT' | 'DELETE';

const logger = createLogger({
  level: 'info',
  format: format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    // new transports.File({
    //   filename: path.join(
    //     'logs',
    //     new Date().toLocaleDateString().replace(/\//g, '-') + '-combined.log'
    //   ),
    //   format: format.combine(format.timestamp(), format.json()),
    //   rotation: {
    //     type: 'time',
    //     period: '1d',
    //   },
    // }),
    new transports.Console(),
  ],
});

export const saveLog = (
  type: LogType,
  httpType: HttpType,
  endpoint: string,
  message: string,
  data: any
) => {
  const meta = {
    endpoint,
    httpType,
    message,
    data,
  };

  switch (type) {
    case 'info':
      logger.info(`[${httpType}] ${endpoint}: ${message}`, meta);
      break;
    case 'warn':
      logger.warn(`[${httpType}] ${endpoint}: ${message}`, meta);
      break;
    case 'error':
      logger.error(`[${httpType}] ${endpoint}: ${message}`, meta);
      break;

    default:
      break;
  }
};

// export const saveLog = (number, text) => {
//   logger.info(`[${number}] ${text}`)
// }

export default logger;
