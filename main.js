const express = require('express');
// const port = process.argv[2] || 5000;
const application = express();
// const cors = require('cors');
const wss = require('./additional/websocket');
const user = require('./routs/user');
const conf = require('config');
wss(7000);
// application.use(cors());
application.use(express.json());
application.use('/users', user);

application.listen(port, () => console.log(`listening port ${port}`));

