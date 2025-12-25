import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
    if (process.env.NODE_ENV === "production") {
        console.error("CRITICAL: MONGODB_URI is missing in production environment!");
    }
    clientPromise = Promise.reject(new Error('Invalid/Missing environment variable: "MONGODB_URI". Please visit Vercel settings and add this variable.'));
} else {
    try {
        if (process.env.NODE_ENV === "development") {
            let globalWithMongo = global as typeof globalThis & {
                _mongoClientPromise?: Promise<MongoClient>;
            };

            if (!globalWithMongo._mongoClientPromise) {
                client = new MongoClient(uri, options);
                globalWithMongo._mongoClientPromise = client.connect()
                    .then(client => {
                        console.log("MongoDB Connected Successfully (Dev)");
                        return client;
                    })
                    .catch(err => {
                        console.error("MongoDB Connection Error (Dev):", err);
                        throw err;
                    });
            }
            clientPromise = globalWithMongo._mongoClientPromise;
        } else {
            client = new MongoClient(uri, options);
            clientPromise = client.connect()
                .then(client => {
                    console.log("MongoDB Connected Successfully (Prod)");
                    return client;
                })
                .catch(err => {
                    console.error("MongoDB Connection Error (Prod):", err);
                    throw err;
                });
        }
    } catch (e) {
        console.error("Failed to initialize MongoClient:", e);
        clientPromise = Promise.reject(e);
    }
}



// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
