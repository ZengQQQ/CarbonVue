<template>
    <div class="map-container">
        <div ref="main" class="map" :style="{ height: '500px' }"></div>
        <button ref="backBtn" v-if="showBackBtn" @click="goBack">返回</button>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive, nextTick } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';
const backBtn = ref(null);
const main = ref(null);
const showBackBtn = ref(false);
let myChart = ref(null);
let mapList = reactive([]);
let CityInfosObject = reactive([])
let ProvinceInfosObject = reactive([])


async function fetchData() {
    try {
        const response = await axios.get('http://127.0.0.1:8000/data/')
        const response2 = await axios.get('http://127.0.0.1:8000/province_data/')
        CityInfosObject = response.data
        ProvinceInfosObject = response2.data
        CityInfosObject.forEach((item) => {
            item.CO2 = Number(parseFloat(JSON.parse(item.CO2)).toFixed(3));
            item.CDR_CO2 = Number(parseFloat(JSON.parse(item.CDR_CO2)).toFixed(3));
            item.PCO2 = Number(parseFloat(JSON.parse(item.PCO2)).toFixed(3));
            item.CC_Fuel = Number(parseFloat(JSON.parse(item.CC_Fuel)).toFixed(3));
            item.NRE_Fuel = Number(parseFloat(JSON.parse(item.NRE_Fuel)).toFixed(3));
            item.SOC_Electricity = Number(parseFloat(JSON.parse(item.SOC_Electricity)).toFixed(3));
            item.SIP_GDP = Number(parseFloat(JSON.parse(item.SIP_GDP)).toFixed(3));
            item.SI_Decline = Number(parseFloat(JSON.parse(item.SI_Decline)).toFixed(3));
            item.NEV_Share = Number(parseFloat(JSON.parse(item.NEV_Share)).toFixed(3));
            item.GB_Projects = Number(parseFloat(JSON.parse(item.GB_Projects)).toFixed(3));
            item.PLWaste = Number(parseFloat(JSON.parse(item.PLWaste)).toFixed(3));
            item.AirQuality = Number(parseFloat(JSON.parse(item.AirQuality)).toFixed(3));
            item.ForestCoverage = Number(parseFloat(JSON.parse(item.ForestCoverage)).toFixed(3));
            item.PolicyManagement = Number(parseFloat(JSON.parse(item.PolicyManagement)).toFixed(3));
            item.GF_Green = Number(parseFloat(JSON.parse(item.GF_Green)).toFixed(3));
        })
        ProvinceInfosObject.forEach((item) => {
            item.CO2 = Number(parseFloat(JSON.parse(item.CO2)).toFixed(3));
            item.CDR_CO2 = Number(parseFloat(JSON.parse(item.CDR_CO2)).toFixed(3));
            item.PCO2 = Number(parseFloat(JSON.parse(item.PCO2)).toFixed(3));
            item.CC_Fuel = Number(parseFloat(JSON.parse(item.CC_Fuel)).toFixed(3));
            item.NRE_Fuel = Number(parseFloat(JSON.parse(item.NRE_Fuel)).toFixed(3));
            item.SOC_Electricity = Number(parseFloat(JSON.parse(item.SOC_Electricity)).toFixed(3));
            item.SIP_GDP = Number(parseFloat(JSON.parse(item.SIP_GDP)).toFixed(3));
            item.SI_Decline = Number(parseFloat(JSON.parse(item.SI_Decline)).toFixed(3));
            item.NEV_Share = Number(parseFloat(JSON.parse(item.NEV_Share)).toFixed(3));
            item.GB_Projects = Number(parseFloat(JSON.parse(item.GB_Projects)).toFixed(3));
            item.PLWaste = Number(parseFloat(JSON.parse(item.PLWaste)).toFixed(3));
            item.AirQuality = Number(parseFloat(JSON.parse(item.AirQuality)).toFixed(3));
            item.ForestCoverage = Number(parseFloat(JSON.parse(item.ForestCoverage)).toFixed(3));
            item.PolicyManagement = Number(parseFloat(JSON.parse(item.PolicyManagement)).toFixed(3));
            item.GF_Green = Number(parseFloat(JSON.parse(item.GF_Green)).toFixed(3));
        })
    } catch (error) {
        console.error('Error fetching mapdata:', error)
    }
}

