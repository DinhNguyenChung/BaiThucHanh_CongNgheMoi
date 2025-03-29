const express = require("express");
const PORT= 3000;
const app = express(); // Khoi tao he thong

app.use(express.json({extended:false})); // parse app
app.use(express.urlencoded({extended:true})); // parse app

//Render giao dien
app.use(express.static("./views")); // render từ thư mục views
app.set("view engine","ejs"); // sử dụng ejs là view engine cho express
app.set("views","./views") // thư mục chứa các file ejs

// ROuter cho ứng dụng
app.use("/",require("./routes/index"));

app.listen(3000,()=>{
    console.log(`Server is running at http://localhost:3000/`);
})


