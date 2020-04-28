import { DEVELOPMENT, PRODUCTION } from './consts/env'

export const ENV = process.env.ENV === DEVELOPMENT ? DEVELOPMENT : PRODUCTION;
export const BACKEND_URL = process.env.ENV === DEVELOPMENT ? 'http://localhost:3002' : 'https://form-backend-tal8374.herokuapp.com';