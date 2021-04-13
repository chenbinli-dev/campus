<template>
  <div id="getAddress">{{this.address}}</div>
</template>

<script>
import Map from 'location/location'
export default {
  name: 'GetLocation',
  data() {
    return {
      address: ''
    }
  },
  methods: {
    //获取当前位置信息
    getLocation() {
      Map.AMap.plugin('AMap.Geolocation', function() {
        var geolocation = new Map.AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new Map.AMap.Pixel(10, 20),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          panToLocation: true,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: 'RB'
        })

        this.address = geolocation.getCurrentPosition()
      })
    }
  },
  mounted() {
    this.getLocation()
  }
}
</script>

<style>
</style>