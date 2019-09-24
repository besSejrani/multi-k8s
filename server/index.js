/**
|--------------------------------------------------
| Imports
|--------------------------------------------------
*/

const keys = require("./keys");
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const redis = require("redis");

/**
|--------------------------------------------------
| Postgres setup
|--------------------------------------------------
*/

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

pgClient.on("error", () => console.log("lost pg connection"));
pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch(err => console.log(err));

/**
|--------------------------------------------------
| Redis setup
|--------------------------------------------------
*/

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

/**
|--------------------------------------------------
| Initialization & Express route handlers
|--------------------------------------------------
*/

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("hi");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("select * from values");
  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const { index } = req.body;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hset("values", index, "Nothing yet !");
  redisPublisher.publish("insert", index);
  pgClient.query("insert into values(number) VALUES($1)", [index]);
  res.send({ working: true });
});

app.listen(5000, () => console.log("Server is running on port 5000"));
