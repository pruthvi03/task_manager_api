const express = require('express');
const bcrypt = require('bcryptjs');
require('./db/mongoose')
const Task = require('./models/task');
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const nodemailer = require('nodemailer');
const app = express();
const port = process.env.PORT;

// without middleware : new request -> run route handler
// without middleware : new request ->  do something -> run route handler
// app.use((req, res, next) =>{
//     console.log(req.method,req.path)
//     next();
// });
// app.use((req, res, next) =>{res.status(503).send("Site is under maintenance. Please try again!!!")});

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const multer = require('multer');
const upload = multer({
    dest:'images'
})
app.post('/upload',upload.single('upload'),(req, res) =>{
    res.send();
});

app.listen(port, () => {
    console.log(`server is  running on ${port}`);
});

// const myFunction = async () => {
//      const token = jwt.sign({_id: 'pruthvi'},'thisismynewcourse')
//      console.log(token)

//      const data = jwt.verify(token,'thisismynewcourse')
//      console.log(data)
// }
// myFunction();

// const main = async () =>{
//     const user = await User.findById('603f4d5d3a41c435f4bb0ebb');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks);
// }
// main();
