<template>
  <div class="comparison-container">
    <province-chooser @updateSelectedCities="updateSelectedCities" />

    <div class="indicator-selection">
      <el-checkbox-group v-model="selectedIndicators">
        <el-checkbox label="指标1" value="指标1" />
        <el-checkbox label="指标2" value="指标2" />
        <el-checkbox label="指标3" value="指标3" />
        <!-- 
          TODO:这里需要添加后端的指标。
         -->
      </el-checkbox-group>
    </div>

    <el-button type="primary" @click="fetchData" class="button">获取数据</el-button>

    <el-table 
      v-if="tableData.length" 
      :data="tableData" 
      class="custom-table"
      style="width: 100%; margin-top: 20px;"
      height="400px" 
      :scrollbar-always-on="true"
      border
    >
      <el-table-column prop="indicator" label="指标"></el-table-column>
      <el-table-column v-for="city in selectedCities" :key="city" :prop="city" :label="city"></el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import ProvinceChooser from '@/components/Compare/ProvinceChoser.vue';
import { getCityIndex } from '@/api/cityIndex';

const selectedCities = ref([]);
const selectedIndicators = ref([]);
const tableData = ref([]);

const updateSelectedCities = (cities) => {
  selectedCities.value = cities;
};

const fetchData = async () => {
  if (!selectedCities.value.length || !selectedIndicators.value.length) {
    ElMessage.warning('请先选择城市和指标');
    return;
  }

  const data = await getDataFromBackend(selectedCities.value, selectedIndicators.value);

  tableData.value = selectedIndicators.value.map(indicator => {
    const row = { indicator };
    selectedCities.value.forEach(city => {
      row[city] = data[city] && data[city][indicator] !== undefined ? data[city][indicator] : 'N/A';
    });
    return row;
  });
};

const getDataFromBackend = async (cities, indicators) => {
  const mockData = await getCityIndex(cities);

  return new Promise(resolve => {
    setTimeout(() => {
      const result = {};
      cities.forEach(city => {
        result[city] = {};
        indicators.forEach(indicator => {
          result[city][indicator] = mockData[city] ? mockData[city][indicator] : 'N/A';
        });
      });
      resolve(result);
    }, 1000);
  });
};
</script>

<style scoped>
.comparison-container {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 20px auto;
}

.indicator-selection {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button {
  display: block;
  margin: 20px auto;
}

.custom-table {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.el-table th, .el-table td {
  text-align: center;
}

.el-table th {
  background-color: #409EFF;
  color: white;
  font-weight: bold;
}

.el-table td {
  background-color: #fff;
}
</style>