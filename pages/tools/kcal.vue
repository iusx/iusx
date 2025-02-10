<template>
  <div class="calculator">
    <h1>能量计算器</h1>
    <div>
      <label for="foodName">食物名称: </label>
      <input v-model="foodName" type="text" id="foodName" placeholder="请输入食物名称" />
    </div>
    <div>
      <label for="energyPer100g">每100克食物的能量 (kJ): </label>
      <input v-model="energyPer100g" type="number" id="energyPer100g" />
    </div>
    <div>
      <label for="weight">输入食物重量 (克): </label>
      <input v-model="weight" type="number" id="weight" />
    </div>
    <button @click="calculateEnergy">计算能量 (kcal)</button>
    <p v-if="energyResult">{{ energyResult }}</p>
    <button @click="clearStorage">清除缓存</button>

    <h2>今日计算结果</h2>
    <ul>
      <li v-for="(result, index) in todayResults" :key="index">
        {{ result }}
      </li>
    </ul>
    <p v-if="totalEnergy">今日总能量: {{ totalEnergy }} kcal</p>
    <button @click="clearTodayResults">清除今日结果</button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const colorMode = useColorMode();

const foodName = ref(''); // 食物名称
const energyPer100g = ref(870); // 默认每100克食物的能量为870kJ（约等于209.93kcal）
const weight = ref(0);
const energyResult = ref(null);
const todayResults = ref([]); // 存储今日计算的结果

// 从本地存储加载之前保存的结果
onMounted(() => {
  const storedEnergyResult = localStorage.getItem('energyResult');
  if (storedEnergyResult) {
    energyResult.value = storedEnergyResult;
  }

  const storedFoodName = localStorage.getItem('foodName');
  if (storedFoodName) {
    foodName.value = storedFoodName;
  }

  const storedEnergyPer100g = localStorage.getItem('energyPer100g');
  if (storedEnergyPer100g) {
    energyPer100g.value = parseFloat(storedEnergyPer100g);
  }

  loadTodayResults();
});

function calculateEnergy() {
  if (weight.value > 0 && energyPer100g.value > 0 && foodName.value.trim() !== '') {
    // 计算能量并转换为kcal
    const calculatedEnergyKj = (energyPer100g.value / 100) * weight.value;
    const calculatedEnergyKcal = calculatedEnergyKj * 0.239; // 将kJ转换为kcal
    const formattedResult = `${foodName.value} - 能量为: ${calculatedEnergyKcal.toFixed(3)} kcal`;
    energyResult.value = formattedResult;

    // 将结果、食物名称和每100克能量保存到本地存储
    localStorage.setItem('energyResult', energyResult.value);
    localStorage.setItem('foodName', foodName.value);
    localStorage.setItem('energyPer100g', energyPer100g.value);

    // 添加到今日结果列表
    addTodayResult(formattedResult);
  } else {
    alert('请确保输入了有效的食物名称、能量值和重量！');
  }
}

function addTodayResult(result) {
  const currentDate = new Date().toDateString();
  const storageKey = `todayResults_${currentDate}`;

  let results = JSON.parse(localStorage.getItem(storageKey)) || [];
  results.push(result);
  todayResults.value = results;
  localStorage.setItem(storageKey, JSON.stringify(results));
}

function loadTodayResults() {
  const currentDate = new Date().toDateString();
  const storageKey = `todayResults_${currentDate}`;

  const results = JSON.parse(localStorage.getItem(storageKey)) || [];
  todayResults.value = results;
}

const totalEnergy = computed(() => {
  return todayResults.value.reduce((sum, result) => {
    const match = result.match(/能量为: ([\d.]+) kcal/);
    if (match) {
      return sum + parseFloat(match[1]);
    }
    return sum;
  }, 0).toFixed(3);
});

function clearStorage() {
  localStorage.removeItem('energyResult');
  localStorage.removeItem('foodName');
  localStorage.removeItem('energyPer100g');
  energyResult.value = null;
  foodName.value = '';
  energyPer100g.value = 870; // 重置默认值，870kJ 约等于 209.93kcal
}

function clearTodayResults() {
  const currentDate = new Date().toDateString();
  const storageKey = `todayResults_${currentDate}`;

  localStorage.removeItem(storageKey);
  todayResults.value = [];
}
</script>

<style lang="scss" scoped>
.calculator {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  text-align: center;
}

.dark-mode .calculator {
  color: #787878;
  border: 1px solid #323232;
}

.dark-mode input {
  background: #000000;
  color: #727272;
  border: 1px solid #3b3b3b;
}

.dark-mode button {
  background: #4b4b4b;
  color: #9a9a9a;
  border: none;
}

.dark-mode li {
  background-color: #000000;
  margin: 5px 0;
  padding: 5px;
  border: 1px solid #393939;
  border-radius: 5px;
}

input {
  margin: 10px 0;
  padding: 5px;
  width: 100%;
}

button {
  margin: 10px 0;
  padding: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f9f9f9;
  margin: 5px 0;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
