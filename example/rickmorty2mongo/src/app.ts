import { Db } from "mongodb";
import { getAndSaveRickyMortyCharacters } from "./populatedb";
import express from "express";
import { character, characters, register, login } from "./resolvers";

const run = async () => {
  const db: Db = await getAndSaveRickyMortyCharacters();
  const app = express();
  app.set("db", db);
  var middleware={
      uno:"/characters",
      dos:"/character/:id"
  }
  app.use([middleware.uno,middleware.dos],async(req, res, next) => {
    console.log(req.query.token || "No token");
    console.log(req.headers["auth-token"]);
    const db: Db = req.app.get("db");
    const username= req.headers.username;
    const token= req.headers.token;
    const user= await db.collection("usuarios").findOne({username:username,
      token: token})
    if(user){
      console.log("true")
      next();
    }else{
      res.send("Error")
    }  
  }); 
  
  app.get("/status", async (req, res) => {
    res.status(200).send("Todo OK");
  });

  app.get("/characters", characters);
  app.get("/character/:id", character);
  app.put("/register/",register)
  app.get("/login",login)
  

  await app.listen(3000);
};

try {
  run();
} catch (e) {
  console.error(e);
}
