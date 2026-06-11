import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce API Documentation',
            version: '1.0.0',
            description: 'This is the complete API documentation for the E-Commerce backend.',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        // ده API وهمي كتبتهولك هنا عشان لو الكومنتات متقرتش، ده يظهر وتتأكد إن المكتبة سليمة
        paths: {
            '/api/ping': {
                get: {
                    summary: 'Test Swagger UI',
                    tags: ['Test'],
                    responses: {
                        200: { description: 'Swagger is working perfectly!' }
                    }
                }
            }
        }
    },
    // السطر ده هو الخلاصة: هيجيب المسار من أول الهارد ديسك لحد أي ملف ts في البروجكت
    apis: [path.join(__dirname, './**/*.ts')], 
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('📄 Swagger Docs available at http://localhost:3000/api-docs');
}