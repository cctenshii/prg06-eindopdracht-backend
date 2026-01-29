import express from "express";
import mongoose from "mongoose";
import cdramasRouter from "./routes/cdramas.js"

const app = express();

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Remove global Methods and Headers to avoid "Too many CORS headers" and let routes handle OPTIONS
    // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

    if (req.method === 'OPTIONS') {
        // Let the router handle OPTIONS
        return next();
    }

    // Relaxed Accept header check
    const acceptHeader = req.header('Accept');
    if (acceptHeader && !acceptHeader.includes('application/json') && acceptHeader !== '*/*') {
        res.status(406);
        res.json({error: 'Only JSON is allowed as Accept Header'});
        return;
    }
    next();
})

// MongoDB connectie
try {
    await mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);
    console.log("MongoDB connected");
} catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
}

app.use("/cdramas", cdramasRouter);

// Fallback route (optioneel)
app.get('/', (req, res) => {
    res.json({message: 'Welcome to my webservice'});
});

const PORT = process.env.EXPRESS_PORT || 8001;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on port ${PORT}`);
});
