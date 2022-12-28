const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//* middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Taskque server is running');
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.drjbcpx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const tasksCollection = client.db('Taskque').collection('addTasks');

        //* add a task
        app.post('/addTask', async (req, res) => {
            const task = req.body;
            const result = await tasksCollection.insertOne(task);
            res.send(result);
        })

        //* load task for update
        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const task = await tasksCollection.findOne(query);
            res.send(task)
        })

        //* get tasks using email
        app.get('/myTask', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const myTasks = await tasksCollection.find(query).toArray();
            res.send(myTasks);
        })


        //* update a task
        app.patch('/updatedTask/:id', async (req, res) => {
            const task = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedTask = {
                $set: {
                    taskTitle: task.taskTitle,
                    taskDetail: task.taskDetail,
                    taskImage: task.taskImage
                }
            };
            const result = await tasksCollection.updateOne(filter, updatedTask, options);
            res.send(result)
        })

        //* delete a task
        app.delete('/deleteTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await tasksCollection.deleteOne(query);
            res.send(result);
        })

        //* add status on completed task
        app.patch('/completedTask', async (req, res) => {
            const id = req.query.id;
            const status = req.query.status;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const completedTask = {
                $set: {
                    status
                }
            };
            const result = await tasksCollection.updateOne(filter, completedTask, options);
            res.send(result);
        })

        //* load completed task using user email
        app.get('/completedTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const completedTask = await tasksCollection.findOne(query);
            res.send({ completedStatus: completedTask?.status });
        })

        //* load completed tasks using user email and status
        app.get('/completedTasks', async (req, res) => {
            const email = req.query.email;
            const query = {
                userEmail: email,
                status: 'completed'
            }
            const completedTasks = await tasksCollection.find(query).toArray();
            res.send(completedTasks);
        })







    }
    finally {

    }
}
run().catch(err => console.log(err))













app.listen(port, () => {
    console.log(`Taskque server is running on ${port} port`)
})