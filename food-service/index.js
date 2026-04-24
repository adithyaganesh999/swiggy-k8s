const express = require('express')
const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000
const APP_ENV = process.env.APP_ENV || 'development'
const DB_HOST = process.env.DB_HOST || 'localhost'

const foods = [
  { id: 1, name: 'Masala Dosa', price: 80, restaurant: 'South Indian Corner', category: 'breakfast' },
  { id: 2, name: 'Butter Chicken', price: 320, restaurant: 'Punjab Da Dhaba', category: 'dinner' },
  { id: 3, name: 'Veg Biryani', price: 180, restaurant: 'Biryani House', category: 'lunch' },
  { id: 4, name: 'Paneer Tikka', price: 250, restaurant: 'Tandoor Palace', category: 'starter' },
  { id: 5, name: 'Pav Bhaji', price: 120, restaurant: 'Mumbai Street Food', category: 'snacks' }
]

app.get('/health', (req, res) => {
  res.json({ status: 'food-service is healthy' })
})

app.get('/food/items', (req, res) => {
  res.json({
    success: true,
    service: 'food-service',
    environment: APP_ENV,
    db_host: DB_HOST,
    count: foods.length,
    items: foods
  })
})

app.get('/food/items/:category', (req, res) => {
  const filtered = foods.filter(f => f.category === req.params.category)
  res.json({
    success: true,
    service: 'food-service',
    environment: APP_ENV,
    category: req.params.category,
    count: filtered.length,
    items: filtered
  })
})

app.get('/food/item/:id', (req, res) => {
  const item = foods.find(f => f.id === parseInt(req.params.id))
  if (!item) return res.status(404).json({ error: 'Food item not found' })
  res.json({ success: true, item })
})

app.listen(PORT, () => {
  console.log(`Food service running on port ${PORT}`)
  console.log(`Environment: ${APP_ENV}`)
  console.log(`DB Host: ${DB_HOST}`)
})
