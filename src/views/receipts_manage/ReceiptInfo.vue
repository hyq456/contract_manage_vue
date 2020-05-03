<template>
    <div>
        <myheader :title="title"></myheader>
        
        <mu-list textline="two-line">
            <mu-list-item>
                <mu-list-item-title>
                        <mu-flex
                            class="flex-demo"
                            fill
                        >合同名称：{{contract.name}}</mu-flex>
                </mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
            <mu-list-item>
                <mu-list-item-title>
                        <mu-flex
                            class="flex-demo"
                            fill
                        >发票名称：{{receiptData.receiptName}}</mu-flex>
                </mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
            <mu-list-item>
                <mu-list-item-title>
                        <mu-flex
                            class="flex-demo"
                            fill
                        >发票代码：{{receiptData.receiptCode}}</mu-flex>
                </mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
            <mu-list-item>
                <mu-list-item-title>
                        <mu-flex
                            class="flex-demo"
                            fill
                        >发票号码：{{receiptData.receiptNumber}}</mu-flex>
                </mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
            <mu-list-item>
                <mu-list-item-title>
                        <mu-flex
                            class="flex-demo"
                            fill
                        >发票金额：{{receiptData.amount}}元</mu-flex>
                </mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
            <mu-list-item>
                <mu-list-item-title>
                        <mu-flex
                            class="flex-demo"
                            fill
                        >对方单位名称：{{receiptData.partyB}}</mu-flex>
                </mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
            <mu-list-item>
                <mu-list-item-title>
                        <mu-flex
                            class="flex-demo"
                            fill
                        >发票日期：{{receiptData.receiptData}}</mu-flex>
                </mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
            <mu-list-item>
                <mu-list-item-title>
                        <mu-flex
                            class="flex-demo"
                            fill
                        >备注：{{receiptData.notes}}</mu-flex>
                </mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
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
            receiptData: "",
            contract:"",
        };
    },
    mounted() {
        this.$axios
            .get("/receipt/", {
                params: {
                    receiptId: this.$route.query.id
                }
            })
            .then(response => {
                this.receiptData = response.data.data;
                this.$axios.get("/contract/" + this.receiptData.contractId)
                .then(response=>{
                    this.contract = response.data.data;
                })
            })
            .catch(error => {
                console.log(error);
            });
    },
    components: {
        myheader
    }
}
</script>

<style>

</style>