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
        v-for="indicator in selectedIndicators"
        :key="indicator"
        :prop="indicator"
        :label="indicator"
        sortable
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
  const mockData = await getAllIndex();
  return new Promise(resolve => {
    setTimeout(() => {
      const result = [];
      for (const city in mockData) {
        const row = { city };
        indicators.forEach(indicator => {
          row[indicator] = mockData[city] ? mockData[city][indicator] : 'N/A';
        });
        result.push(row);
      }
      resolve(result);
    }, 1000);
  });
};

// 模拟需要展示的指标数据
// TODO: 替换这些要展示的指标
const selectedIndicators = ref(['index1', 'index2', 'index3']);

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
  width: 80%;
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