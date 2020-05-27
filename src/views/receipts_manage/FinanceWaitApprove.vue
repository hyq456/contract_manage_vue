<template>
    <div>
        <myheader :title="title"></myheader>
        <h3
            v-if="receiptList.length == 0"
            style="text-align: center;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);"
        >暂无待审批发票！</h3>
        <mu-list class="list" v-for="receipt,index in receiptList" :key="index" textline="two-line">
            <mu-list-item :to="{name:'FinanceApproveInfo', query:{id: receipt.receiptID,approveid:receipt.approveId,type:receipt.receiptType}}">
                <mu-list-item-content>
                    <mu-list-item-title>{{receipt.contractName}}</mu-list-item-title>
                    <mu-list-item-sub-title>{{receipt.receiptName}}</mu-list-item-sub-title>
                </mu-list-item-content>
                <!-- 0 开票 1 收票 -->
                <p>类型：{{receipt.receiptType == 0?'开票':'收票'}} </p>
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
            title: "待审批发票",
            receiptList: "",
            contract: ""
        };
    },
    mounted() {
        this.$axios
            .get("/receiptApprove", {
                params: {
                    userId: this.$store.state.user.id
                }
            })
            .then(response => {
                this.receiptList = response.data.data;
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

<style>
</style>