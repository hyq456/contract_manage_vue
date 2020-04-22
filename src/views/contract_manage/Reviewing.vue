<template>
    <div>
        <myheader :title="title"></myheader>
        <mu-list>
            <mu-list-item>
                <mu-list-item-title>合同名称：{{contractData.name}}</mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
            <mu-list-item>
                <mu-list-item-title>乙方名称：{{contractData.partyB}}</mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
            <mu-list-item>
                <mu-list-item-title>合同金额：{{contractData.total}}元</mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
        </mu-list>
        <mu-stepper :active-step="vactiveStep" orientation="vertical" :linear="false">
            <mu-step :completed="finishs[0] !== -1">
                <mu-step-button @click="changeStep(0)">
                    <!-- <mu-step-label> -->
                    部门负责人
                </mu-step-button>
                <!-- </mu-step-label> -->
                <mu-step-content v-if="reviewData[0]">
                    <p><mu-icon
                        slot="icon"
                        value="warning"
                        color="red"
                        v-if="reviewData[0]&&!reviewData[0].pass"
                    ></mu-icon>{{reviewData[0].reviewComment}}</p>
                    <p>{{reviewData[0].reviewTime}}</p>
                </mu-step-content>
                <mu-step-content v-if="!reviewData[0]">
                    <p>审批中...</p>
                </mu-step-content>
            </mu-step>
            <mu-step :completed="finishs[1] !== -1">
                <!-- <mu-step-label> -->
                <mu-step-button @click="changeStep(1)">
                    法务部
                </mu-step-button>
                <!-- </mu-step-label> -->

                <mu-step-content v-if="reviewData[1]">
                    <p><mu-icon
                        slot="icon"
                        value="warning"
                        color="red"
                        v-if="reviewData[1]&&!reviewData[1].pass"
                    ></mu-icon>{{reviewData[1].reviewComment}}</p>
                    <p>{{reviewData[1].reviewTime}}</p>
                </mu-step-content>
                <mu-step-content v-if="!reviewData[1]">
                    <p>审批中...</p>
                </mu-step-content>
            </mu-step>
            <mu-step :completed="finishs[2] !== -1">
                <!-- <mu-step-label> -->
                <!-- <mu-icon
                    slot="icon"
                    value="warning"
                    color="red"
                    v-if="reviewData[2]&&!reviewData[2].pass"
                ></mu-icon> -->
                <mu-step-button @click="changeStep(2)">
                    <mu-icon
                        slot="icon"
                        value="warning"
                        color="red"
                        v-if="reviewData[2]&&!reviewData[2].pass"
                    ></mu-icon>财务部
                </mu-step-button>
                <!-- </mu-step-label> -->

                <mu-step-content v-if="reviewData[2]">
                    <p>
                        <mu-icon
                            slot="icon"
                            value="warning"
                            color="red"
                            v-if="reviewData[2]&&!reviewData[2].pass"
                        ></mu-icon>
                        {{reviewData[2].reviewComment}}
                    </p>
                    <p>{{reviewData[2].reviewTime}}</p>
                </mu-step-content>
                <mu-step-content v-if="!reviewData[2]">
                    <p>审批中...</p>
                </mu-step-content>
            </mu-step>
        </mu-stepper>

        <!-- <mu-divider shallow-inset></mu-divider> -->
        <mu-flex justify-content="end">
            <mu-button :disabled="disabled" ripple @click="gomodify(contractData.id)">修改合同</mu-button>
            <mu-button @click="openAlertDialog" ripple>撤销合同</mu-button>
        </mu-flex>
        <mu-dialog
            title="撤销合同"
            width="600"
            max-width="80%"
            :esc-press-close="false"
            :overlay-close="false"
            :open.sync="openAlert"
        >
            合同一旦撤销，无法恢复，确定吗
            <mu-button slot="actions" flat color="primary" @click="closeAlertDialog">取销</mu-button>
            <mu-button slot="actions" flat color="primary" @click="cancelContract">确定</mu-button>
        </mu-dialog>
    </div>
</template>

<script>
import myheader from "../../components/Myheader";
import Toast from "muse-ui-toast";
import qs from "qs";
export default {
    data() {
        return {
            title: "审批中的合同",
            contractData: "",
            vactiveStep: 0,
            reviewData: [],
            openAlert: false,
            disabled: true,
            finishs: [-1, -1, -1]
        };
    },

    mounted() {
        this.$axios
            .get("/contract/" + this.$route.query.id)
            .then(response => {
                
                this.contractData = response.data.data;
                if (this.contractData.contractState == 0) {
                    this.disabled = false;
                }
            })
            .catch(error => {
                console.log(error);
            });
        this.$axios
            .get("/review/" + this.$route.query.id)
            .then(response => {
                
                this.reviewData = response.data.data;
                this.vactiveStep = this.reviewData.length;
                let isfail = this.reviewData.some(function(item, index) {
                    return item.pass == false;
                });
                if (isfail) this.vactiveStep = this.vactiveStep - 1;
                for (var i = 0; i < this.vactiveStep; i++) {
                    this.finishs[i] = 0;
                }
            })
            .catch(error => {
                console.log(error);
            });
    },
    methods: {
        changeStep(index) {
            this.vactiveStep = index;
        },
        openAlertDialog() {
            this.openAlert = true;
        },
        closeAlertDialog() {
            this.openAlert = false;
        },
        gomodify(id) {
            this.$router.push({ name: "ModifyContract", query: { id: id } });
        },
        cancelContract() {
            this.$axios
                .delete("/contract/" + this.$route.query.id)
                .then(response => {
                    
                    Toast.success("撤销合同成功");
                    this.$router.replace({ path: "/reviewinglist" });
                })
                .catch(error => {
                    console.log(error);
                });
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