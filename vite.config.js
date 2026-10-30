import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Run the same API handler locally; production uses Netlify Functions.
function localPlatform() {
  return {
    name: 'local-platform-api',
    configureServer(server) {
      server.middlewares.use('/.netlify/functions/platform', async (req, res) => {
        try {
          const { handler } = await import('./netlify/functions/platform.mjs');
          let body = '';
          for await (const chunk of req) {
            body += chunk;
            if (body.length > 20000) { res.statusCode = 413; res.end('{"error":"الطلب كبير جدًا"}'); return; }
          }
          const response = await handler({ httpMethod: req.method, headers: req.headers, body });
          res.statusCode = response.statusCode;
          for (const [name, value] of Object.entries(response.headers || {})) res.setHeader(name, value);
          for (const [name, value] of Object.entries(response.multiValueHeaders || {})) res.setHeader(name, value);
          res.end(response.body);
        } catch { res.statusCode = 500; res.end('{"error":"تعذّر تشغيل الخدمة المحلية"}'); }
      });
    }
  };
}
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    const env = loadEnv(mode, process.cwd(), '');
    for (const key of ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SECRET_KEY', 'VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_SUPABASE_PUBLISHABLE_KEY']) {
      if (env[key] && !process.env[key]) process.env[key] = env[key];
    }
  }
  return {
    envPrefix: 'VITE_',
    plugins: [react(), localPlatform()],
    server: {
      port: 5173,
      open: false,
      host: '127.0.0.1'
    }
  };
});
