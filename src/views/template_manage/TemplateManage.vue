<template>
    <div>
        <myheader :title="title"></myheader>
        <!-- </br> -->
        <br />
        <mu-container>
            <mu-flex justify-content="center">
                <!-- <myheader :title="title"></myheader> -->
                <mu-grid-list class="gridlist-demo">
                    <mu-sub-header>
                        <van-uploader
                            :after-read="afterRead"
                            accept=".doc, .docx, .xml, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            result-type="file"
                        >
                            <van-button
                                plain
                                icon="plus"
                                color="#2196f3"
                                :loading="loading"
                                :loading-text="loadingText"
                            >新增模板</van-button>
                        </van-uploader>
                    </mu-sub-header>
                    <mu-grid-tile v-for="template,index in templateData" :key="index">
                        <img :src="picurl(template.picpath)" />

                        <span slot="title">{{template.name}}</span>

                        <mu-button slot="action" icon @click="del(template.path)">
                            <mu-icon value="delete_forever"></mu-icon>
                        </mu-button>
                    </mu-grid-tile>
                </mu-grid-list>
            </mu-flex>
        </mu-container>
        <mu-snackbar :position="normal.position" :open.sync="normal.open" :color="normal.color">
            {{normal.message}}
            <mu-button flat slot="action" color="#fff" @click="normal.open = false">Close</mu-button>
        </mu-snackbar>
    </div>
</template>

<script>
import myheader from "../../components/Myheader";
import qs from "qs";
export default {
    data() {
        return {
            title: "模板管理",
            templateData: [],
            loading: false,
            loadingText: "上传中...",
            normal: {
                position: "top",
                message: "Hello World, Snackbar !",
                open: false,
                timeout: 3000,
                color:"success",
            }
        };
    },
    methods: {
        picurl(path) {
            return (
                "http://" +
                this.GLOBAL.baseURL +
                ":" +
                this.GLOBAL.post +
                "/" +
                path
            );
        },
        afterRead(file) {
            this.loading = true;
            let formData = new FormData();
            formData.append("file", file.file);
            formData.append("id", this.$store.state.user.id);
            this.$axios
                .post("/template", formData)
                .then(response => {
                    
                    if (response.data.code == 200) {
                        this.loading = false;
                        var _self = this;
                        this.$options.methods.getData(_self);
                        this.$options.methods.openNormalSnackbar(_self,response.data.message)

                    } else {
                        var _self = this;
                        this.$options.methods.openNormalSnackbar(_self,"保存模板失败")
                        this.loading = true
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
        del(file) {
            this.$axios.delete("/template", {
                    params: {
                        path: file
                    }
                })
                .then(response => {
                    var _self = this;
                    this.$options.methods.getData(_self);
                    this.$options.methods.openNormalSnackbar(_self,response.data.message)
                });
            
        },
        getData(_self) {
            _self.$axios.get("/template").then(response => {
                _self.templateData = response.data.data;
            });
        },
        openNormalSnackbar(_self, msg) {
            if (_self.normal.timer) clearTimeout(_self.normal.timer);
            _self.normal.message = msg;
            _self.normal.open = true;
            _self.normal.timer = setTimeout(() => {
                _self.normal.open = false;
            }, _self.normal.timeout);
        }
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
    /* height: 450px; */
    overflow-y: auto;
}
.mu-grid-tile > img {
    left: 37%;
}
@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic";
@import "http://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.css";
</style>>
