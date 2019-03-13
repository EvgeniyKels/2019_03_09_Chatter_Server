const Ws = require('ws').Server;
const jwt = require('jsonwebtoken');
const config = require('config');
const SECRET = config.get('secret');
const onlineUsers = {};
const Database = require('../database');

async function sendMessageToDB(message) {
    const userMongoSchema = Database.prototype.getAuthUserSchema();
    const userFromDb = await userMongoSchema.findOne({name: message.username});
    const partnerFromDb = await userMongoSchema.findOne({name: message.companion});
    userFromDb.messages.push(message);
    partnerFromDb.messages.push(message);
    userFromDb.save();
    partnerFromDb.save();
}

function webSocketServer(port) {
    const wss = new Ws({port: port});
    console.log(wss.options.port + " onLine");

    wss.on("connection", (socket) => {
        const user = checkJwtKey(socket.protocol, socket);
        if (!user) {return socket.close()}
        onConnection(user, socket, wss); //действия при подключении нового пользователя
        socket.on("message", async (msg) => {
            const message = JSON.parse(msg);
            const user = checkJwtKey(message.jwt, socket);
            if (!user){return socket.close()}
            delete message.jwt;
            let roles = user.roles;
            if (!(message.companion) && roles.find((el) => {
                return el === "admin"
            })) {
               sendAdminMsg(message, onlineUsers).catch(() => console.log('no connection'));
                return;
            }
            if (!(message.companion)){
                return
            }
            await sendMessageToDB(message);
            const obj = {"messages":[]};
            obj.messages.push(message);
            obj["userlist"] = false; //todo what happened here, why it add field userlist to message
            const stringMessage = JSON.stringify(obj);
            const socketOnlineUser = onlineUsers[message.companion];
            if (socketOnlineUser) {
                socketOnlineUser.send(stringMessage);
                if (socketOnlineUser === socket) {
                    return
                }
            }
            socket.send(stringMessage);
        });

        socket.on("close", (socket) => {
            onDisconnection(user, socket, wss);
        })
    });
}
function checkJwtKey(jwtKey, socket) {
    if (!jwtKey) {
        socket.send(JSON.stringify({ERROR: "ERROR: NOT AUTHORIZED USER"}));
        return false;
    } else {
        try {
            return jwt.verify(jwtKey, SECRET);
        } catch (e) {
            socket.send(e + " TODO INVALID");
        }
    }
}


async function userListSender(userMongoSchema, wss) {
    const names = Object.keys(onlineUsers);
    const usersFromDB = await userMongoSchema.find().select("name");
    usersFromDB.forEach((el) => {
        el = el._doc;
        el.name in onlineUsers ? el["onLineFl"] = true : el["onLineFl"] = false
    });
    wss.clients.forEach((el) => {
        el.send(JSON.stringify(usersFromDB))
    });
}

async function onConnection(user, socket, wss) {
    onlineUsers[user.name] = socket;
    console.log(user.name + " CONNECTED " + new Date());
    const userMongoSchema = Database.prototype.getAuthUserSchema();
    const usersMessagesFromDB = await userMongoSchema.findOne({name: user.name}).select('messages');
    const obj = {messages : usersMessagesFromDB._doc.messages};
    obj["userlist"] = false;
    socket.send(JSON.stringify(obj));
    await userListSender(userMongoSchema, wss);
}
async function onDisconnection(user, socket, wss) {
    const userMongoSchema = Database.prototype.getAuthUserSchema();
    console.log(user.name + " DISCONNECTED " + new Date());
    delete onlineUsers[user.name];
    await userListSender(userMongoSchema, wss);
}
async function sendAdminMsg(message, DB) {
    const socketArray = Object.values(DB);
    const obj = {"messages":[]};
    obj.messages.push(message);
    obj["userlist"] = false;
    socketArray.forEach((el) => el.send(JSON.stringify(obj)));


    const userMongoSchema = Database.prototype.getAuthUserSchema();
    const usersFromDb = await userMongoSchema.find();
    usersFromDb.forEach((el) => {
        el.messages.push(message);
        el.save();
    });
    // usersFromDb.save();
}

module.exports = webSocketServer;
