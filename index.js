const { server: { port }, app } = require('config');
const server = require('./app/app');

server.listen(port, () => {
  console.table({ ...app, port });
});
