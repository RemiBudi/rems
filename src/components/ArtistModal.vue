<script setup lang="ts">
import { ref } from 'vue'

type ArtistItem = {
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

const props = defineProps<{ artist: ArtistItem }>()
const emit = defineEmits<{ close: [] }>()

const imgFailed = ref(false)

function formatNumber(n?: number): string {
  if (!n) return '—'
  return n.toLocaleString('fr-FR')
}
</script>

<template>
  <Teleport to="body">
    <div class="overlay" @click.self="emit('close')">
      <div class="modal">
        <button class="close-btn" @click="emit('close')">✕</button>

        <div class="modal-body">
          <div class="modal-cover-wrap">
            <div v-if="props.artist.imageUrl && !imgFailed" class="modal-cover-img">
              <img
                :src="props.artist.imageUrl"
                :alt="props.artist.name"
                @error="imgFailed = true"
              />
            </div>
            <div v-else class="modal-cover-placeholder">
              <span>♪</span>
            </div>
          </div>

          <div class="modal-infos">
            <p v-if="props.artist.rank" class="modal-rank"># {{ props.artist.rank }}</p>
            <h2 class="modal-name">{{ props.artist.name }}</h2>

            <div class="modal-stats">
              <div v-if="props.artist.userPlaycount" class="stat">
                <span class="stat-value">{{ formatNumber(props.artist.userPlaycount) }}</span>
                <span class="stat-label">écoutes</span>
              </div>
              <div v-if="props.artist.listeners" class="stat">
                <span class="stat-value">{{ formatNumber(props.artist.listeners) }}</span>
                <span class="stat-label">auditeurs</span>
              </div>
              <div v-if="props.artist.globalPlaycount" class="stat">
                <span class="stat-value">{{ formatNumber(props.artist.globalPlaycount) }}</span>
                <span class="stat-label">écoutes mondiales</span>
              </div>
            </div>

            <p v-if="props.artist.summary" class="modal-summary">
              {{ props.artist.summary }}
            </p>

            <a
              v-if="props.artist.lastfmUrl"
              :href="props.artist.lastfmUrl"
              target="_blank"
              rel="noopener"
              class="lastfm-link"
            >
              Voir sur Last.fm →
            </a>
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
  max-width: 680px;
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
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 40px rgba(201, 168, 76, 0.2), 4px 8px 24px rgba(0, 0, 0, 0.7);
  display: block;
}

.modal-cover-placeholder {
  width: 160px;
  height: 160px;
  background: #1C1C4E;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #D7BDE2;
  opacity: 0.4;
}

/* ── Infos ── */
.modal-infos {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.modal-rank {
  font-family: 'IM Fell English', Georgia, serif;
  font-size: 0.8rem;
  color: #c9a84c;
  opacity: 0.7;
  margin: 0 0 0.3rem;
  letter-spacing: 0.1em;
}

.modal-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #f4e4c1;
  margin: 0 0 1.2rem;
  line-height: 1.2;
}

.modal-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.4rem;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #f4e4c1;
}

.stat-label {
  font-size: 0.68rem;
  color: #a89070;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.modal-summary {
  font-size: 0.82rem;
  color: #c8b89a;
  line-height: 1.7;
  margin: 0 0 1.4rem;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.lastfm-link {
  font-family: 'IM Fell English', Georgia, serif;
  font-size: 0.82rem;
  color: #c9a84c;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.lastfm-link:hover { opacity: 1; }

@media (max-width: 480px) {
  .modal-body { flex-direction: column; align-items: center; }
}
</style>
