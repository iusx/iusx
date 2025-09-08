<template>
  <div class="converter">
    <div class="row">
      <label class="label" for="argb">ARGB (0xAARRGGBB 或 RRGGBB)</label>
      <input
        id="argb"
        v-model="inputText"
        class="input"
        placeholder="0xAARRGGBB 或 RRGGBB（如 0050FF）"
        spellcheck="false"
      />
    </div>

    <div class="row">
      <div class="result">
        <div class="line">
          <span class="key">ARGB (完整):</span>
          <span class="val" :class="{ invalid: !isValid }">{{ displayARGB }}</span>
        </div>
        <div class="line">
          <span class="key">Hex (RGB):</span>
          <span class="val" :class="{ invalid: !isValid }">{{ displayHex }}</span>
        </div>
        <div class="line">
          <span class="key">Alpha:</span>
          <span class="val">{{ alphaPercent }}</span>
        </div>
      </div>

      <div class="swatch-wrap">
        <div class="checkerboard"></div>
        <div class="swatch" :style="swatchStyle" title="预览色块"></div>
      </div>
    </div>

    <p v-if="!isValid" class="hint">
      请输入形如 <code>0xAARRGGBB</code>、<code>AARRGGBB</code> 或 <code>RRGGBB</code>（6 或 8 位十六进制值）。例如 <code>0050FF</code> 会被视为 <code>0xFF0050FF</code>。
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const inputText = ref('0xFF0050FF');

const normalized = computed(() => {
  const raw = inputText.value.trim();

  const m = raw.replace(/^0x/i, '').toUpperCase().replace(/[^0-9A-F]/g, '');
  if (/^[0-9A-F]{8}$/.test(m)) return m;        
  if (/^[0-9A-F]{6}$/.test(m)) return 'FF' + m; 
  return null;
});

const isValid = computed(() => normalized.value !== null);

const aa = computed(() => (isValid.value ? normalized.value!.slice(0, 2) : 'FF'));
const rr = computed(() => (isValid.value ? normalized.value!.slice(2, 4) : '00'));
const gg = computed(() => (isValid.value ? normalized.value!.slice(4, 6) : '00'));
const bb = computed(() => (isValid.value ? normalized.value!.slice(6, 8) : '00'));

const displayHex = computed(() => `#${rr.value}${gg.value}${bb.value}`);
const displayARGB = computed(() => (isValid.value ? `0x${aa.value}${rr.value}${gg.value}${bb.value}` : ''));

function hexToInt(h: string) {
  return parseInt(h, 16);
}

const alpha = computed(() => {
  const a = hexToInt(aa.value);
  return Math.max(0, Math.min(1, a / 255));
});

const alphaPercent = computed(() => `${Math.round(alpha.value * 100)}%`);

const swatchStyle = computed(() => {

  return {
    backgroundColor: `rgba(${hexToInt(rr.value)}, ${hexToInt(gg.value)}, ${hexToInt(bb.value)}, ${alpha.value})`,
  };
});
</script>

<style scoped lang="scss">

.converter {
  max-width: 560px;
  padding: 12px;
  border-radius: 12px;
  background: #fafafa;
  border: 1px solid #eee;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";

  .row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 10px 0;
    flex-wrap: wrap;
  }

  .label {
    min-width: 170px;
    font-size: 13px;
    color: #555;
  }

  .input {
    flex: 1 1 260px;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid #ddd;
    outline: none;
    font-family: monospace;
    font-size: 14px;
    &:focus {
      border-color: #999;
    }
  }

  .result {
    flex: 1 1 auto;
    min-width: 260px;
    .line {
      display: flex;
      gap: 8px;
      margin: 4px 0;
      .key {
        color: #666;
        min-width: 100px;
      }
      .val {
        font-family: monospace;
        &.invalid {
          color: #c62828;
        }
      }
    }
  }

  .swatch-wrap {
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #ddd;
    .checkerboard {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(45deg, #ccc 25%, transparent 25%),
        linear-gradient(-45deg, #ccc 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #ccc 75%),
        linear-gradient(-45deg, transparent 75%, #ccc 75%);
      background-size: 12px 12px;
      background-position: 0 0, 0 6px, 6px -6px, -6px 0;
      opacity: 0.5;
    }
    .swatch {
      position: absolute;
      inset: 0;
    }
  }

  .hint {
    margin-top: 6px;
    font-size: 12px;
    color: #666;
    code {
      background: #fff;
      border: 1px solid #eee;
      padding: 1px 4px;
      border-radius: 6px;
    }
  }
}
</style>
