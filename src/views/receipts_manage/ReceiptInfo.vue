<template>
    <div>
        <myheader :title="title"></myheader>
        <br>
        <mu-form
            ref="form"
            :model="form"
            class="contract-form"
            label-position="left"
            label-width="100"
            :auto-validate="false"
        >
            <mu-form-item label="合同名称" prop="receiptName">
                <mu-text-field v-model="contract.name" disabled></mu-text-field>
            </mu-form-item>
            <mu-form-item label="发票名称" prop="receiptName">
                <mu-text-field v-model="form.receiptName" disabled></mu-text-field>
            </mu-form-item>
            <mu-form-item label="对方公司" prop="partyB">
                <mu-text-field v-model="form.partyB" type="number" disabled></mu-text-field>
            </mu-form-item>
            <mu-form-item label="发票金额" prop="amount">
                <mu-text-field v-model="form.amount" type="number" suffix="元" disabled></mu-text-field>
            </mu-form-item>
            <mu-form-item label="发票代码" prop="receiptCode">
                <mu-text-field v-model="form.receiptCode" type="number" disabled></mu-text-field>
            </mu-form-item>
            <mu-form-item label="发票号码" prop="receiptNumber">
                <mu-text-field v-model="form.receiptNumber" type="number" disabled></mu-text-field>
            </mu-form-item>
            <mu-form-item prop="receiptDate" label="发票日期">
                <mu-date-input
                    v-model="form.receiptDate"
                    label-float
                    full-width
                    no-display
                    value-format="YYYY-MM-DD"
                    disabled
                ></mu-date-input>
            </mu-form-item>
            <mu-form-item prop="notes" label="备注">
                <mu-text-field
                    multi-line
                    :rows="3"
                    :rows-max="6"
                    v-model="form.notes"
                    :max-length="100"
                    disabled
                ></mu-text-field>
            </mu-form-item>
        </mu-form>
    </div>
</template>

<script>
import myheader from "../../components/Myheader";
export default {
    data() {
        return {
            title: "发票详情",
            receiptData: "",
            contract:"",
            form: {
                receiptName: "",
                amount: "",
                partyB: "",
                notes: "",
                receiptDate: "",
                receiptCode: "",
                receiptNumber: "",
                contractId: ""
            },
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
                    this.form = response.data.data;
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