<template>
    <div>
        <myheader :title="title"></myheader>
        <van-search v-model="search" placeholder="请输入搜索关键词" />
        <h3
            v-if="contractData.length == 0"
            style="text-align: center;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);"
        >暂无已归档合同！</h3>
        <mu-list class="list" v-for="contract,index in searchData" :key="contract.id" textline="two-line">
            <mu-list-item :to="{name:'Filed', query:{id: contract.id}}">
            <!-- <mu-list-item :to='/mycontract/'> -->

                <mu-list-item-content>
                    <mu-list-item-title>{{contract.name}}</mu-list-item-title>
                    <mu-list-item-sub-title>{{contract.partyB}}</mu-list-item-sub-title>
                </mu-list-item-content>
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
            title: "已归档",
            contractData: [],
            search: ""
        };
    },
    mounted() {
        this.$axios
            .get("/contract/filed", {
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
    computed: {
        

        searchData: function() {
            var search = this.search;
            if (search) {
                return this.contractData.filter(contractData => {
                    if (contractData.name.includes(search)) {
                        return contractData;
                    }
                });
            }
            return this.contractData;
        }
    },
    components: {
        myheader
    }
};
</script>

<style scoped>
@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic";
@import "http://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.css";
</style>