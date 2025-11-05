// src/app/config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TrampoMatch API',
      version: '1.0.0',
      description: 'API para TrampoMatch - autenticação, usuários, jobs, busca e profile'
    },
    servers: [
      { url: (process.env.BASE_URL ? process.env.BASE_URL : 'http://localhost:3000') + '/api' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        UserPublic: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '64a4f2...' },
            name: { type: 'string', example: 'Demo User' },
            email: { type: 'string', example: 'demo@demo.com' }
          }
        },
        RegisterRequest: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
            name: { type: 'string' }
          },
          required: ['email','password']
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
            otp: { type: 'string' }
          },
          required: ['email','password']
        },
        TokenResponse: {
          type: 'object',
          properties: {
            access: { type: 'string' },
            refresh: { type: 'string' }
          }
        },
        Job: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            company: { type: 'string' },
            salary: { type: 'number' },
            tags: { type: 'array', items: { type: 'string' } },
            owner: { $ref: '#/components/schemas/UserPublic' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Profile: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            bio: { type: 'string' },
            preferences: {
              type: 'object',
              properties: {
                theme: { type: 'string', example: 'dark' },
                notifications: { type: 'boolean', example: true }
              }
            }
          }
        }
      }
    }
  },
  apis: [path.join(__dirname, './swaggerDocs.js')] // this file contains the paths
};

module.exports = swaggerJSDoc(options);
