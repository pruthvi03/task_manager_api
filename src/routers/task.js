const express = require('express');
const router = new express.Router();
const Task = require('../models/task')
const auth = require('../middleware/auth');

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    console.log(task)
    try {
        await task.save();
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send(error);
    }
})


// GET /tasks?completed=true
// GET /tasks?limit=10&skip=10
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};
    if(req.query.completed){
        match.completed = req.query.completed ==='true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        // console.log(parts)
        sort[parts[0]] = parts[1] === 'desc'?-1:1;
    }
    try {
        // const tasks = await Task.find({owner: req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options: {
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
                // sort:{
                //     // createdAt: -1 //created last diplayed first
                //     completed:-1 //diplay accordingly completed status
                // }
            },
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }

});


router.get('/tasks/:completed', auth, async (req, res) => {
    // Task.find({completed:req.params.completed})
    // .then(users=>{ res.send(users)})
    // .catch(err=> res.status(500).send(err));

    // using async and await
    try {
        const tasks = await Task.find({ completed: req.params.completed, owner: req.user._id });
        res.send(tasks)
        console.log(JSON.stringify(tasks))

    } catch (error) {
        res.status(500).send(error)
    }
});


router.patch("/tasks", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowed_updates = ['description', 'completed']
    const is_valid_operation = updates.every((update) => allowed_updates.includes(update));

    if (!is_valid_operation) { return res.status(400).send({ error: 'Invalid operation' }) }

    try {
        let task = await Task.findOne({ description: req.body.description, owner: req.user._id })
        updates.forEach((update) => {
            task[update] = req.body[update];
        });
        task.save();
        // let task = await Task.updateOne({description:req.body.description},{completed:req.body.completed},{new:true});
        await res.status(200).send(task)
        // if(!task){return res.status(400).send({error: 'Not found'})}
    } catch (error) {
        res.status(500).send(error);
    }

});


router.delete("/tasks/:task", auth, async (req, res) => {
    try {
        let task = await Task.deleteOne({ description: req.params.task, owner: req.user._id});
        if (!task) { return res.status(400).send() }
        res.send((task))
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;