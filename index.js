import express, { response } from "express"
import cors from "cors"
import bcrypt from "bcrypt"
import mysql from "mysql";

const databaseConnect = mysql.createConnection({
    host: "bh4belfcjrq80irlh9dq-mysql.services.clever-cloud.com",
    user: "ulbztlplcjiazjxh",
    password: "A5PJbrPeFIhoshbPqIYc",
    database: "bh4belfcjrq80irlh9dq",
})

// const databaseConnect = mysql.createConnection({
//     host:"localhost",
//     user: "root",
//     password:"" ,
//     database:"realestate",
// })

databaseConnect.connect((err) => {
    if (err) throw err;
    console.log("database is ready to use")
})

const port = 5000
const app = express()
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).send(`
        Welcome to realestate server dashboard
        I know you are admin or developer enjoy on our server
        we are created this page to say welcome to you
        `)
})

app.post("/singup", async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const phone = req.body.phone
    databaseConnect.query(`select * from users where  username = '${username}'`, async (err, result) => {
        if (err) throw err;
        const userData = [...result]
        if (userData.length <= 0) {
            const hash = await bcrypt.hash(password, 10)
            databaseConnect.query(`INSERT INTO users (username , email , password , phone , role) VALUES (?,?,?,?,?)`, [username, email, hash, phone, 1], (err, result) => {
                res.status(200).json({ message: "created successfully", respon: result, sqlsyntaxerror: err })
            })
        } else {
            res.status(400).json({ message: "username already exist" })
        }
    })
})

app.get("/checkLog", async (req, res) => {
    if(localStorage.getItem("login-status")!= null){
        res.json({message : localStorage.getItem("login-status") , username: localStorage.getItem("username")})
    }else{
        res.json({message : "not login"})
    }
})

app.post("/login", async (req, res) => {
    const username = req.body.usernameLog;
    const password = req.body.passwordLog;
    databaseConnect.query(`select * from users where  username = '${username}'`, async (err, result) => {
        if (err) throw err;
        const userData = [...result]
        if (userData.length <= 0) {
            res.status(400).json({ message: "username not found" })
        } else {
            const passwordMatch = await bcrypt.compare(password, userData[0].password)
            if (passwordMatch) {
                res.status(200).json({ message: "login successfully", login: true, username: username, respon: result, sqlsyntaxerror: err })
            } else {
                res.status(400).json({ message: "password not match" })
            }
        }
    })
})


app.listen(port, () => {
    console.log(`app is listenning port ${port}`)
})
