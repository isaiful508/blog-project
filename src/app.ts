import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import { UserRoutes } from './app/modules/user/user.route'

const app : Application = express()

//parser
app.use(express.json())
app.use(cors())

//application routes
app.use('/api', UserRoutes);

// app.use(error);


app.get('/', (req : Request, res: Response) => {
    res.send('Alhamdulillah Blog is running!')
})

export default app;