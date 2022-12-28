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
        const AddTaskCollection = client.db('Taskque').collection('addTasks');

        //* add a task
        app.post('/addTask', async (req, res) => {
            const task = req.body;
            const result = await AddTaskCollection.insertOne(task);
            res.send(result);
        })

        //* load task for update
        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const task = await AddTaskCollection.findOne(query);
            res.send(task)
        })

        //* get tasks using email
        app.get('/myTask', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const myTasks = await AddTaskCollection.find(query).toArray();
            res.send(myTasks);
        })


        //* update a task
        app.patch('/updatedTask/:id', async (req, res) => {
            const updatedTask = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    taskTitle: updatedTask.taskTitle,
                    taskDetail: updatedTask.taskDetail,
                    taskImage: updatedTask.taskImage
                }
            };
            const result = await AddTaskCollection.updateOne(filter, updatedDoc, options);
            res.send(result)
        })

        //* delete a task
        app.delete('/deleteTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await AddTaskCollection.deleteOne(query);
            res.send(result);
        })







    }
    finally {

    }
}
run().catch(err => console.log(err))













app.listen(port, () => {
    console.log(`Taskque server is running on ${port} port`)
})