import "dotenv/config";
import { app } from "./app.js";
import { createServer } from "node:http";

const port = process.env.PORT;

const server = createServer(app)

server.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});


server.on('error', console.error);