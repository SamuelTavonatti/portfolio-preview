<script setup>
import { useI18n } from '../../i18n/useI18n'
import BaseBadge from '../ui/BaseBadge.vue'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

defineProps({
  project: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close'])
const { lang, t } = useI18n()
</script>

<template>
  <Transition name="drawer-fade">
    <div v-if="project" class="drawer-overlay" @click.self="emit('close')">
      <aside class="drawer-panel" role="dialog" aria-modal="true" :aria-label="project.content[lang].title">
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
          <h2 class="drawer-title">{{ project.content[lang].title }}</h2>
          <p class="drawer-outcome">{{ project.content[lang].outcomeHeadline }}</p>
          <p class="drawer-tldr">{{ project.content[lang].tldr }}</p>

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

          <div class="drawer-sec">
            <h3>{{ t('caseStudyPage.designChoices') }}</h3>
            <ul>
              <li v-for="(c, i) in project.content[lang].designChoices" :key="i">{{ c }}</li>
            </ul>
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
  background: rgba(5, 6, 8, 0.78);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: flex-end;
}

.drawer-panel {
  width: 100%;
  max-width: 560px;
  height: 100%;
  background: var(--surface-1);
  border-left: 1px solid var(--border-strong);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.drawer-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.btn-close {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-2);
  color: var(--text-secondary);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.btn-close:hover {
  color: var(--text-primary);
  border-color: var(--accent-border);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.drawer-title {
  font-size: 1.65rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--text-primary);
}

.drawer-outcome {
  font-size: 1rem;
  font-weight: 500;
  color: var(--accent);
}

.drawer-tldr {
  font-size: 0.94rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

.drawer-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
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
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--text-primary);
}

.dm-lbl {
  font-size: 0.72rem;
  color: var(--text-tertiary);
}

.drawer-sec h3 {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.45rem;
}

.drawer-sec p,
.drawer-sec li {
  font-size: 0.88rem;
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
  padding-left: 1.1rem;
}

.drawer-sec li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--accent);
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
</style>
