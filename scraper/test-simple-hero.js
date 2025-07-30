const Hero = require('@ulixee/hero').default;

async function testHero() {
  let hero;
  try {
    console.log('Testing Hero.js initialization...');
    hero = new Hero({
      showChrome: false
    });
    
    console.log('Hero initialized, testing navigation...');
    await hero.goto('https://www.google.com');
    
    console.log('Navigation successful!');
    const title = await hero.document.title;
    console.log('Page title:', title);
    
  } catch (error) {
    console.error('Hero test failed:', error.message);
  } finally {
    if (hero) {
      await hero.close();
    }
  }
}

testHero();