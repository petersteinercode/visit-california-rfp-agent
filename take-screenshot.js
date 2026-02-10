const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport to iPhone X size (mobile)
  await page.setViewport({
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
  });
  
  // Navigate to the page
  console.log('Navigating to http://localhost:3001...');
  await page.goto('http://localhost:3001', { 
    waitUntil: 'networkidle0',
    timeout: 30000 
  });
  
  // Wait a bit for any animations or fonts to load
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Take screenshot
  console.log('Taking mobile screenshot...');
  await page.screenshot({ 
    path: 'screenshot-mobile.png',
    fullPage: true 
  });
  
  console.log('Screenshot saved to screenshot-mobile.png');
  
  await browser.close();
})();
