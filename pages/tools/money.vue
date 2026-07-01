<template>
  <main class="money-tool">
    <header class="tool-head">
      <div class="head-main">
        <this-page>MONEY</this-page>
        <p class="eyebrow">ISLAND ECONOMY ALLOCATION</p>
        <h1>先存鱼，再造网</h1>
        <p class="head-note">现金流 / 储蓄 / 生产性资产</p>
      </div>

      <div class="total-panel" aria-label="总资产">
        <span>NET CASH</span>
        <strong>{{ formatMoney(totalBalance) }}</strong>
        <small>{{ cards.length }} 张银行卡</small>
        <div class="data-actions" aria-label="数据保存操作">
          <button type="button" @click="exportData">导出数据</button>
          <button type="button" @click="triggerImport">导入数据</button>
          <button type="button" @click="exportPdf">导出 PDF</button>
        </div>
        <p v-if="dataStatus" class="data-status">{{ dataStatus }}</p>
        <input
          ref="importInput"
          class="import-input"
          type="file"
          accept="application/json,.json"
          @change="importData"
        />
      </div>
    </header>

    <section class="workspace">
      <form class="panel bank-form" @submit.prevent="addCard">
        <div class="section-title">
          <span>01</span>
          <h2>添加银行卡</h2>
        </div>

        <label>
          银行
          <input v-model.trim="draft.bank" type="text" placeholder="招商 / 工商 / 中信" />
        </label>

        <label>
          卡片标识
          <input v-model.trim="draft.name" type="text" placeholder="工资卡 / 储蓄卡 / 现金账户" />
        </label>

        <label>
          当前金额
          <div class="amount-field">
            <input
              v-model.number="draft.balance"
              type="number"
              min="0"
              step="100"
              placeholder="50000"
            />
            <span class="amount-unit">{{ amountScaleLabel(draft.balance) }}</span>
          </div>
        </label>

        <button class="primary-action" type="submit" :disabled="!canAddCard">
          添加
        </button>
      </form>

      <section class="panel bank-list">
        <div class="section-title">
          <span>02</span>
          <h2>标注金额</h2>
        </div>

        <div v-if="cards.length === 0" class="empty-state">
          先添加一张银行卡，资金用途会自动生成。
        </div>

        <div v-else class="card-stack">
          <article v-for="card in cards" :key="card.id" class="bank-row">
            <div class="bank-id">
              <strong>{{ card.bank || "未命名银行" }}</strong>
              <input v-model.trim="card.name" type="text" aria-label="卡片标识" />
            </div>

            <label class="balance-edit">
              <span>余额</span>
              <div class="amount-field">
                <input
                  v-model.number="card.balance"
                  type="number"
                  min="0"
                  step="100"
                  @blur="normalizeCard(card)"
                />
                <span class="amount-unit">{{ amountScaleLabel(card.balance) }}</span>
              </div>
            </label>

            <button class="ghost-action" type="button" @click="removeCard(card.id)">
              删除
            </button>
          </article>
        </div>
      </section>

      <section class="panel allocation-panel">
        <div class="section-title">
          <span>03</span>
          <h2>分配用途</h2>
        </div>

        <div class="allocation-summary">
          <span>AVAILABLE</span>
          <strong>{{ formatMoney(totalBalance) }}</strong>
          <p>{{ allocationTone }}</p>
        </div>

        <div class="allocation-bars">
          <div v-for="item in allocation" :key="item.key" class="allocation-item">
            <div class="allocation-line">
              <span>{{ item.name }}</span>
              <strong>{{ formatMoney(item.amount) }}</strong>
            </div>
            <div class="bar-track" aria-hidden="true">
              <div class="bar-fill" :style="{ width: `${item.ratio}%` }"></div>
            </div>
            <p>{{ item.anchor }}</p>
          </div>
        </div>

        <table class="allocation-table">
          <thead>
            <tr>
              <th>钱的用途</th>
              <th>金额</th>
              <th>做法</th>
              <th>预计利润</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in allocation" :key="item.key">
              <tr
                class="allocation-main-row"
                :class="{ 'is-open': isAllocationOpen(item.key) }"
                @click="toggleProductTable(item.key)"
              >
                <td>
                  <span class="row-toggle">{{ isAllocationOpen(item.key) ? "-" : "+" }}</span>
                  {{ item.name }}
                </td>
                <td>{{ formatMoney(item.amount) }}</td>
                <td>{{ item.action }}</td>
                <td class="profit-cell">
                  <strong>{{ formatMoney(allocationProfitYearly(item.key, item.amount)) }} / 年</strong>
                  <small>{{ formatMoney(allocationProfitMonthly(item.key, item.amount)) }} / 月</small>
                </td>
              </tr>

              <tr v-if="isAllocationOpen(item.key)" class="product-detail-row">
                <td colspan="4">
                  <table class="product-table">
                    <thead>
                      <tr>
                        <th>产品名字</th>
                        <th>年化收益率</th>
                        <th>预计每月</th>
                        <th>预计每年</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="product in productsFor(item.key)" :key="product.id">
                        <td>
                          <input
                            v-model.trim="product.name"
                            type="text"
                            placeholder="现金管理 / 国债 / 指数基金"
                            @click.stop
                          />
                        </td>
                        <td>
                          <div class="rate-field">
                            <input
                              v-model.number="product.annualRate"
                              type="number"
                              min="0"
                              step="0.1"
                              placeholder="2.0"
                              @click.stop
                            />
                            <span>%</span>
                          </div>
                        </td>
                        <td>{{ estimateMonthly(item.amount, product.annualRate) }}</td>
                        <td>{{ estimateYearly(item.amount, product.annualRate) }}</td>
                        <td>
                          <button
                            class="table-action"
                            type="button"
                            @click.stop="removeProduct(item.key, product.id)"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <button class="table-action add-product" type="button" @click.stop="addProduct(item.key)">
                    添加产品
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr class="profit-total-row">
              <td>利润合计</td>
              <td colspan="2">按已填写产品年化收益率估算</td>
              <td class="profit-cell">
                <strong>{{ formatMoney(totalProfitYearly) }} / 年</strong>
                <small>{{ formatMoney(totalProfitMonthly) }} / 月</small>
              </td>
            </tr>
          </tfoot>
        </table>

        <div class="dca-strip">
          <span>权益定投</span>
          <strong>{{ monthlyInvestment }}</strong>
        </div>
      </section>
    </section>

    <section class="print-sheet" aria-label="PDF 导出表格">
      <header class="print-sheet-head">
        <div>
          <p>ISLAND ECONOMY ALLOCATION</p>
          <h1>资金分配表</h1>
        </div>
        <span>{{ printExportedAt || "-" }}</span>
      </header>

      <table class="print-grid print-summary">
        <tbody>
          <tr>
            <th>总资产</th>
            <td class="number">{{ formatMoney(totalBalance) }}</td>
            <th>银行卡</th>
            <td class="number">{{ cards.length }} 张</td>
          </tr>
          <tr>
            <th>预计年利润</th>
            <td class="number">{{ formatMoney(totalProfitYearly) }}</td>
            <th>预计月利润</th>
            <td class="number">{{ formatMoney(totalProfitMonthly) }}</td>
          </tr>
          <tr>
            <th>权益定投</th>
            <td colspan="3">{{ monthlyInvestment }}</td>
          </tr>
        </tbody>
      </table>

      <h2>银行卡余额</h2>
      <table class="print-grid">
        <thead>
          <tr>
            <th>银行</th>
            <th>卡片标识</th>
            <th>余额</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="card in cards" :key="`print-card-${card.id}`">
            <td>{{ card.bank || "未命名银行" }}</td>
            <td>{{ card.name || "储蓄卡" }}</td>
            <td class="number">{{ formatMoney(card.balance) }}</td>
          </tr>
          <tr v-if="cards.length === 0">
            <td colspan="3" class="muted">暂无银行卡</td>
          </tr>
        </tbody>
      </table>

      <h2>资金分配</h2>
      <table class="print-grid">
        <thead>
          <tr>
            <th>钱的用途</th>
            <th>金额</th>
            <th>做法</th>
            <th>预计月利润</th>
            <th>预计年利润</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in allocation" :key="`print-allocation-${item.key}`">
            <td>{{ item.name }}</td>
            <td class="number">{{ formatMoney(item.amount) }}</td>
            <td>{{ item.action }}</td>
            <td class="number">{{ formatMoney(allocationProfitMonthly(item.key, item.amount)) }}</td>
            <td class="number">{{ formatMoney(allocationProfitYearly(item.key, item.amount)) }}</td>
          </tr>
          <tr class="print-total-row">
            <td colspan="3">利润合计</td>
            <td class="number">{{ formatMoney(totalProfitMonthly) }}</td>
            <td class="number">{{ formatMoney(totalProfitYearly) }}</td>
          </tr>
        </tbody>
      </table>

      <h2>产品收益明细</h2>
      <table class="print-grid">
        <thead>
          <tr>
            <th>用途</th>
            <th>产品名字</th>
            <th>年化收益率</th>
            <th>对应金额</th>
            <th>预计每月</th>
            <th>预计每年</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in allocation" :key="`print-products-${item.key}`">
            <tr v-for="product in printableProductsFor(item.key)" :key="`print-product-${item.key}-${product.id}`">
              <td>{{ item.name }}</td>
              <td>{{ product.name || "未命名产品" }}</td>
              <td class="number">{{ sanitizeRate(Number(product.annualRate)) }}%</td>
              <td class="number">{{ formatMoney(item.amount) }}</td>
              <td class="number">{{ estimateMonthly(item.amount, product.annualRate) }}</td>
              <td class="number">{{ estimateYearly(item.amount, product.annualRate) }}</td>
            </tr>
          </template>
          <tr v-if="printableProductCount === 0">
            <td colspan="6" class="muted">暂无产品收益数据</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";

