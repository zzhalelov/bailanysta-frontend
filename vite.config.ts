import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080', // Адрес вашего локального Spring Boot бэкенда
                changeOrigin: true,
            },
        },
    },
});