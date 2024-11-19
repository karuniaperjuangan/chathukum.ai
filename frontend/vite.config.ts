import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/


export default defineConfig({
  plugins: [react()],
  define: {
    "VITE_BASE_API_URL": `${process.env.VITE_BASE_API_URL}`,
  },
});