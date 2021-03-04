const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
).then(connect => { console.log('connected to db successfully'); })


// const me = new User({ name: '  Sigh Sighaniya  ', email: '   PR2@gmail.com',password:'ecrptedpass123'});
// me.save().then(() => console.log(me)).catch(err => console.log(err));



// const myTask = new Task({ completed:true});
// myTask.save().then(() => console.log(myTask)).catch(err => console.log(err));