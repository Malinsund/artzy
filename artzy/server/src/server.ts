import { config } from "dotenv";
import mongoose from "mongoose";
import { app } from "./app";

config();
//uri funkar inte DAVID?!
export const uri = process.env.MONGO_URI!;

//server.ts i inlämningen
main().catch((err) => console.error(err));

async function main() {
  await mongoose.connect(
    "mongodb+srv://elsabonde:1UNetOgNjMwBoO5P@artsy.vjqazoa.mongodb.net/?retryWrites=true&w=majority&appName=Artsy"
  );
  app.listen(5200, () => console.log("http://localhost:5200"));
}
