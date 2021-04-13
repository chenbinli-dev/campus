<template>
  <div class="editinput" @click="InputClick">
    <slot></slot>
    <div class="input-name">
      <slot name="left"></slot>
    </div>
    <div class="input-value">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditInput',
  methods: {
    InputClick () {
      this.$emit('InputClick')
    }
  }
}
</script>

<style>
.editinput {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 3.2vw;
  border-bottom: 1px solid #eee;
  align-items: center;
}
.input-name {
  font-size: 4vw;
  color: #505050;
  text-align: center;
  align-items: center;
}
.input-value {
  font-size: 4vw;
  color: #999;
  overflow: hidden;
  max-width: 48vw;
  text-overflow: ellipsis;
}
.input-value img {
  width: 12.26667vw;
  height: 12.26667vw;
  border-radius: 6.13333vw;
}
</style>