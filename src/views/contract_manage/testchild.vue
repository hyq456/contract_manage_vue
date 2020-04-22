<template>
    <input v-model="v1">
    TEXT IS {{v1}} 
</template>

<script>
export default {
    data(){
        return{
            v1:'',
        }
    },
    created:function(){
        this.$emit("test",this.v1)
    }
}
</script>

<style>

</style>