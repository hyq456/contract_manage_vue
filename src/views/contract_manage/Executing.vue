<template>
    <div>
        <myheader :title="title"></myheader>

        <mu-list textline="two-line">
            <mu-list-item>
                <mu-list-item-title>
                    <mu-flex class="flex-wrapper" align-items="center">
                        <mu-flex
                            class="flex-demo"
                            justify-content="center"
                            fill
                        >合同名称：{{contractData.name}}</mu-flex>
                    </mu-flex>
                </mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>

            <mu-list-item>
                <mu-list-item-title>
                    <mu-flex class="flex-wrapper" align-items="center">
                        <mu-flex
                            class="flex-demo"
                            justify-content="center"
                            fill
                        >乙方名称：{{contractData.partyB}}</mu-flex>
                    </mu-flex>
                </mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>

            <mu-list-item>
                <mu-list-item-title>
                    <mu-flex class="flex-wrapper" align-items="center">
                        <mu-flex
                            class="flex-demo"
                            justify-content="center"
                            fill
                        >合同金额：{{contractData.total}}元</mu-flex>
                        <mu-flex
                            class="flex-demo"
                            justify-content="center"
                            fill
                        >待结算金额：{{contractData.remainder}}元</mu-flex>
                    </mu-flex>
                </mu-list-item-title>
            </mu-list-item>

            <mu-divider shallow-inset></mu-divider>
            <mu-list-item>
                <mu-list-item-title>
                    <mu-flex
                        class="flex-demo"
                        justify-content="center"
                        fill
                    >待开票金额：{{contractData.unreceipt}}元</mu-flex>
                </mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>

            <mu-list-item>
                <mu-list-item-title>
                    <mu-flex class="flex-wrapper" align-items="center">
                        <mu-flex
                            class="flex-demo"
                            justify-content="center"
                            fill
                        >开始日期：{{contractData.startDate}}</mu-flex>
                        <mu-flex
                            class="flex-demo"
                            justify-content="center"
                            fill
                        >结束日期：{{contractData.stopDate}}</mu-flex>
                    </mu-flex>
                </mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>

            <mu-list-item>
                <mu-list-item-title>合同附件：{{contractData.filePath}}</mu-list-item-title>
                <van-button type="info" size="small" @click="downloadModle1">下载</van-button>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
        </mu-list>
        <mu-linear-progress :value="progress" mode="determinate"></mu-linear-progress>
        <h3>履行记录</h3>
        <mu-flex justify-content="center">
            <mu-button full-width @click="openSimpleDialog" color="primary" flat>
                <mu-icon left value="add_box"></mu-icon>新增记录
            </mu-button>
        </mu-flex>

        <mu-dialog title="新增记录" width="360" :open.sync="openSimple">
            <mu-form ref="form" :model="recordForm">
                <mu-form-item prop="name" label="收付款名称" :rules="notNullRules">
                    <mu-text-field v-model="recordForm.name"></mu-text-field>
                </mu-form-item>
                <mu-form-item prop="type" label="类型" :rules="notNullRules">
                    <mu-radio v-model="recordForm.type" value="0" label="收款"></mu-radio>
                    <mu-radio v-model="recordForm.type" value="1" label="付款"></mu-radio>
                </mu-form-item>
                <mu-form-item
                    prop="number"
                    label="金额"
                    :rules="notNullRules"
                    :error-text="numberError"
                >
                    <mu-text-field type="number" v-model="recordForm.number" suffix="元"></mu-text-field>
                </mu-form-item>
                <mu-form-item prop="time" label="日期" :rules="notNullRules">
                    <mu-date-input
                        v-model="recordForm.time"
                        label-float
                        full-width
                        no-display
                        value-format="YYYY-MM-DD"
                    ></mu-date-input>
                </mu-form-item>
                <mu-form-item prop="more" label="备注">
                    <mu-text-field v-model="recordForm.more"></mu-text-field>
                </mu-form-item>
            </mu-form>
            <mu-button slot="actions" flat color="primary" @click="openSimple = !openSimple">取销</mu-button>
            <mu-button slot="actions" flat color="primary" @click="submitRecord">提交</mu-button>
        </mu-dialog>
        <van-search v-model="search" placeholder="请输入搜索关键词" />
        <mu-data-table
            :columns="columns"
            :sort.sync="sort"
            @sort-change="handleSortChange"
            :data="searchlist"
            border
        >
            <template slot="expand" slot-scope="prop">
                <div style="padding: 24px;">
                    <p>类型：{{prop.row.type==0?'收款':'付款'}}</p>
                    <p>备注：{{prop.row.more}}</p>
                    <p>时间：{{prop.row.time}}</p>
                    <mu-button
                        v-if="prop.row.type == 0 && prop.row.receipt == 1"
                        color="info"
                        @click="openTakeDialog(prop.row.id)"
                    >开票申请</mu-button>
                    <mu-button
                        v-if="prop.row.type == 1 && prop.row.receipt == 1"
                        color="info"
                        @click="openGetDialog(prop.row.id)"
                    >收票申请</mu-button>
                </div>
            </template>
            <template slot-scope="scope">
                <td>{{scope.row.name}}</td>
                <td class="is-center">{{scope.row.number}}</td>
                <!-- 发票状态 1：未申请 2：审核中 3：已完成 -->
                <td class="is-center">{{receiptStatus(scope.row.receipt)}}</td>
            </template>
        </mu-data-table>
        <br />
        <mu-row>
            <mu-col span="2" offset="3">
                <mu-button color="warning" @click="openStopDialog">终止合同</mu-button>
            </mu-col>
            <mu-col span="2" offset="1">
                <mu-button color="info" @click="changeContract">合同变更</mu-button>
            </mu-col>
            <mu-col span="2" offset="1">
                <mu-button color="info" @click="file" :disabled="!finish">结束归档</mu-button>
            </mu-col>
        </mu-row>

        <mu-snackbar :color="snackbar.color" :open.sync="snackbar.open" position="top">
            <mu-icon left :value="icon"></mu-icon>
            {{snackbar.message}}
            <mu-button flat slot="action" color="#fff" @click="snackbar.open = false">Close</mu-button>
        </mu-snackbar>

        <mu-dialog title="终止合同" width="360" :open.sync="openStopAlert">
            确定要终止合同吗
            <mu-text-field
                v-model="stop_reason"
                placeholder="请填写终止原因"
                multi-line
                :rows="3"
                :rows-max="6"
            ></mu-text-field>
            <br />

            <mu-button slot="actions" flat color="primary" @click="closeStopDialog">取销</mu-button>
            <mu-button slot="actions" flat color="primary" @click="stopContract">确定终止</mu-button>
        </mu-dialog>

        <mu-dialog title="开票申请" width="360" :open.sync="openTake">
            <mu-form ref="takeForm" :model="takeForm">
                <mu-form-item prop="receiptName" label="开票名称" :rules="notNullRules">
                    <mu-text-field v-model="takeForm.receiptName"></mu-text-field>
                </mu-form-item>
                <mu-form-item prop="partyB" label="对方单位" :rules="notNullRules">
                    <mu-text-field v-model="takeForm.partyB"></mu-text-field>
                </mu-form-item>
                <mu-form-item prop="amount" label="金额" :rules="notNullRules">
                    <mu-text-field type="number" v-model="takeForm.amount" suffix="元"></mu-text-field>
                </mu-form-item>
                <mu-form-item prop="notes" label="备注">
                    <mu-text-field v-model="takeForm.notes"></mu-text-field>
                </mu-form-item>
            </mu-form>
            <mu-button slot="actions" flat color="primary" @click="openTake = !openTake">取销</mu-button>
            <mu-button slot="actions" flat color="primary" @click="submitTakeReceipt">提交</mu-button>
        </mu-dialog>

        <mu-dialog title="收票申请" width="360" :open.sync="openGet">
            <mu-form ref="getForm" :model="getForm">
                <mu-form-item prop="receiptName" label="收票名称" :rules="notNullRules">
                    <mu-text-field v-model="getForm.receiptName"></mu-text-field>
                </mu-form-item>
                <mu-form-item prop="receiptCode" label="发票代码" :rules="notNullRules">
                    <mu-text-field type="number" v-model="getForm.receiptCode"></mu-text-field>
                </mu-form-item>
                <mu-form-item prop="receiptNumber" label="发票号码" :rules="notNullRules">
                    <mu-text-field type="number" v-model="getForm.receiptNumber"></mu-text-field>
                </mu-form-item>
                <mu-form-item prop="partyB" label="对方单位" :rules="notNullRules">
                    <mu-text-field v-model="getForm.partyB"></mu-text-field>
                </mu-form-item>
                <mu-form-item prop="amount" label="金额" :rules="notNullRules">
                    <mu-text-field type="number" v-model="getForm.amount" suffix="元"></mu-text-field>
                </mu-form-item>
                <mu-form-item prop="receiptDate" label="开票日期" :rules="notNullRules">
                    <mu-date-input
                        v-model="getForm.receiptDate"
                        label-float
                        full-width
                        no-display
                        value-format="YYYY-MM-DD"
                    ></mu-date-input>
                </mu-form-item>
                <mu-form-item prop="notes" label="备注">
                    <mu-text-field v-model="getForm.notes"></mu-text-field>
                </mu-form-item>
            </mu-form>
            <mu-button slot="actions" flat color="primary" @click="openGet = !openGet">取销</mu-button>
            <mu-button slot="actions" flat color="primary" @click="submitGetReceipt">提交</mu-button>
        </mu-dialog>
    </div>
