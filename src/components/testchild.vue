<template>
<div>
    <input v-model="v1">
    TEXT IS {{v1}} 
</div>
</template>

<script>
export default {
    data(){
        return{
            v1:'',
        }
    },
    
    watch:{
        'v1':function(){
            this.$emit("test",this.v1);
        }
    }
    
}
</script>

<style>

</style>