import { Request, Response } from "express";
import { Db } from "mongodb";
import { stringify } from "querystring";
import { uuid } from 'uuidv4';
export const characters = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const db: Db = req.app.get("db");
  const chars = await db
    .collection("avalero")
    .find()
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .toArray();
  res.status(200).json(chars);
};

export const character = async (req: Request, res: Response) => {
  const id = req.params.id;
  const db: Db = req.app.get("db");
  const char = await db.collection("avalero").findOne({ id: parseInt(id) });
  if (char) res.status(200).json(char);
  else res.status(404).send();
};

export const register=async( req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const username=req.query.username;
  const password=req.query.password;

  const users=await db
    .collection("usuarios")
    .insertOne({
      username:username,
      password:password,
      token:undefined
    })
    .then(() => {
      res.json({
        username:username,
        password:password
      });
    })
    .catch((e) => {
      console.log(e);
    })
    .then(() => console.log("insertado"));
};

export const login=async( req: Request, res: Response) => {
  const db: Db = req.app.get("db");
  const username=req.query.username;
  const password=req.query.password;
  const token  = uuid();
  const users=await db
    .collection("usuarios").updateOne({
      username:username,
      password:password
    },{$set:{token:token}})
    .then(() => {
      res.json({
        token: token
      });
    })
    .catch((e) => {
      console.log(e);
    })
    .then(() => console.log("insertado"));
};

