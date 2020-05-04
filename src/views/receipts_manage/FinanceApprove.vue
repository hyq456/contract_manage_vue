<template>
    <div>
        <myheader :title="title"></myheader>
        <br />
        <mu-form
            ref="form"
            :model="form"
            class="contract-form"
            label-position="left"
            label-width="100"
            :auto-validate="false"
        >
            <mu-form-item label="发票名称" prop="receiptName">
                <mu-text-field v-model="form.receiptName" disabled></mu-text-field>
            </mu-form-item>
            <mu-form-item label="对方公司" prop="partyB">
                <mu-text-field v-model="form.partyB" type="number" disabled></mu-text-field>
            </mu-form-item>
            <mu-form-item label="发票金额" prop="amount">
                <mu-text-field v-model="form.amount" type="number" disabled></mu-text-field>
            </mu-form-item>
            <mu-form-item label="发票代码" prop="receiptCode">
                <mu-text-field v-model="form.receiptCode" type="number" :disabled="disabled"></mu-text-field>
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
        <mu-button color="primary" @click="submit">完成</mu-button>
        <mu-snackbar :color="snackbar.color" :open.sync="snackbar.open" position="top">
            <mu-icon left :value="icon"></mu-icon>
            {{snackbar.message}}
            <mu-button flat slot="action" color="#fff" @click="snackbar.open = false">Close</mu-button>
        </mu-snackbar>
    </div>
</template>

<script>
import myheader from "../../components/Myheader";
import qs from "qs";
export default {
    data() {
        return {
            title: "待审批发票",
            receiptData: "",
            contract: "",
            disabled:true,
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
            snackbar: {
                color: "success",
                message: "Hello World, Snackbar !",
                open: false,
                timeout: 3000
            }
        };
    },
    methods: {
        submit() {
            this.$axios
                .post(
                    "/receiptApprove",
                    qs.stringify({
                        approveId: this.$route.query.approveid
                    })
                )
                .then(response => {
                    if (response.data.code == 200) {
                        let _self = this;
                        this.$options.methods.openSnackbar(
                            _self,
                            "success",
                            "已完成"
                        );
                        setTimeout(function() {
                            _self.$router.replace({
                                path: "/receipt/leaderapprove"
                            });
                        }, 1000);
                    } else {
                        let _self = this;
                        this.$options.methods.openSnackbar(
                            _self,
                            "error",
                            "失败,请重试"
                        );
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
        openSnackbar(_self, color, message) {
            _self.snackbar.color = color;
            _self.snackbar.message = message;
            if (_self.snackbar.timer) clearTimeout(_self.snackbar.timer);
            _self.snackbar.open = true;
            _self.snackbar.timer = setTimeout(() => {
                _self.snackbar.open = false;
            }, _self.snackbar.timeout);
        }
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
                this.$axios
                    .get("/contract/" + this.receiptData.contractId)
                    .then(response => {
                        this.contract = response.data.data;
                    });
            })
            .catch(error => {
                console.log(error);
            });
    },
    computed: {
        icon() {
            return {
                success: "check_circle",
                info: "info",
                warning: "priority_high",
                error: "warning"
            }[this.snackbar.color];
        }
    },
    components: {
        myheader
    }
};
</script>

<style>
</style>