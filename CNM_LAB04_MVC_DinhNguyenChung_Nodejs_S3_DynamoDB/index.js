const express = require('express')
const PORT = 3000
const app = express()
let courses = require('./data')
const SubjectModel = require('./data.model')
const {uploadFile} = require("./file.service")

// register middleware
app.use(express.urlencoded({extended:true}))
app.use(express.static('./views'))

// config
app.set('view engine','ejs')
app.set('views','./views');

// app.get('/',(req, resp)=>{
//     return resp.render('index',{courses}) //set data cho ejs
// })

const multer = require("multer");
const storage = multer.memoryStorage({
    destination: function (req,file,cb){
        cb(null,"/")
    },
}
);
const upload = multer({
    storage: storage,
    limits:{
        fileSize:1024 * 1024 * 5.
    },

}).single("image");

app.get('/',async (req, resp)=>{
    try {
       const data = await SubjectModel.getSubjects();
       resp.render("index",{data});
    } catch (error) {
        console.error("Error retrieving subjects:", error);
        resp.status(500).send("Error retrieving subjects");
    }
})


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

// app.post('/save',(req,resp)=>{
//     const id = Number(req.body.id);
//     const name = req.body.name;
//     const course_type = req.body.course_type;
//     const semester = req.body.semester;
//     const department = req.body.department;

//     const params ={
//         "id":id,
//         "name":name,
//         "course_type":course_type,
//         "semester":semester,
//         "department":department
//     }
//     courses.push(params);
//     return resp.redirect('/');
// })
app.post('/save',upload,async(req,res)=>{
    try{
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
// Lấy ảnh trước 
        const image  = req.file;
        const imgaeUrl = await uploadFile(image);


        const newCourese ={
            id:Number(req.body.id),
            tenMonHoc:(req.body.name),
            loai:(req.body.course_type),
            hocKy:(req.body.semester),
            khoa:(req.body.department),
            image:imgaeUrl
        };
        await SubjectModel.createSubject(newCourese);
        res.redirect("/");
    }catch(error){
        console.error("ERROR CREATE COURSE:",error);
        res.status(500).send("ERROR SAVING SUBJECT")
    }
})

// app.post('/delete/:id', (req,resp)=>{
//     const maCanXoa = Number(req.params.id); // Get the ID from the request body

//     // Check if the ID is valid
//     if (isNaN(maCanXoa)) {
//         return resp.status(400).send('Invalid ID');
//     }

//     // Find the index of the item to delete
//     const itemIndex = courses.findIndex(item => item.id === maCanXoa);

//     // If item not found, return an error response
//     if (itemIndex === -1) {
//         return resp.status(404).send('Item not found');
//     }

//     // Delete the item from the array
//     courses.splice(itemIndex, 1);

//     // Log the deletion
//     console.log('Data deleted:', JSON.stringify(courses));

//     // Redirect to the main page or send a success response
//     return resp.redirect('/');
// })
app.post("/delete/:id",async (req,res)=>{
    try{
        const stt = Number(req.params.id);
      const subjject =  await SubjectModel.getOneSubject(stt);
        if(subjject){
            await SubjectModel.deleteSubject(subjject.stt,subjject.tenMonHoc);
        }
        res.redirect("/");
    }catch(error){
        console.error("Error deleting subject:",error);
        res.status(500).send("Error deleting subject")
    }
})