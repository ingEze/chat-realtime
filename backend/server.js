import express from 'express'
import mongose from 'mongose'

import { PORT, configMongo } from '../config/config'

const app = express()
app.use(express.json())

mongose.connect(configMongo.dbUri, { useNewUrlParser: true, userUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch(error => console.error('Database connection error', error))
    
app.use('/api/auth', authRoutes)

app.listen(PORT, () => console.log(`server listening on port ${PORT}!`))