<template>
  <div>
      <div class="button" :style="{width:width,height:height}">
          {{btnText}}
      </div>
  </div>
</template>

<script>
export default {
    name:'DiyButton',
    props:['btnText','width','height']
}
</script>

<style>
.button {
    background-color: #ffd300;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 1%;
}
</style>