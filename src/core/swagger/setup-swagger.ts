import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Video API",
            version: "1.0.0",
            description: "Videos API",
        },
        servers: [
            {
                url: "/", // относительный путь для Vercel
            },
        ],
    },
    apis: ["./src/**/*.swagger.yml"], // должен быть здесь, а не внутри definition
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
