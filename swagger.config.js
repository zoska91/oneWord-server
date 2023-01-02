export const swaggerConfig = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "OneWord api",
      version: "0.1.0",
      description: "...",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