type BankCard = {
  id: string;
  bank: string;
  name: string;
  balance: number;
};

type AllocationItem = {
  key: string;
  name: string;
  amount: number;
  ratio: number;
  action: string;
  anchor: string;
};

type ProductPlan = {
  id: string;
  name: string;
  annualRate: number;
};

const storageKey = "ritsu_island_money_cards_v1";
const productStorageKey = "ritsu_island_money_products_v1";
const hasMounted = ref(false);
const cards = ref<BankCard[]>([]);
const productPlans = ref<Record<string, ProductPlan[]>>({});
const expandedAllocationKeys = ref<string[]>([]);
const importInput = ref<HTMLInputElement | null>(null);
const dataStatus = ref("");
const printExportedAt = ref("");
const draft = reactive({
  bank: "",
  name: "",
  balance: 50000,
});

const moneyFormatter = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
  maximumFractionDigits: 0,
});

useSeoMeta({
  title: "Money",
  description: "银行卡金额记录与小岛经济学式资金分配",
});

const canAddCard = computed(() => {
  return draft.bank.length > 0 && sanitizeAmount(draft.balance) > 0;
});

const totalBalance = computed(() => {
  return cards.value.reduce((sum, card) => sum + sanitizeAmount(card.balance), 0);
});

const allocation = computed<AllocationItem[]>(() => buildAllocation(totalBalance.value));

