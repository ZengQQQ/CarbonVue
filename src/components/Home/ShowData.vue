<template>
  <div class="table-container">
    <el-table 
      :data="tableData" 
      class="custom-table"
      height="400px" 
      :scrollbar-always-on="true"
      border
    >
      <el-table-column prop="city" label="城市" width="180"></el-table-column>
      <el-table-column
        v-for="(indicator, index) in selectedIndicators"
        :key="index"
        :prop="indicator"
        :label="getLabel(indicator)"
        sortable
        :sort-method="(a, b) => customSort(a, b, indicator)"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllIndex } from '@/api/cityIndex';

// 存储表格数据
const tableData = ref([]);

// 获取全部的指标数据，不全部展示的话，进行过滤。indicator是要展示的指标
const getDataFromBackend = async (indicators) => {
  let mockData = await getAllIndex();
  // mockData = JSON.parse(mockData)
  return new Promise(resolve => {
    setTimeout(() => {
      const result = [];
      mockData.forEach(item => {
        const city = item.city.C_name;
        const row = {city};
        indicators.forEach(indicator => {
          let indicator_value = item && item[indicator] !== null ? Number(parseFloat(item[indicator]).toFixed(3)) : '暂无数据';
          row[indicator] = indicator_value;
        });
        result.push(row);
      });
      resolve(result);
    }, 1000);
  });
};

// 模拟需要展示的指标数据
// TODO: 替换这些要展示的指标
const selectedIndicators = ref(['CO2','CDR_CO2', 'PCO2', 'CC_Fuel','NRE_Fuel']);
const viewIndicators = ref(['CO2排放', '单位GDP碳排放', '人均CO2', '煤炭占一次能源消费比重', '非化石能源占一次能源消费比重'])
// 获取指标对应的展示名称
const getLabel = (indicator) => {
  return viewIndicators.value[selectedIndicators.value.indexOf(indicator)];
};

function customSort(a, b, prop) {
  const aValue = a[prop];
  const bValue = b[prop];

  if (isNaN(aValue) || isNaN(bValue)) {
    if (isNaN(aValue) && isNaN(bValue)) {
      return a[prop] > b[prop] ? 1 : -1; // 非数字之间的比较
    } else if (isNaN(aValue)) {
      return 1; // 如果a是非数字，排在后面
    } else {
      return -1; // 如果b是非数字，排在前面
    }
  } else {
    return aValue - bValue; // 数字之间的比较
  }
}
// 在组件挂载时获取数据
onMounted(async () => {
  tableData.value = await getDataFromBackend(selectedIndicators.value);
});
</script>

<style scoped>
.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.custom-table {
  width: 90%;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.el-table {
  border-radius: 8px;
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

.el-table__body-wrapper {
  border-radius: 8px;
}
</style>