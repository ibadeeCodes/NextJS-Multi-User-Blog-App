export const API =
  process.env.PRODUCTION == true
    ? process.env.API_PRODUCTION
    : process.env.API_DEVELOPMENT

export const DOMAIN =
  process.env.PRODUCTION == true
    ? process.env.DOMAIN_NAME_PRODUCTION
    : process.env.DOMAIN_NAME_DEVELOPMENT

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID

export const PRODUCTION = process.env.PRODUCTION
