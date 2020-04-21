require('dotenv').config()
const server = require('./server/index');

const PORT = process.env.PORT_CLIENT;

server.listen(PORT, () => console.log(`Server is live at localhost:${PORT}`));