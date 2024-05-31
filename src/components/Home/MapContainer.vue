<script setup>
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import mapChina from "@/assets/map_china.json";


let map = null;

// 绘制地图阴影
function addPolygon(data, map) {
    let polygon = new AMap.Polygon({
        path: data,
        fillColor: '#ccebc5',
        strokeOpacity: 1,
        fillOpacity: 0.5,
        strokeColor: '#2b8cbe',
        strokeWeight: 1,
        strokeStyle: 'dashed',
        strokeDasharray: [5, 5],
    });
    polygon.on('mouseover', () => {
        polygon.setOptions({
            fillOpacity: 0.7,
            fillColor: '#7bccc4'
        });
    });
    polygon.on('mouseout', () => {
        polygon.setOptions({
            fillOpacity: 0.5,
            fillColor: '#ccebc5'
        });
    });
    map.add(polygon);
}

// 构建地图经纬度信息
function parseGeoJSON(data) {
    const result = {};

    if (data.type === "FeatureCollection" && Array.isArray(data.features)) {
        data.features.forEach(feature => {
            if (feature.type === "Feature" && feature.properties && feature.geometry) {
                const adcode = feature.properties.adcode;
                const coordinates = feature.geometry.coordinates;
                result[adcode] = coordinates;
            }
        });
    }
    return result;
}

onMounted(() => {
    window._AMapSecurityConfig = {
        securityJsCode: "becc39c1fc16bbfeeda795654946465b",
    };
    AMapLoader.load({
        key: "45d9976464d33647343fcb9306345ebf", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    })
        .then((AMap) => {
            map = new AMap.Map("container", {
                // 设置地图容器id
                viewMode: "2D", // 是否为3D地图模式
                zoom: 4.5, // 初始化地图级别
                center: [104.882427,37.302937]  // 初始化地图中心点位置
            });
            // 添加地图边界
            const provinceData = parseGeoJSON(mapChina)
            Object.values(provinceData).forEach(coordinates => {
                addPolygon(coordinates, map)
            })
        })
        .catch((e) => {
            console.log(e);
        });
});

onUnmounted(() => {
    map?.destroy();
});
</script>

<template>
    <div id="container"></div>
</template>

<style scoped>
#container {
    width: 100%;
    height: 800px;
}
</style>
