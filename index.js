require('dotenv').config()
const server = require('./server/index');

const PORT = process.env.PORT_SERVER;

server.listen(PORT, () => console.log(`Server is live at localhost:${PORT}`));