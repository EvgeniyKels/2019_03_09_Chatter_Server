const express = require('express');
// const port = process.argv[2] || 5000;
const application = express();
const cors = require('cors');
const wss = require('./additional/websocket');
const user = require('./routs/user');
const conf = require('config');
const helmet = require('helmet');
// application.listen(port, () => console.log(`listening port ${port}`));
let newVar = process.env.PORT || 5000;
wss(process.env.PORT + "1" || 7000);

application.use(cors());
application.use(helmet());
application.use(express.json());

application.use('/users', user);
application.listen(newVar, () => console.log(`listening port ${newVar}`));
// .listen(process.env.PORT || 5000)