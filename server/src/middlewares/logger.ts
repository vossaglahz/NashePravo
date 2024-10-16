import { RequestHandler } from 'express';

const logger = (): RequestHandler => (req, res, next) => {
  console.log(`Request logged: ${req.method}, ${req.path}`);
  next();
};

export default logger;
