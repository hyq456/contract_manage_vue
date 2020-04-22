<template>
    <div>
        <myheader></myheader>
        <h1>{{$store.state.user.username}}</h1>
        {{id}}==============={{role}}

        
    </div>
    
</template>

<script>
import qs from 'qs';
import myheader from '../components/Myheader';
export default {
    data(){
        return{
            id:'aaa',
            role:'aaa',
            params:'',
            value1: undefined,
            value2: undefined,
            value3: undefined
        }
    },
    mounted(){  
        this.getUserInfo();
    
    },
    methods:{
        getUserInfo(){
            this.params = this.$store.state.user.username;
            // this.$axios.get('/getUserInfoByName',qs.stringify({
            //     username:this.params               
            // }))

            // this.$axios.get('/getUserInfoByName',{
            //     params:{username:this.params}
            // })
            // .then((response) => {
            // console.log(response)
            // var userInfo = response.data.user;
            // this.id = userInfo.id;
            // this.role = userInfo.role;

            // this.$axios.get('/getuser',qs.stringify({
            //     id:1                
            // }))
            // .then((response) => {
            // console.log(response)
            // var userInfo = response.data;
            // this.id = userInfo.id;
            // this.role = userInfo.role;
            
        //  })
        //  .catch((error)=> {
        //     console.log(error);
        // });
        
        }
    },
    components:{
        myheader,
    }
}

</script>

<style scoped>

</style>