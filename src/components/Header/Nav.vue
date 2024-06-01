<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
    router
    >
    <el-menu-item index="/" router>
      <img
        style="width: 50px"
        src="@/assets/logo.svg"
        alt="Element logo"
      />
      <h1>&nbsp&nbsp碳达峰碳中和进程跟踪系统</h1>
    </el-menu-item>
    <div class="flex-grow" ></div>
    
    <el-menu-item index="/" router><el-icon><House /></el-icon>主页</el-menu-item>
    <el-menu-item index="2" router><el-icon><Reading /></el-icon>政策文件</el-menu-item>
    <el-menu-item index="/dataComparison" router><el-icon><SwitchFilled /></el-icon>数据对比</el-menu-item>
    <el-menu-item index="/other" router>其他</el-menu-item>
  </el-menu>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { House, Reading, SwitchFilled } from '@element-plus/icons-vue'

const router = useRouter();

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
