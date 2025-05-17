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
        rewrite: (path: string) => path.replace(/^\/api\/gemini/, ''),
        configure: (proxy: any, _options: any) => {
          proxy.on('error', (err: any, _req: any, _res: any) => {
            console.log('Gemini proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq: any, req: any, _res: any) => {
            console.log('Gemini Proxy Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes: any, req: any, _res: any) => {
            console.log('Gemini Proxy Response:', proxyRes.statusCode, req.url);
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
}));,
      // Additional direct proxy for bypass
      '/direct-gemini': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/direct-gemini/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Direct Gemini proxy error', err);
          });
        }
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
