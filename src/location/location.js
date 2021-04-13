//使用高德地图插件
import Vue from 'vue'
import VueAMap from 'vue-amap'

Vue.use(VueAMap)
const Map =  VueAMap.initAMapApiLoader({
    key: '93c7dc253896660804c1b7ea63b46dd7', // 官网申请
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geolocation', 'Geocoder'],//plugin所要用到的模块功能，按需添加
    v: '1.4.4',//高德 sdk 版本为 1.4.4
})

export default Map
