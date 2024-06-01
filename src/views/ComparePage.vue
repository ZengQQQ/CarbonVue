<template>
  <div class="comparison-container">
    <province-chooser @updateSelectedCities="updateSelectedCities" />

    <div class="indicator-selection">
      <el-checkbox-group v-model="selectedIndicators">
        <el-checkbox
        v-for="indicator in allindicators"
        :label="getLabel(indicator)"
        :value="indicator"
      ></el-checkbox>
        <!-- 
          TODO:这里需要添加后端的指标。
         -->
      </el-checkbox-group>
      <div class="button-container-flex">
        <el-button type="primary" @click="fetchData" class="button">获取数据</el-button>
        <el-button type="danger" @click="cleanData" class="button">清空数据</el-button>
      </div>
      
    </div>

    <el-table 
      v-if="tableData.length" 
      :data="tableData" 
      class="custom-table"
      style="width: 100%; margin-top: 20px;"
      height="400px" 
      :scrollbar-always-on="true"
      border
    >
      <el-table-column prop="label" label="指标"></el-table-column>
      <el-table-column v-for="city in selectedCities" :key="city" :prop="city" :label="city"></el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import ProvinceChooser from '@/components/Compare/ProvinceChoser.vue';
import { getCityIndex, getAllIndex } from '@/api/cityIndex';

const allindicators = ref(['CO2', 'CDR_CO2', 'PCO2', 'CC_Fuel', 'NRE_Fuel', 'SOC_Electricity',
 'SIP_GDP', 'SI_Decline', 'NEV_Share', 'GB_Projects', 'PLWaste', 'AirQuality', 'ForestCoverage', 'PolicyManagement', 'GF_Green']);
const allindicatorsView = ref([
  'CO2',
  '单位GDP碳排放',
  '人均CO2',
  '煤炭占一次能源消费比重',
  '非化石能源占一次能源消费比重',
  '全社会电力消费量(亿千瓦时)',
  '战略性新兴产业增加值占GDP比重',
  '规模以上工业增加值能耗下降率',
  '新能源汽车保有量占汽车保有量占比',
  '绿色建筑项目数',
  '人均生活垃圾日产生量',
  '空气质量优良天数占比',
  '森林覆盖率',
  '政策管理',
  '绿色资金占财政支出比重'
]);
const selectedCities = ref([]);
const selectedIndicators = ref([]);
const tableData = ref([]);
let data = undefined

const getLabel = (indicator) => {
  return allindicatorsView.value[allindicators.value.indexOf(indicator)];
};

const updateSelectedCities = (cities) => {
  selectedCities.value = cities;
  console.log('添加城市', selectedCities.value)
};

const fetchData = async () => {
  if (!selectedCities.value.length || !selectedIndicators.value.length) {
    ElMessage.warning('请先选择城市和指标');
    return;
  }
  // const data = await getDataFromBackend(selectedCities.value, selectedIndicators.value);
  // const data = await getAllIndex();
  tableData.value = []
  tableData.value = selectedIndicators.value.map(indicator => {
    let label = getLabel(indicator);
    const row = { label };
    selectedCities.value.forEach(city => {
      row[city] = '暂无数据';
    });
    for (const item of data) {
      for (const city of selectedCities.value) {
        if (item.city.C_name == city) {
          row[city] = item[indicator] !== null ? Number(parseFloat(item[indicator]).toFixed(3)) : '暂无数据';
          break;
        }
      }
    }
    // selectedCities.value.forEach(city => {
    //   row[city] = data[city] && data[city][indicator] !== undefined ? data[city][indicator] : 'N/A';
    // });
    return row;
  });
  console.log(selectedCities.value)
};

const cleanData = () => {
  tableData.value = [];
  selectedIndicators.value = [];
};
// const getDataFromBackend = async (cities, indicators) => {
//   // const mockData = await getCityIndex(cities);
//   const mockData = await getAllIndex()
//   return new Promise(resolve => {
//     setTimeout(() => {
//       const result = {};
//       cities.forEach(city => {
//         result[city] = {};
//         indicators.forEach(indicator => {
//           result[city][indicator] = mockData[city] ? mockData[city][indicator] : 'N/A';
//         });
//       });
//       resolve(result);
//     }, 1000);
//   });
// };

onMounted(async () => {
  data = await getAllIndex();
});
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

/* .button {
  display: block;
  margin: 20px auto;
} */

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

.button {
  margin-top: 10px;
  margin-right: 5px;
  margin-left: 5px;
}

.button-container-flex {
  display: flex;
  align-items: center;
}
</style>