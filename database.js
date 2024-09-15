import mysql from "mysql";
export const databaseConnect = mysql.createConnection({
    host:"sql8.freesqldatabase.com",
    user: "sql8731358",
    password:"RFQTTVgNJh" ,
    database:"sql8731358",
})


databaseConnect.connect((err)=>{
    if(err) throw err;
    console.log("database is ready to use")
})