const express = require('express')
const axios = require('axios')
const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000
const APP_ENV = process.env.APP_ENV || 'development'
const API_URL = process.env.API_URL || 'http://localhost:3001'
const DB_PASSWORD = process.env.DB_PASSWORD || 'notset'

const orders = []
let orderIdCounter = 1

app.get('/health', (req, res) => {
  res.json({ status: 'order-service is healthy' })
})

app.post('/order/place', async (req, res) => {
  const { userId, foodItemId, quantity } = req.body
  if (!userId || !foodItemId || !quantity) {
    return res.status(400).json({ error: 'userId, foodItemId and quantity required' })
  }
  try {
    const foodResponse = await axios.get(`${API_URL}/food/item/${foodItemId}`)
    const foodItem = foodResponse.data.item
    const order = {
      orderId: orderIdCounter++,
      userId,
      foodItem: foodItem.name,
      restaurant: foodItem.restaurant,
      quantity,
      totalPrice: foodItem.price * quantity,
      status: 'confirmed',
      environment: APP_ENV,
      db_connected: DB_PASSWORD !== 'notset',
      createdAt: new Date().toISOString()
    }
    orders.push(order)
    res.json({ success: true, service: 'order-service', message: 'Order placed successfully', order })
  } catch (error) {
    res.status(500).json({
      success: false,
      service: 'order-service',
      error: 'Could not fetch food item from food-service',
      detail: error.message
    })
  }
})

app.get('/order/list', (req, res) => {
  res.json({
    success: true,
    service: 'order-service',
    environment: APP_ENV,
    count: orders.length,
    orders
  })
})

app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`)
  console.log(`Environment: ${APP_ENV}`)
  console.log(`Food Service URL: ${API_URL}`)
  console.log(`DB Password loaded: ${DB_PASSWORD !== 'notset' ? 'YES' : 'NO'}`)
})