const allocationTone = computed(() => {
  if (totalBalance.value <= 0) return "储蓄先于消费，现金流先于冒险。";
  if (totalBalance.value < 20000) return "先把生存缓冲垫厚，再谈更高波动。";
  if (totalBalance.value <= 50000) return "这笔钱适合分成现金、防守底仓和慢速权益。";
  return "保留可用现金，把长期资金交给更能产出的资产。";
});

const monthlyInvestment = computed(() => {
  const equity = allocation.value.find((item) => item.key === "equity")?.amount || 0;
  if (equity <= 0) return "等待可投资余额";

  return `${formatMoney(equity / 12)} - ${formatMoney(equity / 6)} / 月`;
});

const totalProfitYearly = computed(() => {
  return allocation.value.reduce((sum, item) => {
    return sum + allocationProfitYearly(item.key, item.amount);
  }, 0);
});

const totalProfitMonthly = computed(() => totalProfitYearly.value / 12);

const printableProductCount = computed(() => {
  return allocation.value.reduce((sum, item) => {
    return sum + printableProductsFor(item.key).length;
  }, 0);
});

onMounted(() => {
  printExportedAt.value = formatDisplayDate(new Date());

  const rawCards = localStorage.getItem(storageKey);

  if (rawCards) {
    try {
      const parsed = JSON.parse(rawCards);
      if (Array.isArray(parsed)) {
        cards.value = normalizeCards(parsed);
      }
    } catch {
      cards.value = [];
    }
  }

  const rawProducts = localStorage.getItem(productStorageKey);
  if (rawProducts) {
    try {
      const parsed = JSON.parse(rawProducts);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        productPlans.value = normalizeProductPlans(parsed);
      }
    } catch {
      productPlans.value = {};
    }
  }

  hasMounted.value = true;
});

