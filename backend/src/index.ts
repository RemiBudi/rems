import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const app = new Hono()
const prisma = new PrismaClient()
const STATIC_DIR = process.env.STATIC_DIR ?? join(process.cwd(), '..', 'public', 'static')

app.use(cors())

app.get('/', (c) => c.json({ message: 'API OK' }))

app.get('/books/random', async (c) => {
  const count = Math.min(Number(c.req.query('count') ?? 1) || 1, 15)
  const books = await prisma.$queryRaw<any[]>`SELECT * FROM books ORDER BY RANDOM() LIMIT ${count}`
  if (!books.length) return c.json({ error: 'No books found' }, 404)
  return c.json(count === 1 ? books[0] : books)
})

app.get('/artists/random', async (c) => {
  const count = Math.min(Number(c.req.query('count') ?? 1) || 1, 15)
  // Pondération par rank : rank faible = plus écouté = plus de chance d'apparaître
  const artists = await prisma.$queryRaw<any[]>`
    SELECT * FROM artists WHERE rank IS NOT NULL ORDER BY RANDOM() / rank LIMIT ${count}
  `
  if (!artists.length) return c.json({ error: 'No artists found' }, 404)
  return c.json(count === 1 ? artists[0] : artists)
})

app.get('/covers/:isbn', async (c) => {
  const isbn = c.req.param('isbn')
  if (!/^\d+$/.test(isbn)) return c.json({ error: 'Invalid ISBN' }, 400)

  const imagePath = join(STATIC_DIR, 'covers', `${isbn}.jpg`)
  try {
    const image = await readFile(imagePath)
    return new Response(image, { headers: { 'Content-Type': 'image/jpeg' } })
  } catch {
    return c.notFound()
  }
})

app.get('/artist-images/:mbid', async (c) => {
  const mbid = c.req.param('mbid')
  if (!/^[0-9a-f-]{36}$/.test(mbid)) return c.json({ error: 'Invalid mbid' }, 400)

  const imagePath = join(STATIC_DIR, 'artists', `${mbid}.jpg`)
  try {
    const image = await readFile(imagePath)
    return new Response(image, { headers: { 'Content-Type': 'image/jpeg' } })
  } catch {
    return c.notFound()
  }
})

serve({ fetch: app.fetch, port: 3000 })

console.log('API running on http://localhost:3000')
