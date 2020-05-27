<template>
    <div>
        <myheader :title="title"></myheader>
        <mu-list textline="two-line">
            <mu-list-item>
                <mu-list-item-title>合同名称：{{contractData.name}}</mu-list-item-title>
                <mu-list-item-title>对方公司：{{contractData.partyB}}</mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
            <mu-list-item>
                <mu-list-item-title>业务员：{{userData.username}}</mu-list-item-title>
                <mu-list-item-title>所属部门：{{userData.department}}</mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
            <mu-list-item>
                <mu-list-item-title>合同金额：{{contractData.total}}元</mu-list-item-title>
                <mu-list-item-title>合同类型：{{contractData.contractType==0?'采购':'销售'}}</mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
            <mu-list-item>
                <mu-list-item-title>开始日期：{{contractData.startDate}}</mu-list-item-title>
                <mu-list-item-title>结束日期：{{contractData.stopDate}}</mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
        </mu-list>
        <div class="center">
            <span class="describe">合同描述：</span>
            <mu-text-field
                disabled
                multi-line
                :rows="1"
                :rows-max="6"
                :solo="true"
                v-model="contractData.contractDescribe"
            ></mu-text-field>
        </div>
        <mu-list textline="two-line">
            <mu-divider shallow-inset></mu-divider>
            <mu-list-item>
                <mu-list-item-title>合同附件：{{contractData.filePath}}</mu-list-item-title>
                <van-button type="info" size="small" @click="downloadModle1">下载</van-button>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
        </mu-list>

        <span class="describe">审批意见：</span>
        <mu-text-field multi-line :rows="3" :rows-max="6" v-model="reviewComment"></mu-text-field>
        <!-- <mu-container>  -->
        <br />
        <mu-button color="primary" @click="agree">同意</mu-button>
        <mu-button color="error" @click="disagree">退回</mu-button>
        <!-- </mu-container> -->
        <mu-snackbar position="top" :color="snackbar.color" :open.sync="snackbar.open">
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
            title: "待审批",
            contractData: "",
            userData: "",
            reviewComment: "",
            pass: 0,
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
                        reviewComment: this.reviewComment,
                        pass: 1
                    })
                )
                .then(response => {
                    if (response.data.code == 200) {
                        let _self = this;
                        this.$options.methods.openSnackbar(
                            _self,
                            "success",
                            "审批完成，已通过"
                        );
                    } else {
                        let _self = this;
                        this.$options.methods.openSnackbar(
                            _self,
                            "error",
                            this.response.data.msg
                        );
                    }
                    var _self = this;
                    setTimeout(function() {
                        _self.$router.replace({
                            path: "/waitreviewlist"
                        });
                    }, 1500);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        disagree() {
            this.$axios
                .post(
                    "/review/",
                    qs.stringify({
                        reviewPeople: this.$store.state.user.id,
                        contractId: this.contractData.id,
                        departmentId: this.$store.state.user.department,
                        reviewComment: this.reviewComment,
                        pass: 0
                    })
                )
                .then(response => {
                    if (response.data.code == 200) {
                        let _self = this;
                        this.$options.methods.openSnackbar(
                            _self,
                            "success",
                            "审批完成，已退回"
                        );
                    } else {
                        let _self = this;
                        this.$options.methods.openSnackbar(
                            _self,
                            "error",
                            this.response.data.msg
                        );
                    }
                    var _self = this;
                    setTimeout(function() {
                        _self.$router.replace({
                            path: "/waitreviewlist"
                        });
                    }, 1500);
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
            .get("/contract/" + this.$route.query.id)
            .then(response => {
                this.contractData = response.data.data;
                this.$axios
                    .get("/user/nameanddepartment", {
                        params: {
                            id: this.contractData.signPeople
                        }
                    })
                    .then(response => {
                        this.userData = response.data.data;
                    })
                    .catch(error => {
                        console.log(error);
                    });
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
.describe {
    font-size: 16px;
    float: left;
    padding: 12px 16px;
}
@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic";
@import "http://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.css";
</style>