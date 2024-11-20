module.exports = {
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",  // Usar babel-jest para transformar JSX/JS
  },
  transformIgnorePatterns: [
    "/node_modules/(?!your-esm-package)/",  // Si un paquete usa ESM
  ],
  testEnvironment: "jsdom",  // Asegúrate de que sea jsdom para pruebas de React
};
