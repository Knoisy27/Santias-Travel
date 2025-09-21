#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building for Vercel...');

try {
  // Limpiar dist anterior
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Build de Angular
  console.log('📦 Building Angular application...');
  execSync('ng build --configuration=production', { stdio: 'inherit' });

  // Verificar que se generó correctamente
  const distPath = 'dist/santiasTravelFront';
  if (!fs.existsSync(distPath)) {
    throw new Error('Build failed: dist/santiasTravelFront not found');
  }

  // Crear estructura esperada por Vercel
  const vercelDistPath = 'dist/my-ssr';
  if (!fs.existsSync(vercelDistPath)) {
    fs.mkdirSync(vercelDistPath, { recursive: true });
  }

  // Copiar browser a my-ssr/browser
  const browserSource = path.join(distPath, 'browser');
  const browserDest = path.join(vercelDistPath, 'browser');
  
  if (fs.existsSync(browserSource)) {
    if (fs.existsSync(browserDest)) {
      fs.rmSync(browserDest, { recursive: true, force: true });
    }
    fs.cpSync(browserSource, browserDest, { recursive: true });
    console.log('✅ Copied browser files to my-ssr/browser');
  }

  // Copiar server a my-ssr/server
  const serverSource = path.join(distPath, 'server');
  const serverDest = path.join(vercelDistPath, 'server');
  
  if (fs.existsSync(serverSource)) {
    if (fs.existsSync(serverDest)) {
      fs.rmSync(serverDest, { recursive: true, force: true });
    }
    fs.cpSync(serverSource, serverDest, { recursive: true });
    console.log('✅ Copied server files to my-ssr/server');
  }

  console.log('🎉 Vercel build completed successfully!');
  console.log('📁 Structure created:');
  console.log('   dist/my-ssr/browser/ (static files)');
  console.log('   dist/my-ssr/server/ (SSR files)');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
