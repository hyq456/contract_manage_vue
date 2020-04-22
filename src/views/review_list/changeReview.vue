<template>
    <div class="changeReview">
        <myheader :title="title"></myheader>
        <mu-form
            ref="form"
            :model="form"
            class="contract-form"
            label-position="left"
            label-width="100"
            :auto-validate="false"
        >
            <mu-form-item
                label="合同名称"
                :help-text="func(contractData.name)"
                prop="contract_name"
                :rules="notNullRules"
            >
                <mu-text-field v-model="form.contract_name" solo disabled></mu-text-field>
            </mu-form-item>
            <mu-divider shallow-inset></mu-divider>

            <mu-form-item label="对方公司" help-text="合同主体不允许变更" prop="party_b" :rules="notNullRules">
                <mu-text-field v-model="form.party_b" solo disabled></mu-text-field>
            </mu-form-item>
            <mu-divider shallow-inset></mu-divider>

            <mu-form-item label="合同类型">
                <mu-select v-model="form.type" full-width disabled solo>
                    <mu-option
                        v-for="option,index in options"
                        :key="option"
                        :label="option"
                        :value="index"
                    ></mu-option>
                </mu-select>
            </mu-form-item>
            <mu-divider shallow-inset></mu-divider>

            <mu-form-item
                label="合同金额"
                :help-text="func(contractData.total)"
                prop="total"
                :rules="notNullRules"
            >
                <mu-text-field v-model="form.total" type="number" solo disabled></mu-text-field>
            </mu-form-item>
            <mu-divider shallow-inset></mu-divider>

            <mu-form-item
                prop="start_date"
                :help-text="func(contractData.startDate)"
                label="合同开始日期"
                :rules="notNullRules"
            >
                <mu-date-input
                    v-model="start_date"
                    label-float
                    full-width
                    no-display
                    value-format="YYYY-MM-DD"
                    disabled
                    solo
                ></mu-date-input>
            </mu-form-item>
            <mu-divider shallow-inset></mu-divider>

            <mu-form-item
                prop="stop_date"
                :help-text="func(contractData.stopDate)"
                label="合同结束日期"
                :rules="notNullRules"
            >
                <mu-date-input
                    v-model="stop_date"
                    label-float
                    full-width
                    no-display
                    value-format="YYYY-MM-DD"
                    :min-date="min_date"
                    disabled
                    solo
                ></mu-date-input>
            </mu-form-item>
            <mu-divider shallow-inset></mu-divider>

            <mu-form-item
                prop="textarea"
                :help-text="func(contractData.contractDescribe)"
                label="合同描述"
                :rules="notNullRules"
            >
                <mu-text-field
                    multi-line
                    :rows="3"
                    :rows-max="6"
                    v-model="form.textarea"
                    :max-length="255"
                    solo
                    disabled
                ></mu-text-field>
            </mu-form-item>
            <mu-divider shallow-inset></mu-divider>

            <mu-form-item
                label="合同文件"
                :help-text="func(contractData.filePath)"
                :rules="notNullRules"
                prop="filepath"
            >
                <ul v-if="form.filepath">
                    <li>
                        {{form.filepath}}
                        <van-button type="info" size="mini" @click="downloadModle1">下载</van-button>
                    </li>
                </ul>
            </mu-form-item>
            <mu-divider shallow-inset></mu-divider>


            <mu-form-item prop="describe" label="变更描述" :rules="notNullRules">
                <mu-text-field
                    multi-line
                    :rows="3"
                    :rows-max="6"
                    v-model="form.describe"
                    :max-length="255"
                    solo
                    disabled
                ></mu-text-field>
            </mu-form-item>
            <mu-divider shallow-inset></mu-divider>

            <mu-form-item prop="reviewComment" label="审批意见：" :rules="notNullRules">
                <mu-text-field
                    multi-line
                    :rows="3"
                    :rows-max="6"
                    v-model="form.reviewComment"
                    :max-length="255"
                ></mu-text-field>
            </mu-form-item>

            <!-- <mu-container>  -->
            <mu-button color="primary" @click="agree">同意</mu-button>
            <mu-button color="error" @click="disagree">退回</mu-button>
            <!-- </mu-container> -->
            <mu-snackbar position="top" :open.sync="snackbar.open" :color="snackbar.color">
                {{snackbar.message}}
                <mu-button flat slot="action" color="white" @click="snackbar.open = false">Close</mu-button>
            </mu-snackbar>
        </mu-form>
    </div>
</template>

