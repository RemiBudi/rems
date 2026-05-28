import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const app = new Hono()
const prisma = new PrismaClient()

app.use(cors())

app.get('/', (c) => c.json({ message: 'Book API OK' }))

app.get('/books/random', async (c) => {
  const count = Math.min(Number(c.req.query('count') ?? 1) || 1, 15)
  const books = await prisma.$queryRaw<any[]>`SELECT * FROM books ORDER BY RANDOM() LIMIT ${count}`
  if (!books.length) return c.json({ error: 'No books found' }, 404)
  return c.json(count === 1 ? books[0] : books)
})

app.get('/covers/:isbn', async (c) => {
  const isbn = c.req.param('isbn')
  if (!/^\d+$/.test(isbn)) return c.json({ error: 'Invalid ISBN' }, 400)

  const imagePath = join(process.cwd(), '..', 'public', 'static', 'covers', `${isbn}.jpg`)
  try {
    const image = await readFile(imagePath)
    return new Response(image, { headers: { 'Content-Type': 'image/jpeg' } })
  } catch {
    return c.notFound()
  }
})

serve({ fetch: app.fetch, port: 3000 })

console.log('API running on http://localhost:3000')
