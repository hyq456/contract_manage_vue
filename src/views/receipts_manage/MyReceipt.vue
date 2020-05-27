<template>
   <div>
        <myheader :title="title"></myheader>
        <van-search v-model="search" placeholder="请输入搜索关键词" />
        <h3
            v-if="receiptList.length == 0"
            style="text-align: center;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);"
        >暂无发票！</h3>
        <mu-list class="list" v-for="receipt,index in searchlist" :key="index" textline="two-line">
            <mu-list-item :to="{name:'ReceiptInfo', query:{id: receipt.receiptID}}">
            <!-- <mu-list-item :to='/mycontract/'> -->

                <mu-list-item-content>
                    <mu-list-item-title>{{receipt.contractName}}</mu-list-item-title>
                    <mu-list-item-sub-title>{{receipt.receiptName}}</mu-list-item-sub-title>
                </mu-list-item-content>
                <!-- 0 开票 1 收票 -->
                <p>类型：{{receipt.receiptType == 0?'开票':'收票'}}  状态：{{receipt.status == 0?'审批中':'已完成'}}</p>
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
            title: "我的发票",
            receiptList: [],
            search: "",
        };
    },

    mounted() {
        this.$axios
            .get("/receipt", {
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
    computed:{
        searchlist: function() {
            var search = this.search;
            if (search) {
                return this.receiptList.filter(receiptList => {
                    if (receiptList.contractName.includes(search)) {
                        return receiptList;
                    }
                });
            }
            return this.receiptList;
        },
    },
    components: {
        myheader
    }

}
</script>

<style scoped>

</style>