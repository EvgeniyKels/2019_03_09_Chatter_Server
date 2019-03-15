const express = require('express');
// const port = process.argv[2] || 5001;
const application = express();
const expressWs = require('express-ws')(application);
const cors = require('cors');
const wss = require('./additional/websocket');
const user = require('./routs/user');
const conf = require('config');
const helmet = require('helmet');
const port = process.env.PORT || 5000;
application.listen(port, () => console.log(`listening port ${port}`));
// wss(7000);

// app.ws('/', function(ws, req) {
//     ws.on('message', function(msg) {
//         console.log(msg);
//     });
//     console.log('socket', req.testing);
// });


application.use(cors());
application.use(helmet());
application.use(express.json());
application.ws("/socket", function (ws, req) {
    wss.WSS(ws);
    setInterval(wss.ping(ws), 3000)
});
application.use('/users', user);
// application.listen(port, () => console.log(`listening port ${port}`));
// .listen(process.env.PORT || 5000)