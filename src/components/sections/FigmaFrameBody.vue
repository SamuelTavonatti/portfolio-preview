<script setup>
import { ref } from 'vue'
const btn = ref(null)
defineExpose({ btn })
</script>

<template>
  <div class="fb">
    <div class="fb-bar"><i /><i /><i /><span>Frame · Auto Layout</span></div>
    <div class="fb-body">
      <div class="fb-k">Workout Logger</div>
      <div class="fb-h">Log every set<br />in one tap.</div>
      <div class="fb-gap"><b>16</b></div>
      <div ref="btn" class="fb-btn"><span class="lbl">Validate Flow →</span></div>
      <span class="fb-rl"><b>24</b></span>
    </div>
  </div>
</template>

<style scoped>
.fb { width: 100%; font-family: Inter, 'SF Pro Display', system-ui, sans-serif; }
.fb-bar { display: flex; align-items: center; gap: 6px; padding: 10px 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 0.68rem; color: #8B91A0; }
.fb-bar i { width: 8px; height: 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.16); }
.fb-bar span { margin-left: 8px; letter-spacing: 0.02em; }
.fb-body { position: relative; padding: 24px; }
.fb-k { font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: #E2B878; font-weight: 600; margin-bottom: 8px; }
.fb-h { font-size: 1.5rem; line-height: 1.12; font-weight: 600; letter-spacing: -0.03em; color: #F5F5F7; }
.fb-gap { position: relative; height: 16px; }
.fb-gap::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 1px; background: #E2B878; opacity: var(--rl, 0); }
.fb-gap b, .fb-rl b { position: absolute; font-size: 9px; font-weight: 600; color: #E2B878; font-family: ui-monospace, monospace; opacity: var(--rl, 0); }
.fb-gap b { left: 7px; top: 50%; transform: translateY(-50%); }
.fb-rl { position: absolute; left: 0; top: 50%; width: 24px; height: 1px; background: #E2B878; opacity: var(--rl, 0); }
.fb-rl b { left: 4px; top: -13px; opacity: 1; }
.fb-btn { height: 44px; border-radius: 999px; display: grid; place-items: center; background: #E2B878; color: #050507; font-weight: 700; font-size: 0.9rem; border: 1px solid transparent; transition: background-color 0.18s, color 0.18s, box-shadow 0.18s; }
.fb-btn.hover { box-shadow: 0 0 0 1px rgba(226, 184, 120, 0.7), 0 8px 28px -6px rgba(226, 184, 120, 0.55); }
.fb-btn.flipped { background: #34D399; color: #04130C; }
</style>
