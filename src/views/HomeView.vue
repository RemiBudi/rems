<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ItemCard from '@/components/ItemCard.vue'
import BookModal from '@/components/BookModal.vue'

type BookItem = {
  type: 'book'
  isbn: string
  title: string
  author: string
  coverUrl?: string
  description?: string
  publisher?: string
  publishedDate?: string
  pageCount?: number
  subjects?: string
  language?: string
}

type PartitionItem = {
  type: 'partition'
  title: string
  composer: string
}

type Item = BookItem | PartitionItem

const items = ref<Item[]>([])
const loading = ref(true)
const error = ref(false)
const selectedBook = ref<BookItem | null>(null)

function openBook(item: Item) {
  if (item.type === 'book') selectedBook.value = item
}

const rotations = [-5, 3, -2, 6, -4, 2, -7, 4, -3, 5, -6, 3]
const offsetsY = [8, -12, 4, -8, 16, -4, 10, -16, 6, -10, 14, -6]

function getTransform(index: number): string {
  const rot = rotations[index % rotations.length]!
  const y = offsetsY[index % offsetsY.length]!
  return `rotate(${rot}deg) translateY(${y}px)`
}

onMounted(async () => {
  try {
    const res = await fetch('/api/books/random?count=9')
    if (!res.ok) throw new Error()
    const data = await res.json()
    const books: any[] = Array.isArray(data) ? data : [data]
    items.value = books.map((book) => ({
      type: 'book' as const,
      isbn: book.isbn,
      title: book.title ?? '',
      author: (book.authors ?? '').split('|')[0] ?? '',
      coverUrl: `/api/covers/${book.isbn}`,
      description: book.description || undefined,
      publisher: book.publisher || undefined,
      publishedDate: book.published_date || undefined,
      pageCount: book.page_count || undefined,
      subjects: book.subjects || undefined,
      language: book.language || undefined,
    }))
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page">
    <!-- Background overlay pour quand tu ajouteras une image -->
    <div class="bg-overlay"></div>

    <div class="content">
      <header class="site-header">
        <h1 class="site-title">boooks</h1>
        <p class="site-subtitle">une bibliothèque de curiosités</p>
        <div class="divider">
          <span>♠</span>
          <span class="divider-line"></span>
          <span>♥</span>
          <span class="divider-line"></span>
          <span>♦</span>
          <span class="divider-line"></span>
          <span>♣</span>
        </div>
      </header>

      <main class="grid-area">
        <div v-if="loading" class="state-message">chargement…</div>
        <div v-else-if="error" class="state-message">impossible de charger les livres</div>
        <div v-else class="scattered-grid">
          <ItemCard
            v-for="(item, i) in items"
            :key="i"
            :item="item"
            :transform="getTransform(i)"
            :colorIndex="i"
            @click="openBook(item)"
          />
        </div>
      </main>

      <BookModal
        v-if="selectedBook"
        :book="selectedBook"
        @close="selectedBook = null"
      />

      <footer class="site-footer">
        <span>— curiouser and curiouser —</span>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  position: relative;
  /* Décommente et adapte pour ton fond d'écran : */
   background-image: url('/bg.jpg'); 
   background-size: cover; 
   background-position: center; 
  background-color: #0d0a06;
}

.bg-overlay {
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at 30% 20%, #1a0d2e88 0%, #0d0a0699 60%, #050302ee 100%);
  pointer-events: none;
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

/* ── Header ── */
.site-header {
  text-align: center;
  padding: 4rem 0 3rem;
}

.site-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(4rem, 12vw, 9rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #f4e4c1;
  margin: 0;
  line-height: 0.9;
  text-shadow:
    0 2px 20px rgba(201, 168, 76, 0.4),
    0 0 60px rgba(201, 168, 76, 0.1);
  transform: rotate(-1.5deg);
  display: inline-block;
}

.site-subtitle {
  font-family: 'IM Fell English', Georgia, serif;
  font-style: italic;
  font-size: clamp(0.9rem, 2vw, 1.15rem);
  color: #c9a84c;
  margin: 1rem 0 2rem;
  letter-spacing: 0.12em;
  opacity: 0.85;
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #c9a84c;
  font-size: 0.9rem;
  opacity: 0.6;
}

.divider-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(to right, transparent, #c9a84c, transparent);
}

/* ── Grid ── */
.grid-area {
  margin-top: 2rem;
}

.scattered-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 4rem 3rem;
  padding: 2rem 1rem;
  /* Espace pour les cartes qui débordent via transform */
  overflow: visible;
}

.state-message {
  text-align: center;
  padding: 4rem;
  font-family: 'IM Fell English', Georgia, serif;
  font-style: italic;
  color: #c9a84c;
  opacity: 0.6;
}

/* ── Footer ── */
.site-footer {
  text-align: center;
  margin-top: 4rem;
  font-family: 'IM Fell English', Georgia, serif;
  font-style: italic;
  font-size: 0.85rem;
  color: #c9a84c;
  opacity: 0.5;
  letter-spacing: 0.1em;
}
</style>
