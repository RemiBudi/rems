<script setup lang="ts">
import { ref } from 'vue'

interface BookItem {
  type: 'book'
  isbn: string
  title: string
  author: string
  coverUrl?: string
}

interface PartitionItem {
  type: 'partition'
  title: string
  composer: string
}

const props = defineProps<{
  item: BookItem | PartitionItem
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

    <!-- Partition card -->
    <div v-else class="card partition-card">
      <div class="partition-top">
        <span class="clef">𝄞</span>
        <div class="staff">
          <div v-for="i in 5" :key="i" class="staff-line"></div>
        </div>
      </div>
      <div class="partition-info">
        <p class="partition-title">{{ item.title }}</p>
        <p class="partition-composer">{{ item.composer }}</p>
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

/* ── Partition ── */
.partition-card {
  width: 200px;
}

.partition-top {
  position: relative;
  height: 160px;
  background-color: #faf3e0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 14px;
  border-bottom: 1px solid #c8a96a;
}

.clef {
  font-size: 6rem;
  line-height: 1;
  color: #1a0808;
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.85;
}

.staff {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding-left: 48px;
}

.staff-line {
  height: 1px;
  background-color: #3a2010;
  width: 100%;
  opacity: 0.7;
}

.partition-info {
  padding: 10px 12px;
  background-color: #f4e4c1;
}

.partition-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: #1a0808;
  margin: 0 0 4px;
  line-height: 1.3;
}

.partition-composer {
  font-family: 'IM Fell English', Georgia, serif;
  font-style: italic;
  font-size: 0.72rem;
  color: #5a3a20;
  margin: 0;
}
</style>
