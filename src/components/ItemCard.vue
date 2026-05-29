<script setup lang="ts">
import { ref } from 'vue'

interface BookItem {
  type: 'book'
  isbn: string
  title: string
  author: string
  coverUrl?: string
}

interface ArtistItem {
  type: 'artist'
  name: string
  rank?: number
  userPlaycount?: number
  imageUrl?: string
}

const props = defineProps<{
  item: BookItem | ArtistItem
  transform: string
  colorIndex: number
}>()

const coverColors = [
  { bg: '#2C3E50', text: '#ECF0F1', spine: '#1A252F' },
  { bg: '#6B1A1A', text: '#F4E4C1', spine: '#4A0F0F' },
  { bg: '#1B4332', text: '#D5E8D4', spine: '#0D2B1F' },
  { bg: '#4A235A', text: '#F4E4C1', spine: '#2E1638' },
  { bg: '#1A3A4A', text: '#D6EAF8', spine: '#0F2535' },
  { bg: '#3D2B1F', text: '#F4E4C1', spine: '#261A11' },
  { bg: '#1C1C4E', text: '#D7BDE2', spine: '#101030' },
  { bg: '#2E4057', text: '#EAF2FF', spine: '#1C2A3A' },
] as const

const suits = ['♠', '♥', '♦', '♣'] as const

const color = coverColors[props.colorIndex % coverColors.length]!
const suit = suits[props.colorIndex % suits.length]!

const imgFailed = ref(false)

function formatPlaycount(n?: number): string {
  if (!n) return ''
  if (n >= 1000) return `${Math.round(n / 1000)}k écoutes`
  return `${n} écoutes`
}
</script>

<template>
  <div class="card-wrapper" :style="{ transform: props.transform }">

    <!-- Book card -->
    <div v-if="item.type === 'book'" class="card book-card">
      <div v-if="item.coverUrl && !imgFailed" class="book-cover book-cover-image">
        <div class="book-spine" :style="{ backgroundColor: color.spine }"></div>
        <img :src="item.coverUrl" :alt="item.title" class="cover-img" @error="imgFailed = true" />
      </div>
      <div v-else class="book-cover" :style="{ backgroundColor: color.bg }">
        <div class="book-spine" :style="{ backgroundColor: color.spine }"></div>
        <span class="book-suit" :style="{ color: color.text }">{{ suit }}</span>
        <p class="book-cover-title" :style="{ color: color.text }">{{ item.title }}</p>
        <span class="book-suit book-suit-bottom" :style="{ color: color.text }">{{ suit }}</span>
      </div>
      <div class="book-info">
        <p v-if="item.coverUrl && !imgFailed" class="book-title-info">{{ item.title }}</p>
        <p class="book-author">{{ item.author }}</p>
      </div>
    </div>

    <!-- Artist card -->
    <div v-else class="card artist-card">
      <div class="vinyl-wrap">
        <div class="vinyl-disc">
          <img v-if="item.imageUrl && !imgFailed" :src="item.imageUrl" :alt="item.name" class="vinyl-img" @error="imgFailed = true" />
          <span v-else class="vinyl-placeholder">♪</span>
        </div>
      </div>
      <div class="artist-info">
        <p class="artist-name">{{ item.name }}</p>
        <p v-if="item.userPlaycount" class="artist-playcount">{{ formatPlaycount(item.userPlaycount) }}</p>
      </div>
    </div>

  </div>
</template>

<style scoped>
.card-wrapper {
  display: inline-block;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  will-change: transform;
}

.card-wrapper:hover {
  transform: rotate(0deg) translateY(-14px) scale(1.05) !important;
  z-index: 10;
}

.card {
  border-radius: 6px;
  overflow: hidden;
  box-shadow:
    4px 6px 20px rgba(0, 0, 0, 0.6),
    0 2px 4px rgba(0, 0, 0, 0.4);
  background-color: #f4e4c1;
  width: 200px;
  transition: box-shadow 0.35s ease;
}

.card-wrapper:hover .card {
  box-shadow:
    8px 18px 44px rgba(0, 0, 0, 0.8),
    0 4px 8px rgba(0, 0, 0, 0.5);
}

@media (max-width: 640px) {
  .card-wrapper:hover {
    transform: rotate(0deg) translateY(-8px) scale(1.03) !important;
  }

  .card,
  .book-card,
  .artist-card {
    width: 150px;
  }

  .book-cover {
    height: 190px;
  }

  .vinyl-wrap {
    height: 170px;
  }

  .vinyl-disc {
    width: 130px;
    height: 130px;
  }
}

/* ── Book ── */
.book-card {
  width: 200px;
}

.book-cover {
  position: relative;
  height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 16px 14px 26px;
  overflow: hidden;
}

.book-cover-image {
  padding: 0;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.book-spine {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 12px;
  z-index: 1;
}

.book-suit {
  font-size: 1.2rem;
  opacity: 0.5;
  line-height: 1;
  align-self: flex-start;
}

.book-suit-bottom {
  align-self: flex-end;
  transform: rotate(180deg);
  margin-top: auto;
}

.book-cover-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 0.82rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.4;
  letter-spacing: 0.02em;
  margin: 8px 0;
  flex: 1;
  display: flex;
  align-items: center;
}

.book-info {
  padding: 10px 12px;
  background-color: #f4e4c1;
  border-top: 1px solid #c8a96a;
}

.book-title-info {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: #1a0808;
  margin: 0 0 3px;
  line-height: 1.3;
}

.book-author {
  font-family: 'IM Fell English', Georgia, serif;
  font-style: italic;
  font-size: 0.72rem;
  color: #3a2010;
  margin: 0;
  line-height: 1.3;
}

/* ── Artist ── */
.artist-card {
  width: 200px;
  background: #111 !important;
}

.card-wrapper:hover .artist-card {
  box-shadow:
    8px 18px 44px rgba(0, 0, 0, 0.9),
    0 0 30px rgba(180, 30, 30, 0.15);
}

.vinyl-wrap {
  background: #0d0d0d;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vinyl-disc {
  width: 168px;
  height: 168px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  transition: transform 1.8s linear;
}

/* Groove rings overlay */
.vinyl-disc::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  box-shadow:
    inset 0 0 0 24px rgba(0, 0, 0, 0.38),
    inset 0 0 0 25px rgba(255, 255, 255, 0.04),
    inset 0 0 0 48px rgba(0, 0, 0, 0.28),
    inset 0 0 0 49px rgba(255, 255, 255, 0.04),
    inset 0 0 0 72px rgba(0, 0, 0, 0.18),
    inset 0 0 0 73px rgba(255, 255, 255, 0.03);
  pointer-events: none;
  z-index: 1;
}

/* Center hole */
.vinyl-disc::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #0d0d0d;
  box-shadow: 0 0 0 2px #222;
  z-index: 2;
}

.card-wrapper:hover .vinyl-disc {
  transform: rotate(45deg);
  transition: transform 3s linear;
}

.vinyl-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #1a1a1a;
}

.vinyl-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #444;
  background: #1a1a1a;
}

.artist-info {
  padding: 10px 12px;
  background: #111;
  border-top: 1px solid #2a2a2a;
}

.artist-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: #e8dcc8;
  margin: 0 0 3px;
  line-height: 1.3;
}

.artist-playcount {
  font-size: 0.65rem;
  color: #b03030;
  margin: 0;
  letter-spacing: 0.04em;
  font-weight: 600;
}
</style>
