<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useI18n } from '../../i18n/useI18n'
import { useFocusTrap } from '../../composables/useFocusTrap'
import BaseBadge from '../ui/BaseBadge.vue'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

const props = defineProps({
  project: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close'])
const { lang, t } = useI18n()

const drawerPanelRef = ref(null)
const isOpen = computed(() => !!props.project)

useFocusTrap(drawerPanelRef, isOpen, () => emit('close'))

watch(
  () => props.project,
  (val) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = val ? 'hidden' : ''
  },
  { immediate: true }
)

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Transition name="drawer-fade">
    <div v-if="project" class="drawer-overlay" @click.self="emit('close')">
      <aside
        ref="drawerPanelRef"
        tabindex="-1"
        class="drawer-panel"
        role="dialog"
        aria-modal="true"
        :aria-label="project.content[lang].title"
      >
        <div class="drawer-header">
          <div class="drawer-badges">
            <BaseBadge variant="accent">{{ project.category }}</BaseBadge>
            <BaseBadge variant="neutral">{{ project.year }}</BaseBadge>
          </div>
          <button
            type="button"
            class="btn-close"
            :aria-label="t('showreel.close')"
            @click="emit('close')"
          >
            <AppIcon name="close" :size="18" />
          </button>
        </div>

        <div class="drawer-body">
          <div v-if="project.coverImage" class="drawer-media-preview">
            <img
              :src="project.coverImage.src"
              :alt="project.coverImage.alt[lang]"
              width="640"
              height="360"
              loading="lazy"
              class="drawer-cover-img"
            />
          </div>

          <h2 class="drawer-title">{{ project.content[lang].title }}</h2>
          <p class="drawer-outcome">{{ project.content[lang].outcomeHeadline }}</p>

          <div class="drawer-tldr-box">
            <span class="tldr-kicker">{{ t('caseStudyPage.tldrLabel') }}</span>
            <p class="drawer-tldr">{{ project.content[lang].tldr }}</p>
          </div>

          <div class="drawer-metrics">
            <div v-for="m in project.metrics" :key="m.value" class="dm-item">
              <span class="dm-val tabular-nums">{{ m.value }}</span>
              <span class="dm-lbl">{{ m.label[lang] }}</span>
            </div>
          </div>

          <div class="drawer-sec">
            <h3>{{ t('caseStudyPage.problem') }}</h3>
            <p>{{ project.content[lang].problem }}</p>
          </div>

          <div v-if="project.content[lang].objectives?.length" class="drawer-sec">
            <h3>{{ t('caseStudyPage.objectives') }}</h3>
            <ul>
              <li v-for="(obj, i) in project.content[lang].objectives" :key="i">{{ obj }}</li>
            </ul>
          </div>

          <div class="drawer-sec">
            <h3>{{ t('caseStudyPage.designChoices') }}</h3>
            <ul>
              <li v-for="(c, i) in project.content[lang].designChoices" :key="i">{{ c }}</li>
            </ul>
          </div>

          <div v-if="project.content[lang].techArchitecture" class="drawer-sec">
            <h3>{{ t('caseStudyPage.techSolution') }}</h3>
            <div class="tech-pills">
              <span v-for="item in project.content[lang].techArchitecture.stack" :key="item" class="tech-pill">
                {{ item }}
              </span>
            </div>
            <p>{{ project.content[lang].techArchitecture.details }}</p>
          </div>

          <div class="drawer-sec">
            <h3>{{ t('caseStudyPage.results') }}</h3>
            <ul>
              <li v-for="(r, i) in project.content[lang].results" :key="i">{{ r }}</li>
            </ul>
          </div>
        </div>

        <div class="drawer-footer">
          <BaseButton :to="`/progetti/${project.slug}`" variant="secondary" @click="emit('close')">
            <span>{{ t('projectsPage.openCaseStudy') }}</span>
            <AppIcon name="arrow-right" :size="16" />
          </BaseButton>
          <BaseButton v-if="project.links.live" :href="project.links.live" external variant="primary">
            <span>{{ t('caseStudyPage.openLive') }}</span>
            <AppIcon name="arrow-up-right" :size="16" />
          </BaseButton>
          <BaseButton v-if="project.links.figma" :href="project.links.figma" external variant="primary">
            <span>{{ lang === 'it' ? 'Apri Design Figma' : 'Open Figma Design' }}</span>
            <AppIcon name="arrow-up-right" :size="16" />
          </BaseButton>
        </div>
      </aside>
    </div>
  </Transition>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 220;
  background: rgba(5, 5, 7, 0.8);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: flex-end;
}

.drawer-panel {
  width: 100%;
  max-width: 600px;
  height: 100%;
  background: var(--surface-1);
  border-left: 1px solid var(--border-strong);
  box-shadow: var(--specular);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem 1.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.drawer-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.btn-close {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-2);
  color: var(--text-secondary);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s var(--ease-spring);
}

.btn-close:hover {
  color: var(--text-primary);
  border-color: var(--accent-border);
}

.btn-close:active {
  transform: scale(0.96);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.drawer-media-preview {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--surface-2);
  border: 1px solid var(--border-subtle);
  flex-shrink: 0;
}

.drawer-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.drawer-title {
  font-size: 1.7rem;
  font-weight: 700;
  letter-spacing: var(--track-display);
  color: var(--text-primary);
}

.drawer-outcome {
  font-size: 1rem;
  font-weight: 500;
  color: var(--accent);
}

.drawer-tldr-box {
  padding: 1rem 1.15rem;
  background: var(--surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
}

.tldr-kicker {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  margin-bottom: 0.35rem;
}

.drawer-tldr {
  font-size: 0.94rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.drawer-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
}

.dm-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.dm-val {
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.dm-lbl {
  font-size: 0.74rem;
  color: var(--text-tertiary);
}

.drawer-sec h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.drawer-sec p,
.drawer-sec li {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.drawer-sec ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.drawer-sec li {
  position: relative;
  padding-left: 1.15rem;
}

.drawer-sec li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--accent);
}

.tech-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.65rem;
}

.tech-pill {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-secondary);
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  padding: 0.25rem 0.65rem;
}

.drawer-footer {
  padding: 1.15rem 1.5rem;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
}

.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.24s ease;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .drawer-fade-enter-active,
  .drawer-fade-leave-active {
    transition: none;
  }
}
</style>
