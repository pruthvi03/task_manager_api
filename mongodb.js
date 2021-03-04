// CRUD create read and update

const { MongoClient, ObjectID } = require('mongodb')

// MongoClient gives us the necessary functions to connect with the database
// So using this we can perform CRUD operation

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID() //this fun will give the id. Here new keyword is optional.
console.log(id);
console.log(id.id);
console.log(id.id.length);
console.log(id.getTimestamp());
// ObjectID is a 12-byte value consist of:
// First segment of 4-byte value represents the seconds since the UNIX epoch.(Timestamp)
// Second segment of 5-byte random value.
// Third segment of 3-byte counter starts with a random value.

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log(error);
    }
    console.log('connected successfully');
    // console.log(client);
    const db = client.db(databaseName); //gives db reference
    // console.log(db);

    // db.collection('users').insertOne({
    //     _id:id, // You can give customm ID
    //     name: 'Pruthvi',
    //     age: 20
    // },
    //     (error, result) => {
    //         if (error) {
    //             console.log(error);
    //         }
    //         console.log(result.ops);
    //     }
    // );
    // // insertOne is not sync, it is async

    // db.collection('users').insertMany([
    //     {name:'Arjun',age:20},
    //     {name:'Maan',age:25},
    //     {name:'Mat',age:30}
    // ],(error,result)=>{
    //     if (error) {
    //         console.log(error);
    //     }
    //     console.log(result.ops);
    // }
    // );

    // // Find
    // db.collection('users').findOne({name:'Arjun'},(error,result)=>{
    //     if (error) {
    //         console.log(error);
    //     }
    //     console.log(result);
    // });

    // // find
    // db.collection('users').find({age: 20}).toArray((error,users)=>{
    //     console.log(users)
    // });

    // db.collection('users').find({age: 20}).count((error,users)=>{
    //     console.log(users)
    // });


    // // updateOne
    // db.collection('users')
    //     .updateOne({ name: 'Arjun' }, { $set: { name: 'Ashok' } })
    //     .then((result) => { console.log(result); })
    //     .catch((error) => { console.log(error); });

    // // updateMany
    // db.collection('users')
    //     .updateMany({age: 20}, { $set: { age: 22}})
    //     .then((result) => { console.log(result); })
    //     .catch((error) => { console.log(error); });

    // // deleteOne
    // db.collection('users')
    //     .deleteOne({ name: 'Mat' })
    //     .then((result) => { console.log(result); })
    //     .catch((error) => { console.log(error); });
    
    // // deleteMany
    // db.collection('users')
    //     .deleteMany({ age: 22})
    //     .then((result) => { console.log(result); })
    //     .catch((error) => { console.log(error); });
    
}

);