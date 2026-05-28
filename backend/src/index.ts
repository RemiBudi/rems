import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

app.get('/', (c) => {
  return c.json({
    message: 'Book API OK',
  })
})

serve({
  fetch: app.fetch,
  port: 3000,
})

console.log('API running on http://localhost:3000')