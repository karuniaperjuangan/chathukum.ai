import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    define: {
      __APP_ENV__: process.env.VITE_BASE_API_URL,
    },
  };
});