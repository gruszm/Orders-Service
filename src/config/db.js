import * as mongoose from "mongoose";

async function connect(hostname) {
    const url = `mongodb://${hostname}:27017/orders`;

    try {
        await mongoose.connect(url);

        console.log("Successfully connected to orders database on url " + url);
    } catch (error) {
        console.log(`Could not connect to orders database on url ${url}: ${error.message}`);

        process.exit(1);
    }
}

export { connect };