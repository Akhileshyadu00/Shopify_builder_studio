import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
    if (process.env.NODE_ENV === "production") {
        console.error("CRITICAL: MONGODB_URI is missing in production environment!");
        // We throw this specific error so it appears in the Vercel logs clearly
        throw new Error('❌ CONFIG ERROR: "MONGODB_URI" is missing in Vercel Environment Variables. Go to Settings > Environment Variables to add it.');
    }
    clientPromise = Promise.reject(new Error('Invalid/Missing environment variable: "MONGODB_URI". Please visit Vercel settings and add this variable.'));
} else {
    try {
        // Extract DB name for logging/debugging
        const dbName = uri.split("/").pop()?.split("?")[0] || "shopify_builder";
        console.log(`Detected MongoDB Database: ${dbName}`);

        if (process.env.NODE_ENV === "development") {
            const globalWithMongo = global as typeof globalThis & {
                _mongoClientPromise?: Promise<MongoClient>;
            };

            if (!globalWithMongo._mongoClientPromise) {
                console.log("Initializing New MongoDB Client (Dev Mode)...");
                client = new MongoClient(uri, options);
                globalWithMongo._mongoClientPromise = client.connect()
                    .then(client => {
                        console.log(`✅ MongoDB Connected Successfully: ${dbName}`);
                        return client;
                    })
                    .catch(err => {
                        console.error("❌ MongoDB Connection Failure:", err);
                        // Clear the rejected promise so we can try again on next request
                        delete globalWithMongo._mongoClientPromise;
                        throw err;
                    });
            }
            clientPromise = globalWithMongo._mongoClientPromise;
        } else {
            client = new MongoClient(uri, options);
            clientPromise = client.connect()
                .then(client => {
                    console.log(`MongoDB Connected Successfully to: ${dbName} (Prod)`);
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