//添加数据
async function getJSON({ name, adcode }) {
    // 获取地图数据
    const url = `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${adcode}_full`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('无此区域地图显示，请查看其他区域！');
    const data = await response.json();
    console.log('CityInfo processing!')
    for (const CityInfo of CityInfosObject) {
        const index = data.features.findIndex(item => item.properties.adcode === CityInfo.C_ID);
        if (index !== -1) {
            data.features[index].properties = { ...data.features[index].properties, ...CityInfo, visualMapMax: 20000 };
        }
    }
    console.log('ProvinceInfo processing!')
    for (const ProvinceInfo of ProvinceInfosObject) {
        const index = data.features.findIndex(item => item.properties.adcode === ProvinceInfo.P_ID);
        if (index !== -1) {
            data.features[index].properties = { ...data.features[index].properties, ...ProvinceInfo, visualMapMax: 50000 };
        }
    }
    setBackbtn({ name, adcode });
    return data;
}


// 设置返回策略
function setBackbtn({ name, adcode }) {
    mapList.push({ name, adcode });
    if (adcode === 100000) {
        showBackBtn.value = false;
    } else {
        showBackBtn.value = true;
    }
}

// 点击返回，地图返回上一级
function goBack() {
    if (mapList.length >= 2) {
        const { name, adcode } = mapList[mapList.length - 2];
        mapList.splice(-2, 2);
        getJSON({ name, adcode }).then((data) => renderChart(name, data));
    }
}

// 渲染地图
function renderChart(name, data) {
    echarts.registerMap(name, data);
    const mapdata = data.features.map((item) => item.properties);
    setOption(name, mapdata);
}

// 设置地图option
function setOption(name, data) {
    // 设置地图图标显示未CO2
    const datause = data.map((item) => {
        if (!item.hasOwnProperty('value')) {
            item.value = item.CO2;
        }
        return item
    });
    const option = {
        tooltip: {
            formatter(params) {
                if (params && params.data) {
                    const { adcode, name, level, CO2, CDR_CO2, AirQuality, ForestCoverage } = params.data;
                    console.log(params.data)
                    const co2Display = CO2 !== undefined && CO2 !== null ? CO2 : '暂无数据';
                    const cdrCo2Display = CDR_CO2 !== undefined && CDR_CO2 !== null ? CDR_CO2 : '暂无数据';
                    const airQualityDisplay = AirQuality !== undefined && AirQuality !== null ? (AirQuality * 100).toFixed(2) + '%' : '暂无数据';
                    const forestCoverageDisplay = ForestCoverage !== undefined && ForestCoverage !== null ? (ForestCoverage * 100).toFixed(2) + '%' : '暂无数据';

                    return `CO2: ${co2Display}<br>单位GDP碳排放: ${cdrCo2Display}<br>空气优良天数率: ${airQualityDisplay}<br>森林覆盖率: ${forestCoverageDisplay}<br>`;
                }
            },
        },
        geo: [
            {
                map: name,
                roam: true,
                zoom: data[0].level === 'province' ? 1.5 : 1, //初始缩放比例
                center: data[0].level === 'province' ? [105, 36] : null, //地图中心点
                selectedMode: 'single',
                label: {
                    show: true,
                    color: '#000000',
                    fontSize: 11,
                },
                // itemStyle: {
                //     areaColor: '#71d5a1',
                //     borderColor: '#2979ff',
                // },
                emphasis: {
                    itemStyle: {
                        areaColor: '#ffff99',
                        borderColor: '#f29100',
                    },
                    label: {
                        fontSize: 16,
                        color: '#f29100',
                    },
                },
            },
        ],
        visualMap: {
            left: 'left',
            top: 'bottom',
            min: 0,
            max: data[0].level === 'province' ? 50000 : 15000,
            inRange: {
                color: [
                '#006837', // 深绿
                '#1a9850', 
                '#31c08c', 
                '#4cc594',
                '#78d19b',
                '#fee090',
                '#fdae61',
                '#f46d43',
                '#d73027',
                // '#a50026'
            ]
            },
            text: ['High', 'Low'],
            calculable: true
        },
        series: [
            {
                type: 'map',
                map: name,
                geoIndex: 0,
                roam: true,
                data: datause,
            },
        ],
    };
    myChart.value.setOption(option, true);
}

onMounted(async () => {
    await nextTick()

    myChart.value = echarts.init(main.value);

    await fetchData()
    await getJSON({ name: 'china', adcode: 100000 }).then((data) => renderChart('china', data));

    //设置地图点击事件
    myChart.value.on('click', (params) => {
        if (params.data) {
            const { adcode, name, level } = params.data;
            if (level === 'district') {
                alert('无此区域地图显示！');
                initChinaMap();
                return;
            }
            getJSON({ name, adcode }).then((data) => renderChart(name, data));
        }
    });
});

onUnmounted(() => {
    myChart.value.dispose();
});

</script>

<style scoped>
.map-container {
    text-align: center;
}

.map {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1400px;
  margin: 20px auto;
}
</style>