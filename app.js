import dotenv from 'dotenv'
import express from 'express'
import apiRouter from './routes/api.js'
import connection from './connection.js'
import bodyParser from 'body-parser'

const env = dotenv.config().parsed

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text());
app.use(bodyParser.json())

app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
    res.status(404).json({ message: '404 NOT FOUND' });
});


//mongoDb Connection
connection()

app.listen(env.APP_PORT, () => {
    console.log(`Server started on port ${env.APP_PORT}`)
})