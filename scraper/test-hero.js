const Hero = require('@ulixee/hero').default;

async function testHero() {
  let hero;
  try {
    console.log('Creating Hero instance...');
    hero = new Hero({
      showChrome: false,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    console.log('Navigating to test page...');
    await hero.goto('https://www.google.com');
    
    console.log('Getting page title...');
    const title = await hero.document.title;
    console.log('Page title:', title);
    
    console.log('Hero.js test successful!');
  } catch (error) {
    console.error('Hero.js test failed:', error);
  } finally {
    if (hero) {
      await hero.close();
    }
  }
}

testHero();