<script>
import myheader from "../../components/Myheader";
import Toast from "muse-ui-toast";
import qs from "qs";
export default {
    data() {
        const min_date = new Date();
        const max_date = new Date();
        return {
            title: "合同变更审批",
            options: ["采购合同", "销售合同"],
            form: {
                id: "",
                contract_name: "",
                party_b: "",
                start_date: undefined,
                stop_date: undefined,
                textarea: "",
                type: 0,
                filepath: "",
                total: "",
                describe: "",
                reviewComment: ""
            },
            //     原合同信息
            contractData: "",
            start_date: "",
            stop_date: "",
            min_date,
            max_date,
            fileList: [],
            notNullRules: [{ validate: val => !!val, message: "不能为空" }],
            reviewComment: "",
            snackbar: {
                position: "bottom",
                message: "Hello World, Snackbar !",
                open: false,
                timeout: 3000,
                color: "success"
            }
        };
    },
    methods: {
        downloadModle1: function() {
            this.$axios
                .get("/contract/downloadContract", {
                    responseType: "arraybuffer",
                    params: {
                        id: this.contractData.id,
                        filePath: this.contractData.filePath
                    }
                })
                .then(result => {
                    let _fileName = result.headers["content-disposition"]
                        .split(";")[1]
                        .split("=")[1];
                    _fileName = decodeURI(_fileName);
                    let url = window.URL.createObjectURL(
                        new Blob([result.data])
                    );
                    let a = document.createElement("a");
                    a.setAttribute("download", _fileName);
                    a.href = url;
                    a.click();
                });
        },

        agree() {
            this.$axios
                .post(
                    "/review/",
                    qs.stringify({
                        contractId: this.contractData.id,
                        reviewPeople: this.$store.state.user.id,
                        departmentId: this.$store.state.user.department,
                        reviewComment: this.form.reviewComment,
                        pass: 1
                    })
                )
                .then(response => {
                    if (response.data.code == 200) {
                        this.snackbar.message = "审批完成，已通过";
                    } else {
                        this.snackbar.message = this.response.data.msg;
                        this.snackbar.color = "error";
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            if (this.snackbar.timer) clearTimeout(this.snackbar.timer);
            this.snackbar.open = true;
            this.snackbar.timer = setTimeout(() => {
                this.snackbar.open = false;
            }, this.snackbar.timeout);
            var _self = this;
            setTimeout(function() {
                _self.$router.replace({
                    path: "/waitreviewlist"
                });
            }, 1500);
        },
        disagree() {
            this.$axios
                .post(
                    "/review/",
                    qs.stringify({
                        reviewPeople: this.$store.state.user.id,
                        contractId: this.contractData.id,
                        departmentId: this.$store.state.user.department,
                        reviewComment: this.form.reviewComment,
                        pass: 0
                    })
                )
                .then(response => {
                    if (response.data.code == 200) {
                        this.snackbar.message = "审批完成，已退回";
                    } else {
                        this.snackbar.message = this.response.data.msg;
                        this.snackbar.color = "error";
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            if (this.snackbar.timer) clearTimeout(this.snackbar.timer);
            this.snackbar.open = true;
            this.snackbar.timer = setTimeout(() => {
                this.snackbar.open = false;
            }, this.snackbar.timeout);
            var _self = this;
            setTimeout(function() {
                _self.$router.replace({
                    path: "/waitreviewlist"
                });
            }, 1500);
        },
        func(string) {
            return "变更前:" + string;
        }
    },
    mounted() {
        this.$axios
            .get("/contractChange", {
                params: {
                    contractId: this.$route.query.id
                }
            })
            .then(response => {
                this.contractData = response.data.data;
                this.form.id = this.contractData.id;
                this.form.contract_name = this.contractData.name;
                this.form.party_b = this.contractData.partyB;
                this.form.start_date = this.contractData.startDate;
                this.form.stop_date = this.contractData.stopDate;
                this.start_date = this.contractData.startDate;
                this.stop_date = this.contractData.stopDate;
                this.form.textarea = this.contractData.contractDescribe;
                this.form.type = this.contractData.contractType;
                this.form.filepath = this.contractData.filePath;
                this.form.total = this.contractData.total;
                this.form.describe = this.contractData.changeDescribe;
                this.$axios
                    .get("/contract/" + this.$route.query.id)
                    .then(response => {
                        this.contractData = response.data.data;
                    });
            })
            .catch(error => {
                console.log(error);
            });
    },
    watch: {
        start_date(val) {
            var date1 = new Date(Date.parse(val.replace(/-/g, "/")));
            this.form.start_date = val;
            this.min_date = date1;
        },
        stop_date(val) {
            var date2 = new Date(Date.parse(val.replace(/-/g, "/")));
            this.form.stop_date = val;
            this.max_date = date2;
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
</style>>
