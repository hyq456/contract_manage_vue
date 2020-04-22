<template>
    <div>
        <myheader :title="title"></myheader>
        {{this.$route.query.id}}
    </div>
</template>

<script>
import myheader from '../../components/Myheader';
import qs from 'qs';
export default {
    data(){
        return{
            title:"我的合同",
            contractData:'',
            
        }
    },
    mounted(){
    this.$axios.get('/contract/'+this.$route.query.id)
    .then((response) => {
        this.contractData = response.data.data;
    }).catch((error)=> {
        console.log(error);
    });

},
    components:{
        myheader,
    }
}
</script>

<style scoped>

</style>