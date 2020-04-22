<template>
    <div>
        <myheader :title="title"></myheader>
        <h3
            v-if="contractData.length == 0"
            style="text-align: center;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);"
        >暂无执行中合同！</h3>
        <mu-list class="list" v-for="contract,index in contractData" :key="contract.id">
            <mu-list-item :to="{name:'Executing', query:{id: contract.id}}">
                <!-- <mu-list-item :to='/mycontract/'> -->

                <mu-list-item-content>
                    <mu-list-item-title>合同名称：{{contract.name}}</mu-list-item-title>
                    <mu-list-item-sub-title>乙方：{{contract.partyB}}</mu-list-item-sub-title>
                </mu-list-item-content>
                类型：{{contract.contractType == 0?'采购':'销售'}}
                <!-- <mu-linear-progress :value="progress" mode="determinate"></mu-linear-progress> -->
            </mu-list-item>
            <mu-list-item :to="{name:'Executing', query:{id: contract.id}}">
                <mu-linear-progress
                    :value="100 - (contract.remainder/contract.total)*100"
                    mode="determinate"
                ></mu-linear-progress>
                
            </mu-list-item>
            <mu-list-item :to="{name:'Executing', query:{id: contract.id}}">
                <mu-list-item-title>剩余日期：{{lastdays(contract.stopDate)}}天</mu-list-item-title>
            </mu-list-item>


            <mu-divider></mu-divider>
        </mu-list>
    </div>
</template>

<script>
import myheader from "../../components/Myheader";
import qs from "qs";
export default {
    data() {
        return {
            title: "执行中的合同",
            contractData: [],
            activeStep: 0
        };
    },

    methods:{
        lastdays(val){
            let date1 = new Date();
            let date2 = new Date(Date.parse(val.replace(/-/g, "/")));
            let date3= date2.getTime()-date1.getTime();
            let days=Math.floor(date3/(24*3600*1000))
            return days;
        }
    },

    mounted() {
        this.$axios
            .get("/contract/execute", {
                params: {
                    sign_people: this.$store.state.user.id
                }
            })
            .then(response => {
                
                this.contractData = response.data.data;
            })
            .catch(error => {
                console.log(error);
            });
    },

    components: {
        myheader
    }
};
</script>

<style scoped>
@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic";
@import "http://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.css";
/* .list {
    margin-top: -1px;
    border: 1px solid #ccc;
    padding-top: 5px;
    } */
.list_desc {
    font-size: 14px;
    font-weight: 600;
    /* color: rgb(86, 168, 235); */
}
</style>                           