import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import mysql from "mysql";
import multer from "multer";
import path from "path";

const databaseConnect = mysql.createConnection({
  host: "bh4belfcjrq80irlh9dq-mysql.services.clever-cloud.com",
  user: "ulbztlplcjiazjxh",
  password: "A5PJbrPeFIhoshbPqIYc",
  database: "bh4belfcjrq80irlh9dq",
});

// const databaseConnect = mysql.createConnection({
//     host:"localhost",
//     user: "root",
//     password:"" ,
//     database:"realestate",
// })

databaseConnect.connect((err) => {
  if (err) throw err;
  console.log("database is ready to use");
});

const port = 5000;
const app = express();
app.use("/img/pics", express.static("Public/Images"));

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send(`
        Welcome to realestate server dashboard
        I know you are admin or developer enjoy on our server
        we are created this page to say welcome to you
        `);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Define multer upload to accept specific fields
const upload = multer({ storage: storage }).fields([
  { name: "imageOne", maxCount: 1 },
  { name: "imageTwo", maxCount: 1 },
  { name: "imageThree", maxCount: 1 },
]);

app.post("/uploadpost", upload, (req, res) => {
  const {
    adress,
    floor,
    phone,
    city,
    price,
    type,
    area,
    rooms,
    bathrooms,
    description,
  } = req.body;
  const imageOne = req.files["imageOne"]
    ? req.files["imageOne"][0].filename
    : null;
  const imageTwo = req.files["imageTwo"]
    ? req.files["imageTwo"][0].filename
    : null;
  const imageThree = req.files["imageThree"]
    ? req.files["imageThree"][0].filename
    : null;

  const sql = `INSERT INTO posts (adress, floor, phone, city, price, type, area, rooms, bathrooms, description, imageOne, imageTwo, imageThree) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  databaseConnect.query(
    sql,
    [
      adress,
      floor,
      phone,
      city,
      price,
      type,
      area,
      rooms,
      bathrooms,
      description,
      imageOne,
      imageTwo,
      imageThree,
    ],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error creating post", error: err });
      }
      res
        .status(200)
        .json({ message: "Post created successfully", response: result });
    }
  );
});

app.post("/singup", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;
  databaseConnect.query(
    `select * from users where  username = '${username}'`,
    async (err, result) => {
      if (err) throw err;
      const userData = [...result];
      if (userData.length <= 0) {
        const hash = await bcrypt.hash(password, 10);
        databaseConnect.query(
          `INSERT INTO users (username , email , password , phone , role) VALUES (?,?,?,?,?)`,
          [username, email, hash, phone, 1],
          (err, result) => {
            res
              .status(200)
              .json({
                message: "created successfully",
                respon: result,
                sqlsyntaxerror: err,
              });
          }
        );
      } else {
        res.status(400).json({ message: "username already exist" });
      }
    }
  );
});
app.post("/deletepost", async (req, res) => {
  const id = req.body.id;
  databaseConnect.query(
    `DELETE FROM posts WHERE id = ${id}`,
    async (err, result) => {
      res
        .status(200)
        .json({
          message: "deleted successfully",
          respon: result,
          sqlsyntaxerror: err,
        });
    }
  );
});

app.get("/checkLog", async (req, res) => {
  const loginStatus = localStorage.getItem("login-status");
  const username = localStorage.getItem("username");
  if (loginStatus != null) {
    res.status(200).json({ message: loginStatus, username: username });
  } else {
    res.status(400).json({ message: "not login" });
  }
});

app.get("/posts", async (req, res) => {
  const sql = `select * from posts`;
  databaseConnect.query(sql, async (err, result) => {
    res.status(200).json({ respon: result, sqlsyntaxerror: err });
  });
});

app.post("/login", async (req, res) => {
  const username = req.body.usernameLog;
  const password = req.body.passwordLog;
  databaseConnect.query(
    `select * from users where  username = '${username}'`,
    async (err, result) => {
      if (err) throw err;
      const userData = [...result];
      if (userData.length <= 0) {
        res.status(400).json({ message: "username not found" });
      } else {
        const passwordMatch = await bcrypt.compare(
          password,
          userData[0].password
        );
        if (passwordMatch) {
          res
            .status(200)
            .json({
              message: "login successfully",
              login: true,
              username: username,
              respon: result,
              sqlsyntaxerror: err,
            });
        } else {
          res.status(400).json({ message: "password not match" });
        }
      }
    }
  );
});

app.listen(port, () => {
  console.log(`app is listenning port ${port}`);
});
