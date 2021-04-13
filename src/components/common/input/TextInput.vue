/* 这是一个可自定义的普通组件-文本输入组件 */
<template>
  <div id="input" class="input">
    <field
      :type="type"
      :placeholder="placeholder"
      :rule="rule"
      :lengthLimit="lengthLimit"
      clearable="clearable"
      v-model="content"
      class="text-input"
      @blur="emitContent"
    />
  </div>
</template>

<script>
import { Field } from 'vant'
export default {
  //导出组件
  name: 'TextInput',
  data () {
    return {
      content: ''
    }
  },
  props: ['clearable', 'type', 'placeholder', 'rule', "lengthLimit"],
  methods: {
    emitContent () {
      this.$emit('emitContent', this.content)
    }
  },
  components: {
    Field
  }
}
</script>

<style>
.input {
  width: auto;
}
.text-input {
  padding: 4vw;
}
</style>