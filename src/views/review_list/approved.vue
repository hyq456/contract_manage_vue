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
            <mu-list-item>
                <mu-list-item-title>审批结果：{{reviewData.pass==1?"通过":"退回"}}</mu-list-item-title>
            </mu-list-item>
            <mu-divider shallow-inset></mu-divider>
        </mu-list>

        <span class="describe">审批意见：</span>
        <mu-text-field disabled :solo=true multi-line :rows="1" :rows-max="6" v-model="reviewData.reviewComment"></mu-text-field>
        <mu-list textline="two-line">
            <mu-divider shallow-inset></mu-divider>
            <mu-list-item>
                <mu-list-item-title>审批日期：{{reviewData.reviewTime}}</mu-list-item-title>
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
            title: "已审批",
            contractData: "",
            userData: "",
            reviewComment: "",
            reviewData:'',
            
        };
    },
    methods:{
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
        
    },
    mounted() {
        this.$axios
            .get("/review/approved/" + this.$route.query.id)
            .then(response => {
                
                this.contractData = response.data.data.contract;
                this.reviewData = response.data.data.review;
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