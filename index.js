import express from "express"
import cors from "cors"
import bcrypt from "bcrypt"
import { databaseConnect } from "./database.js"

const port = 5000
const app = express()
app.use(cors())
app.use(express.json())

app.get("/" , (req , res)=>{
    res.send("hello in server")
})

app.listen(port , ()=>{
    console.log(`app is listenning port ${port}`)
})
