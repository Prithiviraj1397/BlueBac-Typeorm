import mongoose from "mongoose";
import config from './config';

export const connect = () => {
    if (config?.DATABASE_URL) {
        mongoose.connect(config?.DATABASE_URL);

        let db = mongoose.connection;

        db.once("open", async () => {
            console.info("MongoDB connected successfully");
        });

        db.on('error', (err) => {
            console.error('Error while connecting DB ' + err);
        });
    }
}
export const close = () => {
    mongoose.connection.close().then(() => {
        console.log('Disconnected from the database');
        process.exit(0);
    }).catch((error) => {
        console.error('Error closing the database connection:', error);
        process.exit(1);
    });
}