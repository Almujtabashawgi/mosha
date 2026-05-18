FIXES APPLIED:
1. Fixed the main problem causing the white screen:
   - main.tsx imported './App'
   - actual file name was 'app.tsx'
   - this breaks on Linux/Vercel/Netlify hosting because filenames are case-sensitive

2. Added vite.config.ts for better compatibility

IMPORTANT:
Delete old node_modules before running:

Commands:
npm install
npm run dev

For production:
npm run build

If deployment still fails:
- Upload the whole project EXCEPT node_modules
- Then run npm install on the server/hosting platform
