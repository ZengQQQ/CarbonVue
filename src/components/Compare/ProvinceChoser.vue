<template>
  <div class="province-chooser-container">
    <el-cascader
      v-model="selectedCity"
      placeholder="请选择省市区"
      :options="provinceCityOptions"
      filterable
      @change="handleCityChange"
      class="select"
    />
    <el-button type="primary" @click="addCity" class="button">添加城市</el-button>

    <div class="selected-cities">
      <div class="tags">
        <el-tag v-for="city in selectedCities" :key="city" closable @close="removeCity(city)">
          {{ city }}
        </el-tag>
      </div>
      <el-button type="danger" @click="clearCities">清空城市</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';

const selectedCity = ref([]);
const selectedCities = ref([]);

const provinceCityOptions = ref([]);

const emit = defineEmits(['updateSelectedCities']);

onMounted(async () => {
  const response = await import('@/assets/china_regions.json');
  provinceCityOptions.value = response.default;
});

const handleCityChange = () => {  
  if (selectedCity.value.length) {
    selectedCity.value = selectedCity.value[selectedCity.value.length - 1];
  }
};

const addCity = () => {
  const city = selectedCity.value;
  if (city.length && !selectedCities.value.includes(city)) {
    selectedCities.value.push(city);
    console.log(selectedCities.value);
  } else if (!city.length) {
    ElMessage.warning('请先选择一个市');
  } else {
    ElMessage.warning('该市已经添加');
  }
};

const removeCity = (city) => {
  selectedCities.value = selectedCities.value.filter(c => c !== city);
};

const clearCities = () => {
  selectedCities.value = [];
};

watch(selectedCities.value, (newValue) => {
  emit('updateSelectedCities', newValue);
});
</script>

<style scoped>
.province-chooser-container {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.select {
  margin-right: 10px;
}

.button {
  margin-left: 10px;
}

.selected-cities {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.tags {
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
</style>