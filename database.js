const mongoose = require('mongoose');

class Mongoose {

    constructor() {
        this.dbUsername = 'zenitFZ';  //todo переделать на конфиг
        this.dbPassword = '12345.com';
        this.hostnamePort = 'ds211588.mlab.com:11588';
        this.dbname = 'chatter';
        if (this.dbPassword.length === 0 || !this.dbPassword) {
            console.error('password did not set');
            process.exit(1)
        }

        this.userMongoSchema = mongoose.Schema({ //todo переделать на прием схем извне
            name: {type: String, index: true, unique: true},
            password: String,
            roles: [String],
            messages: [{}]
        });
    }

     connect() {
        let uri = {
            dbUsername : this.dbUsername,
            dbPassword: this.dbPassword,
            hostnamePort: this.hostnamePort,
            dbname: this.dbname
        };
        connectDB(uri).catch();
    }

    getAuthUserSchema() {
        return mongoose.model("Users", this.userMongoSchema);
    }
}

async function connectDB(uri) {
    const db = `mongodb://${uri.dbUsername}:${uri.dbPassword}@${uri.hostnamePort}/${uri.dbname}`;
    try {
        await mongoose.connect(db, {useNewUrlParser: true});
    } catch (e) {
        console.error(e.errmsg);
        return
    }
    uri = `mongodb://${uri.dbUsername}:*************@${uri.hostnamePort}/$******`;
    console.log(`connected ${uri} successfully`)
}

module.exports = Mongoose;
