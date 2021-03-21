/* 这是一个可自定义的普通组件-文本输入组件 */
<template>
    <div id="input" class="input">
        <van-field  
        :type="type" 
        :placeholder="placeholder"
        :rule="rule"
        clearable=clearable
        v-model="content"
        class="text-input" 
        />
    </div> 
</template>

<script>
export default {
    //导出组件
    name:'TextInput',
    data() {
        return {
            content:''
        }
    },
    props:['clearable','type','placeholder','rule'],
    methods:{
            handlerulg() {
            //验证输入是否符合正则表达式
            const rule = new RegExp(this.rule)
            if(rule.test(this.content)) {
                //符合正则表达式
                this.$emit('inputChange',this.content)
            }
        }
    },
    watch:{
        //输入内容改变时调用
        content() {
            this.handlerulg();
        }
    }
}
</script>

<style>
.input{
    width: auto;
}
.text-input{
   padding: 4vw;
}
</style>