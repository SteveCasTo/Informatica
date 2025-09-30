import express from 'express'
import cors from 'cors'
import { appConfig } from './config/app'
import { connectDatabase, prisma } from './config/database'
import { authRoutes } from './routes/authRoutes'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'

const app = express()

// CORS configurado para ngrok
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://unplunderous-tolerative-trinh.ngrok-free.dev',
    /^https:\/\/.*\.ngrok-free\.app$/,
    /^https:\/\/.*\.ngrok\.io$/,
    '*' // Solo para desarrollo
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning']
}))

// Middleware para ngrok
app.use((req, res, next) => {
  res.header('ngrok-skip-browser-warning', 'true');
  next();
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: appConfig.port,
    environment: appConfig.nodeEnv,
    backendUrl: appConfig.backendUrl
  })
})

app.use(notFoundHandler)
app.use(errorHandler)

const startServer = async () => {
  try {
    await connectDatabase()
    
    app.listen(appConfig.port, '0.0.0.0', () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${appConfig.port}`)
      console.log(`🌐 Accesible localmente: http://localhost:${appConfig.port}`)
      console.log(`🔗 Accesible via ngrok: ${appConfig.backendUrl}`)
      console.log(`📱 Mobile backend: ${appConfig.mobileBackendUrl}`)
      console.log(`🛠️ Modo: ${appConfig.nodeEnv}`)
    })
  } catch (error) {
    console.error('Error iniciando el servidor:', error)
    process.exit(1)
  }
}

process.on('SIGTERM', async () => {
  console.log('Cerrando servidor...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('Cerrando servidor...')
  await prisma.$disconnect()
  process.exit(0)
})

startServer()