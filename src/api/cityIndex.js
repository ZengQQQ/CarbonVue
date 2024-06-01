import baseApi from "@/api/baseUrl";


// 获取选中城市的指标
export const getCityIndex = (cities) => {
    return baseApi.get('/citys', {
      params: {
        cities
      }
    });
  };


// 得到所有城市的指标
export const getAllIndex = () => {
    return baseApi.get('/data');
  };