<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ItemCard from '@/components/ItemCard.vue'
import BookModal from '@/components/BookModal.vue'
import ArtistModal from '@/components/ArtistModal.vue'

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

type ArtistItem = {
  type: 'artist'
  id: number
  mbid?: string
  name: string
  rank?: number
  userPlaycount?: number
  listeners?: number
  globalPlaycount?: number
  summary?: string
  lastfmUrl?: string
  imageUrl?: string
}

type Item = BookItem | ArtistItem

const items = ref<Item[]>([])
const loading = ref(true)
const error = ref(false)
const selectedBook = ref<BookItem | null>(null)
const selectedArtist = ref<ArtistItem | null>(null)

function openItem(item: Item) {
  if (item.type === 'book') selectedBook.value = item
  else selectedArtist.value = item
}

const API = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
const IMAGES = (import.meta.env.VITE_IMAGES_BASE_URL ?? '').replace(/\/$/, '')

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
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
    const [booksRes, artistsRes] = await Promise.all([
      fetch(`${API}/api/books/random?count=6`),
      fetch(`${API}/api/artists/random?count=3`),
    ])
    if (!booksRes.ok || !artistsRes.ok) throw new Error()

    const booksData = await booksRes.json()
    const artistsData = await artistsRes.json()

    const books: BookItem[] = (Array.isArray(booksData) ? booksData : [booksData]).map((b: any) => ({
      type: 'book' as const,
      isbn: b.isbn,
      title: b.title ?? '',
      author: (b.authors ?? '').split('|')[0] ?? '',
      coverUrl: IMAGES ? `${IMAGES}/covers/${b.isbn}.jpg` : `${API}/api/covers/${b.isbn}`,
      description: b.description || undefined,
      publisher: b.publisher || undefined,
      publishedDate: b.published_date || undefined,
      pageCount: b.page_count || undefined,
      subjects: b.subjects || undefined,
      language: b.language || undefined,
    }))

    const artists: ArtistItem[] = (Array.isArray(artistsData) ? artistsData : [artistsData]).map((a: any) => ({
      type: 'artist' as const,
      id: a.id,
      mbid: a.mbid || undefined,
      name: a.name,
      rank: a.rank || undefined,
      userPlaycount: a.user_playcount || undefined,
      listeners: a.listeners || undefined,
      globalPlaycount: a.global_playcount || undefined,
      summary: a.summary || undefined,
      lastfmUrl: a.lastfm_url || undefined,
      imageUrl: a.mbid ? (IMAGES ? `${IMAGES}/artists/${a.mbid}.jpg` : `${API}/api/artist-images/${a.mbid}`) : undefined,
    }))

    items.value = shuffle([...books, ...artists])
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page">
    <div class="bg-overlay"></div>

    <div class="content">
      <header class="site-header">
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
        <div v-else-if="error" class="state-message">impossible de charger les données</div>
        <div v-else class="scattered-grid">
          <ItemCard
            v-for="(item, i) in items"
            :key="i"
            :item="item"
            :transform="getTransform(i)"
            :colorIndex="i"
            @click="openItem(item)"
          />
        </div>
      </main>

      <BookModal
        v-if="selectedBook"
        :book="selectedBook"
        @close="selectedBook = null"
      />
      <ArtistModal
        v-if="selectedArtist"
        :artist="selectedArtist"
        @close="selectedArtist = null"
      />

    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  position: relative;
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

.site-header {
  text-align: center;
  padding: 3rem 0 2rem;
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

.grid-area {
  margin-top: 2rem;
}

.scattered-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 4rem 3rem;
  padding: 2rem 1rem;
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

@media (max-width: 640px) {
  .page {
    overflow-x: hidden;
  }

  .content {
    padding: 0 1rem 3rem;
  }

  .site-header {
    padding: 2rem 0 1rem;
  }

  .scattered-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 3rem 1.5rem;
    padding: 1.5rem 0.5rem;
  }
}
</style>
