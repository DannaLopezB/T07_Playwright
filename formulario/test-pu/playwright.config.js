
  module.exports = {
    reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
    use: {
      trace: 'on-first-retry',
      headless: false, 
      video: 'on'
    },
  };