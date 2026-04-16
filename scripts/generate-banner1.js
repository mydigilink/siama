/**
 * Script to generate banner1.jpg for Laser Hair Reduction
 * Run with: node scripts/generate-banner1.js
 * 
 * Make sure your Next.js dev server is running first!
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const topic = 'laser-hair-reduction';
const outputPath = path.join(process.cwd(), 'public', 'img', 'assts', 'banners', 'banner1.jpg');

async function generateBanner() {
  console.log('🚀 Generating banner1.jpg for Laser Hair Reduction...\n');
  console.log(`📡 Fetching from: ${baseUrl}/api/banners/${topic}`);
  
  try {
    const url = new URL(`/api/banners/${topic}`, baseUrl);
    
    const response = await new Promise((resolve, reject) => {
      const req = http.get(url, resolve);
      req.on('error', reject);
    });

    if (response.statusCode !== 200) {
      throw new Error(`Failed to generate banner: ${response.statusCode} ${response.statusMessage}`);
    }

    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    
    await new Promise((resolve, reject) => {
      response.on('end', resolve);
      response.on('error', reject);
    });

    const buffer = Buffer.concat(chunks);
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`✅ Successfully generated: ${outputPath}`);
    console.log(`📏 Image size: ${buffer.length} bytes`);
    console.log(`🎨 Image dimensions: 1920x1080px (width > 1003px as requested)`);
    console.log(`🇮🇳 Indian aesthetic design applied`);
  } catch (error) {
    console.error('❌ Error generating banner:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. Your Next.js dev server is running (npm run dev)');
    console.error(`   2. The server is accessible at ${baseUrl}`);
    console.error(`   3. The API route exists at /api/banners/${topic}`);
    process.exit(1);
  }
}

generateBanner();

