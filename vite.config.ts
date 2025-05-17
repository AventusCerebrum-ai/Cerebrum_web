import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://pup-improved-labrador.ngrok-free.app',
        changeOrigin: true,
        secure: false,
        configure: (proxy: any, _options: any) => {
          proxy.on('error', (err: any, _req: any, _res: any) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq: any, req: any, _res: any) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes: any, req: any, _res: any) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
      '/api/gemini': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path: string) => {
          console.log('Rewriting path from:', path);
          const rewritten = path.replace(/^\/api\/gemini/, '');
          console.log('Rewritten path to:', rewritten);
          return rewritten;
        },
        configure: (proxy: any, _options: any) => {
          proxy.on('error', (err: any, _req: any, _res: any) => {
            console.log('Gemini proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq: any, req: any, _res: any) => {
            console.log('Gemini Proxy Request:', req.method, req.url);
            console.log('Gemini Proxy Request Headers:', req.headers);
            console.log('Proxy target:', req.headers.host);
          });
          proxy.on('proxyRes', (proxyRes: any, req: any, _res: any) => {
            console.log('Gemini Proxy Response:', proxyRes.statusCode, req.url);
            console.log('Gemini Proxy Response Headers:', proxyRes.headers);
            if (proxyRes.statusCode >= 400) {
              // Read response body for error details
              let body = '';
              proxyRes.on('data', function(chunk) {
                body += chunk;
              });
              proxyRes.on('end', function() {
                console.log('Gemini Proxy Response Error Body:', body);
              });
            }
          });
        }
      },
      // Additional direct proxy for bypass
      '/direct-gemini': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/direct-gemini/, ''),
        configure: (proxy: any, _options: any) => {
          proxy.on('error', (err: any, _req: any, _res: any) => {
            console.log('Direct Gemini proxy error', err);
          });
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