</template>

<script>
import myheader from "../../components/Myheader";
import record from "../../components/executionrecord";
import Toast from "muse-ui-toast";
import qs from "qs";
export default {
    data() {
        return {
            title: "执行中的合同",
            contractData: "",
            sort: {
                name: "",
                order: "asc"
            },
            columns: [
                { title: "收付款名称", name: "name", align: "center" },
                {
                    title: "收付款金额",
                    name: "number",
                    align: "center",
                    sortable: true
                },
                { title: "发票状态", name: "receipt", align: "center" }
            ],
            list: [],

            openSimple: false,
            openStopAlert: false,
            openGet: false,
            openTake: false,
            value1: "",
            recordForm: {
                name: "",
                type: "",
                number: "",
                time: "",
                more: ""
            },
            //开发票表单
            takeForm: {
                recordId: "",
                amount: "",
                partyB: "",
                receiptName: "",
                notes: ""
            },
            //收发票表单
            getForm: {
                recordId: "",
                amount: "",
                partyB: "",
                receiptName: "",
                notes: "",
                receiptDate: "",
                receiptCode: "",
                receiptNumber: ""
            },
            notNullRules: [{ validate: val => !!val, message: "不能为空" }],
            numberError: "",
            progress: 0,
            snackbar: {
                color: "success",
                message: "Hello World, Snackbar !",
                open: false,
                timeout: 3000
            },
            finish: false,
            stop_reason: "",
            search: ""
        };
    },
    methods: {
        handleSortChange({ name, order }) {
            this.list = this.list.sort((a, b) =>
                order === "asc" ? a[name] - b[name] : b[name] - a[name]
            );
        },
        openSimpleDialog() {
            this.openSimple = true;
        },
        closeSimpleDialog() {
            this.openSimple = false;
        },
        openStopDialog() {
            this.openStopAlert = true;
        },
        closeStopDialog() {
            this.openStopAlert = false;
        },
        openTakeDialog(id) {
            this.$axios
                .get("/record", {
                    params: {
                        id: id
                    }
                })
                .then(response => {
                    this.takeForm.recordId = id;
                    this.takeForm.amount = response.data.data.number;
                    this.takeForm.partyB = this.contractData.partyB;
                    this.takeForm.receiptName = response.data.data.name;
                    this.openTake = true;
                    console.log(id);
                });
        },
        openGetDialog(id) {
            this.$axios
                .get("/record", {
                    params: {
                        id: id
                    }
                })
                .then(response => {
                    this.getForm.recordId = id;
                    this.getForm.amount = response.data.data.number;
                    this.getForm.partyB = this.contractData.partyB;
                    this.getForm.receiptName = response.data.data.name;
                    this.openGet = true;
                    console.log(id);
                });
        },
        submitTakeReceipt() {
            this.$refs.takeForm.validate().then(result => {
                if (result) {
                    this.$axios
                        .post(
                            "/receipt",
                            qs.stringify({
                                recordId: this.takeForm.recordId,
                                amount: this.takeForm.amount,
                                receiptName: this.takeForm.receiptName,
                                partyB: this.takeForm.partyB,
                                notes: this.takeForm.notes,
                                belong: this.$store.state.user.id,
                                contractId: this.contractData.id
                            })
                        )
                        .then(response => {
                            if (response.data.code == 200) {
                                let _self = this;
                                this.$options.methods.openSnackbar(
                                    _self,
                                    "success",
                                    "申请开票成功，审批中..."
                                );
                                this.openTake = false;
                                // todo
                                // 将状态改为审批中
                                // 改为刷新，试试效果
                                this.$router.go(0);
                            } else {
                                let _self = this;
                                this.$options.methods.openSnackbar(
                                    _self,
                                    "error",
                                    "申请开票失败,请重试"
                                );
                                this.openTake = false;
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            });
        },

        submitGetReceipt() {
            this.$refs.getForm.validate().then(result => {
                if (result) {
                    this.$axios
                        .post(
                            "/receipt",
                            qs.stringify({
                                recordId: this.getForm.recordId,
                                amount: this.getForm.amount,
                                receiptName: this.getForm.receiptName,
                                partyB: this.getForm.partyB,
                                notes: this.getForm.notes,
                                receiptDate: this.getForm.receiptDate,
                                receiptCode: this.getForm.receiptCode,
                                receiptNumber: this.getForm.receiptNumber,
                                belong: this.$store.state.user.id,
                                contractId: this.contractData.id
                            })
                        )
                        .then(response => {
                            if (response.data.code == 200) {
                                let _self = this;
                                this.$options.methods.openSnackbar(
                                    _self,
                                    "success",
                                    "申请收票成功，审批中..."
                                );
                                this.openGet = false;
                                // todo
                                // 将状态改为审批中
                                // 改为刷新，试试效果
                                this.$router.go(0);
                            } else {
                                let _self = this;
                                this.$options.methods.openSnackbar(
                                    _self,
                                    "error",
                                    "申请收票失败,请重试"
                                );
                                this.openGet = false;
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            });
        },

        submitRecord() {
            if (this.recordForm.number > this.contractData.remainder) {
                this.numberError = "输入金额不能大于剩余金额";
                this.$alert("输入金额不能大于剩余金额", "提示", {
                    okLabel: "知道了"
                });
            } else {
                this.$refs.form.validate().then(result => {
                    if (result) {
                        this.$axios
                            .post(
                                "/record/",
                                qs.stringify({
                                    contract_id: this.contractData.id,
                                    name: this.recordForm.name,
                                    type: this.recordForm.type,
                                    number: this.recordForm.number,
                                    time: this.recordForm.time,
                                    more: this.recordForm.more
                                })
                            )
                            .then(response => {
                                if (response.data.code == 200) {
                                    let _self = this;
                                    this.$options.methods.openSnackbar(
                                        _self,
                                        "success",
                                        "新增记录成功"
                                    );
                                    this.recordForm.receipt = 1;
                                    this.list.splice(0, 0, this.recordForm);
                                    this.contractData.remainder =
                                        this.contractData.remainder -
                                        this.recordForm.number;
                                    this.progress =
                                        100 -
                                        (this.contractData.remainder /
                                            this.contractData.total) *
                                            100;
                                    this.$options.methods.clear(_self);
                                    this.openSimple = false;
                                } else {
                                    let _self = this;
                                    this.$options.methods.openSnackbar(
                                        _self,
                                        "error",
                                        "新增记录失败"
                                    );
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                });
            }
        },
        clear(_self) {
            _self.recordForm = {
                name: "",
                type: "",
                number: "",
                time: "",
                more: ""
            };
        },
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
        changeContract() {
            this.$axios
                .get("/record/ifApproving", {
                    params: {
                        contractId: this.contractData.id
                    }
                })
                .then(response => {
                    if (response.data.data != 0) {
                        let _self = this;
                        this.$options.methods.openSnackbar(
                            _self,
                            "error",
                            "合同变更失败，存在审批中发票，请完成后重试"
                        );
                    } else {
                        this.$router.push({
                            name: "ChangeContract",
                            query: { id: this.contractData.id }
                        });
                    }
                });
        },
        file() {
            this.$axios
                .post(
                    "/contract/file",
                    qs.stringify({
                        id: this.contractData.id
                    })
                )
                .then(response => {
                    if (response.data.code == 200) {
                        let _self = this;
                        this.$options.methods.openSnackbar(
                            _self,
                            "success",
                            "合同归档成功"
                        );
                        // TODO: 跳转界面
                        this.$router.push({ path: "executingList" });
                    } else {
                        let _self = this;
                        this.$options.methods.openSnackbar(
                            _self,
                            "error",
                            "合同归档失败，请检查并重试"
                        );
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
        stopContract() {
            this.$axios
                .post(
                    "/contractChange/stop",
                    qs.stringify({
                        id: this.contractData.id,
                        reason: this.stop_reason
                    })
                )
                .then(response => {
                    if (response.data.code == 200) {
                        let _self = this;
                        this.$options.methods.openSnackbar(
                            _self,
                            "success",
                            "已提交合同终止申请"
                        );
                        // TODO: 跳转界面
                        setTimeout(function() {
                            _self.$router.replace({
                                path: "/executingList"
                            });
                        }, 1500);
                    } else {
                        let _self = this;
                        this.$options.methods.openSnackbar(
                            _self,
                            "error",
                            "提交合同终止申请失败，请检查并重试"
                        );
                    }
                    this.$options.methods.closeStopDialog();
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
        },
        receiptStatus(status) {
            if (status == 1) return "未申请";
            else if (status == 2) return "审批中";
            else return "已完成";
        }
    },

    computed: {
        icon() {
            return {
                success: "check_circle",
                info: "info",
                warning: "priority_high",
                error: "warning"
            }[this.snackbar.color];
        },

        searchlist: function() {
            var search = this.search;
            //此处的etquestions均为data, 这个etquestions.content.title是根据自己的需要写,一般写data
            if (search) {
                return this.list.filter(list => {
                    if (list.name.includes(search)) {
                        return list;
                    }
                });
            }
            return this.list;
        }
    },
    mounted() {
        this.$axios
            .get("/contract/" + this.$route.query.id)
            .then(response => {
                this.contractData = response.data.data;
                this.progress =
                    100 -
                    (this.contractData.remainder / this.contractData.total) *
                        100;
                if (this.contractData.unreceipt == 0) this.finish = true;
                if (this.contractData.type == 0) {
                    this.recordForm.type = "1";
                } else {
                    this.recordForm.type = "0";
                }
            })
            .catch(error => {
                console.log(error);
            });
        this.$axios
            .get("/record/" + this.$route.query.id)
            .then(response => {
                this.list = response.data.data;
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
</style>