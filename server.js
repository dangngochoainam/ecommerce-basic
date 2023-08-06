const app = require('./src/app');
const {} = require('./src/configs/config.mongodb');

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`ECommerce start with ${PORT}`);
});

// process.on('SIGINT', () => {
//   server.close(() => console.log(`Exit Server Express`));
// });
