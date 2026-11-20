<script setup>
import { ref } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import PrivacyModal from './components/modals/PrivacyModal.vue'

const policyModal = ref({
  open: false,
  tab: 'privacy',
})

const openPolicy = (tab = 'privacy') => {
  policyModal.value = { open: true, tab }
}
</script>

<template>
  <div class="app-shell">
    <AppHeader />

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <AppFooter @open-policy="openPolicy" />
    <PrivacyModal
      :is-open="policyModal.open"
      :active-tab="policyModal.tab"
      @close="policyModal.open = false"
    />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>