watch(
  cards,
  (value) => {
    if (!hasMounted.value) return;
    localStorage.setItem(storageKey, JSON.stringify(value));
  },
  { deep: true },
);

watch(
  productPlans,
  (value) => {
    if (!hasMounted.value) return;
    localStorage.setItem(productStorageKey, JSON.stringify(value));
  },
  { deep: true },
);

function addCard() {
  if (!canAddCard.value) return;

  cards.value.unshift({
    id: createId(),
    bank: draft.bank,
    name: draft.name || "储蓄卡",
    balance: sanitizeAmount(draft.balance),
  });

  draft.bank = "";
  draft.name = "";
  draft.balance = 0;
}

function removeCard(id: string) {
  cards.value = cards.value.filter((card) => card.id !== id);
}

function normalizeCard(card: BankCard) {
  card.balance = sanitizeAmount(card.balance);
}

function toggleProductTable(key: string) {
  if (isAllocationOpen(key)) {
    expandedAllocationKeys.value = expandedAllocationKeys.value.filter((item) => item !== key);
    return;
  }

  expandedAllocationKeys.value.push(key);
  if (productsFor(key).length === 0) {
    addProduct(key);
  }
}

function isAllocationOpen(key: string) {
  return expandedAllocationKeys.value.includes(key);
}

function productsFor(key: string) {
  if (!productPlans.value[key]) {
    productPlans.value[key] = [];
  }

  return productPlans.value[key];
}

function addProduct(key: string) {
  productsFor(key).push({
    id: createId(),
    name: "",
    annualRate: 0,
  });
}

function removeProduct(key: string, id: string) {
  productPlans.value[key] = productsFor(key).filter((product) => product.id !== id);
  if (productPlans.value[key].length === 0) {
    addProduct(key);
  }
}

function exportData() {
  const backup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    cards: cards.value,
    productPlans: productPlans.value,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `iusx-money-${formatExportDate(new Date())}.json`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  dataStatus.value = "数据已导出";
}

function triggerImport() {
  importInput.value?.click();
}

function importData(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        dataStatus.value = "未找到可导入的数据";
        return;
      }

      const hasCards = Object.prototype.hasOwnProperty.call(parsed, "cards");
      const hasProducts = Object.prototype.hasOwnProperty.call(parsed, "productPlans");

      if (!hasCards && !hasProducts) {
        dataStatus.value = "未找到可导入的数据";
        return;
      }

      cards.value = normalizeCards(parsed.cards);
      productPlans.value = normalizeProductPlans(parsed.productPlans);
      expandedAllocationKeys.value = Object.keys(productPlans.value).filter(
        (key) => productPlans.value[key]?.length,
      );
      dataStatus.value = "数据已导入";
    } catch {
      dataStatus.value = "导入失败，请选择有效 JSON";
    } finally {
      input.value = "";
    }
  };
  reader.readAsText(file);
}

async function exportPdf() {
  expandedAllocationKeys.value = allocation.value.map((item) => item.key);
  printExportedAt.value = formatDisplayDate(new Date());
  dataStatus.value = "已展开明细，可在打印窗口保存为 PDF";
  await nextTick();
  window.print();
}

