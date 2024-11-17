import path from "path";

export default {
  openapi: '3.0.0',
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Law Management App',
      version: '1.0.0',
    },
  },
  apis: ['**/*.ts'], // files containing annotations as above
};