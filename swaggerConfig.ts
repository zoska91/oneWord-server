import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'one Word a dayI',
      version: '1.0.0',
      description: '',
    },
  },
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Settings', description: 'User settings endpoints' },
    { name: 'Subscription', description: 'User subscription endpoints' },
    { name: 'Words', description: 'Endpoints for managing user words' },
  ],
  apis: ['./swagger/**/*.ts'],
};

const specs = swaggerJsdoc(options);

export default specs;