function buildAllocation(total: number): AllocationItem[] {
  const cleanTotal = sanitizeAmount(total);
  const base = [
    {
      key: "emergency",
      name: "应急现金",
      action: "货币基金、现金管理、活期/通知存款",
      anchor: "先让岛上有过冬的鱼。",
    },
    {
      key: "stable",
      name: "稳定底仓",
      action: "定存、储蓄国债、低风险固收类",
      anchor: "把储蓄变成低波动的资本底座。",
    },
    {
      key: "equity",
      name: "权益投资",
      action: "分 6-12 个月定投，不一把梭",
      anchor: "用长期资金参与生产性资产。",
    },
  ];

  if (cleanTotal <= 0) {
    return base.map((item) => ({ ...item, amount: 0, ratio: 0 }));
  }

  const [emergencyRatio, stableRatio] =
    cleanTotal < 20000 ? [0.6, 0.3] : cleanTotal <= 50000 ? [0.4, 0.4] : [0.25, 0.45];

  let emergency = cleanTotal * emergencyRatio;
  if (cleanTotal > 50000) {
    emergency = Math.min(Math.max(emergency, 20000), 60000);
  }

  let stable = cleanTotal * stableRatio;
  if (cleanTotal > 50000) {
    stable = Math.max(stable, 20000);
  }

  emergency = roundToHundred(emergency);
  stable = roundToHundred(stable);

  if (emergency + stable > cleanTotal) {
    stable = Math.max(0, cleanTotal - emergency);
  }

  const equity = Math.max(0, cleanTotal - emergency - stable);
  const amounts = [emergency, stable, equity];

  return base.map((item, index) => {
    const amount = amounts[index];
    return {
      ...item,
      amount,
      ratio: cleanTotal > 0 ? Math.round((amount / cleanTotal) * 100) : 0,
    };
  });
}

function sanitizeAmount(value: number) {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.round(value);
}

function sanitizeRate(value: number) {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Number(value.toFixed(2));
}

function normalizeCards(value: unknown): BankCard[] {
  if (!Array.isArray(value)) return [];

  return value.map((card) => ({
    id: String(card?.id || createId()),
    bank: String(card?.bank || ""),
    name: String(card?.name || "储蓄卡"),
    balance: sanitizeAmount(Number(card?.balance)),
  }));
}

function normalizeProductPlans(value: unknown): Record<string, ProductPlan[]> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).map(([key, products]) => [
      key,
      Array.isArray(products)
        ? products.map((product) => ({
            id: String(product?.id || createId()),
            name: String(product?.name || ""),
            annualRate: sanitizeRate(Number(product?.annualRate)),
          }))
        : [],
    ]),
  );
}

function roundToHundred(value: number) {
  return Math.round(value / 100) * 100;
}

function formatMoney(value: number) {
  return moneyFormatter.format(sanitizeAmount(value));
}

function estimateMonthly(amount: number, annualRate: number) {
  return formatMoney((sanitizeAmount(amount) * sanitizeRate(Number(annualRate))) / 100 / 12);
}

function estimateYearly(amount: number, annualRate: number) {
  return formatMoney((sanitizeAmount(amount) * sanitizeRate(Number(annualRate))) / 100);
}

function allocationProfitYearly(key: string, amount: number) {
  const products = productPlans.value[key] || [];
  return products.reduce((sum, product) => {
    return sum + productProfitYearly(amount, product.annualRate);
  }, 0);
}

function allocationProfitMonthly(key: string, amount: number) {
  return allocationProfitYearly(key, amount) / 12;
}

function productProfitYearly(amount: number, annualRate: number) {
  return (sanitizeAmount(amount) * sanitizeRate(Number(annualRate))) / 100;
}

function printableProductsFor(key: string) {
  return (productPlans.value[key] || []).filter((product) => {
    return product.name.trim().length > 0 || sanitizeRate(Number(product.annualRate)) > 0;
  });
}

function amountScaleLabel(value: number) {
  const amount = sanitizeAmount(Number(value));
  if (amount < 100) return "元";
  if (amount < 1000) return "百";
  if (amount < 10000) return "千";
  if (amount < 100000000) return `${formatScaleNumber(amount / 10000)} 万`;
  return `${formatScaleNumber(amount / 100000000)} 亿`;
}

function formatScaleNumber(value: number) {
  return value.toFixed(1).replace(/\.0$/, "");
}

function formatExportDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function createId() {
  return `card_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
</script>

<style lang="scss" scoped>
.money-tool {
  min-height: 100vh;
  padding: 72px clamp(16px, 4vw, 64px) 120px;
  color: #111;
  background: #f4f5f7;
}

.tool-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 320px);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto 28px;
  align-items: end;
}

.head-main {
  display: grid;
  row-gap: 16px;
  border-left: 1px solid #111;
  padding-left: 24px;

  h1 {
    margin: 26px 0 0;
    font-family: "Tsing", "Roboto", sans-serif;
    font-size: clamp(32px, 5vw, 64px);
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0;
  }
}

.eyebrow,
.head-note,
.total-panel span,
.total-panel small,
.section-title span,
.allocation-summary span,
.dca-strip span {
  margin: 0;
  color: #777;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.head-note {
  font-size: 14px;
  text-transform: none;
}

.money-tool :deep(.about small) {
  color: #777;
}

.total-panel,
.panel {
  border: 1px solid #d6d6d6;
  background: #fff;
  border-radius: 0;
}

.total-panel {
  min-height: 160px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  strong {
    display: block;
    margin-top: 16px;
    font-family: "Tsing", "Roboto", sans-serif;
    font-size: clamp(30px, 4vw, 48px);
    font-weight: 400;
    line-height: 1;
  }
}

.data-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 16px;

  button {
    min-height: 36px;
    padding: 0 10px;
    border-color: #d6d6d6;
    background: transparent;
    color: #555;
    font-size: 12px;

    &:hover {
      border-color: #111;
      color: #111;
    }
  }
}

.data-status {
  margin: 10px 0 0;
  color: #777;
  font-size: 12px;
  line-height: 1.4;
}

.import-input {
  display: none;
}

.print-sheet {
  display: none;
}

.workspace {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(280px, 380px) minmax(0, 1fr);
  grid-template-areas:
    "form allocation"
    "list allocation";
  gap: 16px;
  align-items: start;
}

.panel {
  padding: 20px;
}

.bank-form {
  grid-area: form;
}

.bank-list {
  grid-area: list;
}

.allocation-panel {
  grid-area: allocation;
}

.section-title {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e7e7e7;
  margin-bottom: 18px;

  h2 {
    margin: 0;
    color: inherit;
    font-size: 22px;
    font-weight: 600;
    text-transform: none;
  }
}

label {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
  color: #666;
  font-size: 13px;
}

input {
  width: 100%;
  min-height: 44px;
  box-sizing: border-box;
  border: 1px solid #d6d6d6;
  border-radius: 0;
  background: #fafafa;
  color: #111;
  padding: 10px 12px;
  font: inherit;
  outline: none;

  &:focus {
    border-color: #111;
    background: #fff;
  }
}

input[type="number"] {
  appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  margin: 0;
  appearance: none;
}

.amount-field {
  position: relative;
  display: block;

  input {
    padding-right: 56px;
  }
}

.amount-unit {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #777;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

button {
  min-height: 44px;
  border-radius: 0;
  border: 1px solid #111;
  padding: 0 16px;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
}

.primary-action {
  width: 100%;
  background: #111;
  color: #fff;

  &:not(:disabled):hover {
    background: #38e7cd;
    border-color: #38e7cd;
    color: #000;
  }
}

.ghost-action {
  background: transparent;
  color: #555;
  border-color: #d6d6d6;

  &:hover {
    border-color: #111;
    color: #111;
  }
}

.empty-state {
  padding: 24px 0 6px;
  color: #777;
  font-size: 14px;
  line-height: 1.7;
}

.card-stack {
  display: grid;
  gap: 12px;
}

.bank-row {
  display: grid;
  grid-template-columns: minmax(150px, 190px) minmax(0, 1fr) auto;
  gap: 12px;
  align-items: end;
  padding: 14px 0;
  border-bottom: 1px solid #e7e7e7;

  &:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }
}

.bank-id {
  display: grid;
  gap: 8px;
  min-width: 0;

  strong {
    font-size: 15px;
  }
}

.balance-edit {
  margin: 0;
  min-width: 0;
}

.allocation-summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px 16px;
  align-items: end;
  padding-bottom: 24px;
  border-bottom: 1px solid #e7e7e7;

  strong {
    font-family: "Tsing", "Roboto", sans-serif;
    font-size: clamp(30px, 5vw, 60px);
    font-weight: 400;
    line-height: 1;
  }

  p {
    grid-column: 1 / -1;
    margin: 0;
    color: #666;
  }
}

.allocation-bars {
  display: grid;
  gap: 18px;
  margin: 24px 0;
}

.allocation-line {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-weight: 700;
}

.bar-track {
  height: 20px;
  margin-top: 10px;
  border: 1px solid #d6d6d6;
  background: #f4f5f7;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #38e7cd;
  transition: width 0.35s ease;
}

.allocation-item p {
  margin: 8px 0 0;
  color: #777;
  font-size: 13px;
}

.allocation-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 18px;
  border-top: 1px solid #d6d6d6;

  > thead > tr > th,
  > tbody > tr > td,
  > tfoot > tr > td {
    padding: 14px 16px;
    border-bottom: 1px solid #e7e7e7;
    text-align: left;
    vertical-align: top;
  }

  > thead > tr > th {
    color: #777;
    font-size: 12px;
    font-weight: 700;
  }

  > tbody > tr > td,
  > tfoot > tr > td {
    color: #111;
    font-size: 14px;
    line-height: 1.5;
  }

  > thead > tr > th:nth-child(2),
  > tbody > tr > td:nth-child(2) {
    width: 150px;
    text-align: right;
  }

  > thead > tr > th:nth-child(4),
  > tbody > tr > td:nth-child(4),
  > tfoot > tr > td:nth-child(3) {
    width: 170px;
    text-align: right;
  }
}

.allocation-main-row {
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover,
  &.is-open {
    background: #f4f5f7;
  }
}

.row-toggle {
  display: inline-block;
  width: 18px;
  color: #777;
  font-weight: 700;
}

.profit-cell {
  strong,
  small {
    display: block;
    white-space: nowrap;
  }

  small {
    margin-top: 4px;
    color: #777;
    font-size: 12px;
  }
}

.profit-total-row {
  background: #f4f5f7;
  font-weight: 700;

  td {
    border-top: 1px solid #d6d6d6;
  }
}

.product-detail-row > td {
  background: #fafafa;
}

.product-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 10px 8px;
    border-bottom: 1px solid #e7e7e7;
    text-align: left;
    vertical-align: middle;
  }

  th {
    color: #777;
    font-size: 12px;
    font-weight: 700;
  }

  td {
    color: #111;
    font-size: 13px;
  }

  th:nth-child(2),
  td:nth-child(2),
  th:nth-child(3),
  td:nth-child(3),
  th:nth-child(4),
  td:nth-child(4) {
    width: 120px;
    text-align: right;
  }

  th:last-child,
  td:last-child {
    width: 72px;
    text-align: right;
  }

  input {
    min-height: 38px;
  }
}

.rate-field {
  position: relative;

  input {
    padding-right: 28px;
    text-align: right;
  }

  span {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #777;
    font-size: 12px;
    font-weight: 700;
  }
}

.table-action {
  min-height: 34px;
  border-color: #d6d6d6;
  background: transparent;
  color: #555;
  font-size: 12px;

  &:hover {
    border-color: #111;
    color: #111;
  }
}

.add-product {
  margin-top: 12px;
}

.dca-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 18px;
  padding: 14px 0 0;

  strong {
    color: #111;
  }
}

.dark-mode .money-tool {
  background: #000;
  color: #d8d8d8;
}

.dark-mode .money-tool :deep(.about small) {
  color: #555;
}

.dark-mode .head-main {
  border-left-color: #3a3a3a;
}

.dark-mode .total-panel,
.dark-mode .panel {
  border-color: #2a2a2a;
  background: #050505;
}

.dark-mode .section-title,
.dark-mode .allocation-summary,
.dark-mode .bank-row,
.dark-mode .allocation-table,
.dark-mode .allocation-table th,
.dark-mode .allocation-table td,
.dark-mode .allocation-table tfoot td,
.dark-mode .product-table th,
.dark-mode .product-table td {
  border-color: #252525;
}

.dark-mode input {
  border-color: #2f2f2f;
  background: #000;
  color: #d8d8d8;

  &:focus {
    border-color: #38e7cd;
    background: #050505;
  }
}

.dark-mode .amount-unit {
  color: #777;
}

.dark-mode .primary-action {
  border-color: #38e7cd;
  background: #38e7cd;
  color: #000;
}

.dark-mode .ghost-action {
  border-color: #303030;
  color: #9b9b9b;

  &:hover {
    border-color: #38e7cd;
    color: #38e7cd;
  }
}

.dark-mode .data-actions button {
  border-color: #303030;
  color: #9b9b9b;

  &:hover {
    border-color: #38e7cd;
    color: #38e7cd;
  }
}

.dark-mode .bar-track {
  border-color: #2f2f2f;
  background: #000;
}

.dark-mode .allocation-main-row:hover,
.dark-mode .allocation-main-row.is-open,
.dark-mode .product-detail-row > td {
  background: #000;
}

.dark-mode .profit-total-row {
  background: #050505;
}

.dark-mode .product-table td {
  color: #d8d8d8;
}

.dark-mode .rate-field span {
  color: #777;
}

.dark-mode .table-action {
  border-color: #303030;
  color: #9b9b9b;

  &:hover {
    border-color: #38e7cd;
    color: #38e7cd;
  }
}

.dark-mode .allocation-table td,
.dark-mode .allocation-table tfoot td,
.dark-mode .dca-strip strong {
  color: #d8d8d8;
}

@media (max-width: 900px) {
  .money-tool {
    padding-top: 48px;
  }

  .tool-head,
  .workspace {
    grid-template-columns: 1fr;
  }

  .workspace {
    grid-template-areas:
      "form"
      "list"
      "allocation";
  }
}

@media (max-width: 640px) {
  .head-main {
    padding-left: 16px;
  }

  .total-panel,
  .panel {
    padding: 16px;
  }

  .bank-row {
    grid-template-columns: 1fr;
  }

  .allocation-summary,
  .allocation-line,
  .dca-strip {
    display: grid;
    grid-template-columns: 1fr;
  }

  .allocation-table {
    > thead > tr > th:nth-child(2),
    > tbody > tr > td:nth-child(2),
    > thead > tr > th:nth-child(4),
    > tbody > tr > td:nth-child(4),
    > tfoot > tr > td:nth-child(3) {
      width: auto;
      text-align: left;
      padding-right: 0;
    }
  }

  .product-table {
    min-width: 620px;
  }

  .product-detail-row > td {
    overflow-x: auto;
  }
}

@media print {
  @page {
    size: A4;
    margin: 10mm;
  }

  :global(html),
  :global(body),
  :global(#app) {
    background: #fff !important;
  }

  :global(*) {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  :global(.scanline),
  :global(.hud-sidebar) {
    display: none !important;
  }

  .money-tool {
    min-height: auto;
    padding: 0;
    background: #fff !important;
    color: #111 !important;
    font-family: "Times New Roman", "Songti SC", "STSong", "SimSun", serif !important;
  }

  .tool-head,
  .workspace {
    display: none !important;
  }

  .print-sheet {
    display: block;
    color: #111;
    font-family: "Times New Roman", "Songti SC", "STSong", "SimSun", serif;
  }

  .print-sheet-head {
    display: block;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1.2pt solid #111;
    text-align: center;

    p,
    h1 {
      margin: 0;
    }

    p,
    span {
      color: #444;
      font-size: 8.5px;
      font-weight: 700;
      letter-spacing: 0;
      text-transform: uppercase;
    }

    span {
      display: block;
      margin-top: 6px;
      font-weight: 400;
    }

    h1 {
      margin-top: 6px;
      color: #111;
      font-size: 21px;
      line-height: 1.25;
      font-weight: 700;
    }
  }

  .print-sheet h2 {
    margin: 16px 0 6px;
    padding: 0 0 4px;
    border-bottom: 0.8pt solid #111;
    background: transparent;
    color: #111;
    font-size: 12px;
    line-height: 1.35;
    font-weight: 700;
  }

  .print-grid {
    width: 100%;
    margin: 0 0 14px;
    border-top: 1.1pt solid #111;
    border-bottom: 1.1pt solid #111;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 9.5px;
    page-break-inside: auto;

    th,
    td {
      padding: 6px 8px;
      border: 0.6pt solid #777;
      background: #fff;
      color: #111;
      line-height: 1.4;
      vertical-align: top;
      word-break: break-word;
    }

    th {
      background: #f2f2f2;
      font-weight: 700;
      text-align: left;
    }

    thead th {
      background: #f2f2f2;
      border-bottom: 0.9pt solid #111;
    }

    tr {
      break-inside: avoid;
    }

    .number {
      text-align: right;
      white-space: nowrap;
      word-break: normal;
    }

    .muted {
      color: #777;
      text-align: center;
    }
  }

  .print-summary {
    th {
      width: 18%;
      background: #f2f2f2;
    }

    td {
      width: 32%;
      font-weight: 700;
    }
  }

  .print-total-row td {
    border-top: 1pt solid #111;
    background: #f2f2f2;
    font-weight: 700;
  }

  .print-sheet-head,
  .print-summary,
  .print-grid,
  .print-sheet h2 {
    break-inside: avoid;
  }
}
</style>
