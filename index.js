const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

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

        //* get tasks using email
        app.get('/myTask', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const myTasks = await AddTaskCollection.find(query).toArray();
            res.send(myTasks);
        })
    }
    finally {

    }
}
run().catch(err => console.log(err))













app.listen(port, () => {
    console.log(`Taskque server is running on ${port} port`)
})