import { defineConfig } from 'cypress';

export default defineConfig({
    e2e:{
        baseUrl: 'https://proyectofinal-1-tm89.onrender.com',
        specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
        defaultCommandTimeout: 8000,
        supportFile: false
    }
});
