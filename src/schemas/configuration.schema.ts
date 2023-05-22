import * as Joi from 'joi';
import { TransportTargetOptions } from 'pino';

export const configSchema = Joi.object({
  FRONT_URL: Joi.string().optional(),
  APP_NAME: Joi.string().optional().default('Droptask 1.0'),
  JWT_SECRET: Joi.string().required(),
  MYSQL_HOST: Joi.string().required(),
  MYSQL_USER: Joi.string().required(),
  MYSQL_PASSWORD: Joi.string().required(),
  MYSQL_DATABASE: Joi.string().required(),
  MYSQL_PORT: Joi.number().optional(),
  REDIS_URL: Joi.string().optional(),
  REDIS_HOST: Joi.string().optional(),
  REDIS_PORT: Joi.number().optional().default(6379),
  REDIS_USERNAME: Joi.string().optional(),
  REDIS_PASSWORD: Joi.string().optional(),
});

export function getPinoPrettyConfig(): TransportTargetOptions {
  return {
    level: 'debug',
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:dd/mm/yyyy, HH:MM:ss',
      levelFirst: true,
      colorize: true,
      singleLine: true,
    },
  };
}

export function getPinoLokiConfig(
  host: string,
  appName: string,
  username: string,
  password: string,
): TransportTargetOptions {
  return {
    level: 'debug',
    target: 'pino-loki',
    options: {
      batching: true,
      interval: 5,
      labels: { application: appName },
      host: host,
      basicAuth: {
        username,
        password,
      },
    },
  };
}
