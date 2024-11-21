const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description of my API',
  },
  host: 'localhost:8000', 
  schemes: ['http'], 
};

const outputFile = './swagger-output.json';
const endpointsFiles = ["../routes/lawyer.route.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);
