<script setup lang="ts">
import { ref } from 'vue'

type BookItem = {
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

const props = defineProps<{ book: BookItem }>()
const emit = defineEmits<{ close: [] }>()

const imgFailed = ref(false)

function formatSubjects(subjects?: string): string[] {
  if (!subjects) return []
  return subjects.split('|').slice(0, 6)
}
</script>

<template>
  <Teleport to="body">
    <div class="overlay" @click.self="emit('close')">
      <div class="modal">
        <button class="close-btn" @click="emit('close')">✕</button>

        <div class="modal-body">
          <!-- Cover -->
          <div class="modal-cover-wrap">
            <div v-if="props.book.coverUrl && !imgFailed" class="modal-cover-img">
              <img
                :src="props.book.coverUrl"
                :alt="props.book.title"
                @error="imgFailed = true"
              />
            </div>
            <div v-else class="modal-cover-placeholder">
              <span>♠</span>
            </div>
          </div>

          <!-- Infos -->
          <div class="modal-infos">
            <h2 class="modal-title">{{ props.book.title }}</h2>
            <p class="modal-author">{{ props.book.author }}</p>

            <p v-if="props.book.description" class="modal-description">
              {{ props.book.description }}
            </p>

            <div class="modal-meta">
              <span v-if="props.book.publisher" class="meta-item">
                <span class="meta-label">Éditeur</span> {{ props.book.publisher }}
              </span>
              <span v-if="props.book.publishedDate" class="meta-item">
                <span class="meta-label">Date</span> {{ props.book.publishedDate }}
              </span>
              <span v-if="props.book.pageCount" class="meta-item">
                <span class="meta-label">Pages</span> {{ props.book.pageCount }}
              </span>
              <span v-if="props.book.language" class="meta-item">
                <span class="meta-label">Langue</span> {{ props.book.language }}
              </span>
            </div>

            <div v-if="formatSubjects(props.book.subjects).length" class="modal-subjects">
              <span v-for="subject in formatSubjects(props.book.subjects)" :key="subject" class="subject-tag">
                {{ subject }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 3, 2, 0.85);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  backdrop-filter: blur(4px);
}

.modal {
  position: relative;
  background: #1a1208;
  border: 1px solid #c9a84c44;
  border-radius: 8px;
  max-width: 780px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.9);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #c9a84c;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0.6;
  line-height: 1;
  z-index: 1;
  transition: opacity 0.2s;
}
.close-btn:hover { opacity: 1; }

.modal-body {
  display: flex;
  gap: 2rem;
  padding: 2rem;
}

/* ── Cover ── */
.modal-cover-wrap {
  flex-shrink: 0;
  width: 160px;
}

.modal-cover-img img {
  width: 160px;
  border-radius: 4px;
  box-shadow: 4px 8px 24px rgba(0, 0, 0, 0.7);
  display: block;
}

.modal-cover-placeholder {
  width: 160px;
  height: 220px;
  background: #2C3E50;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #ECF0F1;
  opacity: 0.4;
}

/* ── Infos ── */
.modal-infos {
  flex: 1;
  min-width: 0;
}

.modal-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f4e4c1;
  margin: 0 0 0.4rem;
  line-height: 1.25;
}

.modal-author {
  font-family: 'IM Fell English', Georgia, serif;
  font-style: italic;
  font-size: 1rem;
  color: #c9a84c;
  margin: 0 0 1.2rem;
}

.modal-description {
  font-size: 0.82rem;
  color: #c8b89a;
  line-height: 1.7;
  margin: 0 0 1.4rem;
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1.4rem;
  margin-bottom: 1.2rem;
}

.meta-item {
  font-size: 0.75rem;
  color: #a89070;
}

.meta-label {
  color: #c9a84c;
  font-weight: 600;
  margin-right: 0.3rem;
}

.modal-subjects {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.subject-tag {
  font-size: 0.65rem;
  padding: 2px 8px;
  border: 1px solid #c9a84c44;
  border-radius: 2px;
  color: #a89070;
  letter-spacing: 0.03em;
}

/* ── Responsive ── */
@media (max-width: 540px) {
  .overlay {
    padding: 0;
    align-items: flex-end;
  }

  .modal {
    border-radius: 12px 12px 0 0;
    max-height: 90vh;
  }

  .modal-body {
    flex-direction: column;
    padding: 1.25rem;
    gap: 1.25rem;
  }

  .modal-cover-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .modal-cover-img img {
    width: 120px;
  }

  .modal-title {
    font-size: 1.2rem;
  }
}
</style>
