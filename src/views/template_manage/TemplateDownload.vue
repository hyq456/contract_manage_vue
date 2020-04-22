<template>
    <div>
        <myheader :title="title"></myheader>
        <h3
            v-if="templateData.length == 0"
            style="text-align: center;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);"
        >暂无合同模板！</h3>
        <mu-container>
            <mu-flex justify-content="center">
                <!-- <myheader :title="title"></myheader> -->
                <mu-grid-list class="gridlist-demo">
                    <mu-sub-header></mu-sub-header>

                    <mu-grid-tile v-for="template,index in templateData" :key="index">
                        <img :src= picurl(template.picpath)>

                        <span slot="title">{{template.name}}</span>
                        
                        <mu-button slot="action" icon @click="download(template.path)">
                            <mu-icon value="get_app"></mu-icon>
                        </mu-button>
                    </mu-grid-tile>
                    
                </mu-grid-list>
            </mu-flex>
        </mu-container>
    </div>
</template>

<script>
import myheader from "../../components/Myheader";
import qs from "qs";
export default {
    data() {
        return {
            title: "模板下载",
            templateData: []
        };
    },
    methods:{
        picurl(path){
            return "http://"+this.GLOBAL.baseURL+":"+this.GLOBAL.post+"/"+path
        },
        download(file){
            this.$axios
                .get("/template/download", {
                    responseType: "arraybuffer",
                    params: {
                        path: file,
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
            .get("/template")
            .then(response => {
                
                this.templateData = response.data.data;
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
.gridlist-demo {
    width: 360px;
    height: 450px;
    overflow-y: auto;
}
.mu-grid-tile > img {
    left: 37%;
}
@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic";
@import "http://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.css";
</style>>
