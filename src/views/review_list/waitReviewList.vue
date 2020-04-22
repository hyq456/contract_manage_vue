<template>
    <div>
        <myheader :title="title"></myheader>
        <h3
            v-if="reviewProgress.length == 0"
            style="text-align: center;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);"
        >暂无待审批合同！</h3>
        <mu-list
            class="list"
            v-for="review,index in reviewProgress"
            :key="review.id"
            textline="two-line"
        >
            <mu-list-item :to="{name:'WaitReview', query:{id: review.contractId}}" v-if="review.type==1">
                <mu-list-item-content>
                    <mu-list-item-title>{{review.contractName}}</mu-list-item-title>
                    <mu-list-item-sub-title>类别：{{getTypeName(review.type)}}</mu-list-item-sub-title>
                </mu-list-item-content>
                提交时间：{{review.subTime}}
            </mu-list-item>
            <mu-list-item :to="{name:'ChangeReview', query:{id: review.contractId}}" v-if="review.type==2">
                <mu-list-item-content>
                    <mu-list-item-title>{{review.contractName}}</mu-list-item-title>
                    <mu-list-item-sub-title>类别：{{getTypeName(review.type)}}</mu-list-item-sub-title>
                </mu-list-item-content>
                提交时间：{{review.subTime}}
            </mu-list-item>
            <mu-list-item :to="{name:'StopReview', query:{id: review.contractId}}" v-if="review.type==3">
                <mu-list-item-content>
                    <mu-list-item-title>{{review.contractName}}</mu-list-item-title>
                    <mu-list-item-sub-title>类别：{{getTypeName(review.type)}}</mu-list-item-sub-title>
                </mu-list-item-content>
                提交时间：{{review.subTime}}
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
            title: "待审批",
            contractData: [],
            reviewProgress: []
        };
    },
    mounted() {
        this.$axios
            .get("/reviewprogress/", {
                params: {
                    userId: this.$store.state.user.id
                }
            })
            .then(response => {
                
                this.reviewProgress = response.data.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
    methods:{
        getTypeName(type){
            if(type == 1)
            return "新增";
            else if(type == 2)
            return "变更";
            else if(type == 3)
            return "终止";
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