import express, { Application, Request, Response } from 'express'
import cors from 'cors'

const app : Application = express()

//parser
app.use(express.json())
app.use(cors())

//application routes
// app.use('/api', ProductRoutes);
// app.use('/api', OrderRoutes);
// app.use(error);


app.get('/', (req : Request, res: Response) => {
    res.send('Alhamdulillah Blog is running!')
})

export default app;