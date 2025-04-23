const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nangal By Cycle',
      version: '1.0.0',
      description: 'Description of your API',
    },
    servers: [
      {
        url: 'https://api.nangalbycycle.com/api-docs', // Change this URL as needed
      },
    ],
  },
  apis: ['./router/router.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };