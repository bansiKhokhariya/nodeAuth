const mongoose = require('mongoose');

const connectionDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify : true,
            useCreateIndex: true
        });
        console.log('database connected!',  connect.connection.host ,'', connect.connection.name );
    } catch (err) {
            console.log(err)
            process.exit(1);
    }
}
module.exports = connectionDb;
