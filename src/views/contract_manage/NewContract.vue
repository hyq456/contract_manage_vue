<template>
    <div class="newContract">
        <myheader :title="title"></myheader>
        <mu-form
            ref="form"
            :model="form"
            class="contract-form"
            label-position="left"
            label-width="100"
            :auto-validate="false"
        >
            <mu-form-item label="合同名称"  prop="contract_name" :rules="notNullRules">
                <mu-text-field v-model="form.contract_name"></mu-text-field>
            </mu-form-item>
            <mu-form-item label="对方公司"  prop="party_b" :rules="notNullRules">
                <mu-text-field v-model="form.party_b"></mu-text-field>
            </mu-form-item>
            <mu-form-item label="合同类型">
                <mu-select v-model="form.type" full-width>
                    <mu-option
                        v-for="option,index in options"
                        :key="option"
                        :label="option"
                        :value="index"
                    ></mu-option>
                </mu-select>
            </mu-form-item>
            <mu-form-item label="合同金额" prop="total" :rules="notNullRules">
                <mu-text-field v-model="form.total" type="number"></mu-text-field>
            </mu-form-item>
            <mu-form-item prop="start_date" label="合同开始日期" :rules="notNullRules">
                <mu-date-input
                    v-model="start_date"
                    label-float
                    full-width
                    no-display
                    value-format="YYYY-MM-DD"
                ></mu-date-input>
            </mu-form-item>
            <mu-form-item prop="stop_date" label="合同结束日期" :rules="notNullRules">
                <mu-date-input
                    v-model="stop_date"
                    label-float
                    full-width
                    no-display
                    value-format="YYYY-MM-DD"
                    :min-date="min_date"
                ></mu-date-input>
            </mu-form-item>
            <mu-form-item prop="textarea" label="合同描述" :rules="notNullRules">
                <mu-text-field multi-line :rows="3" :rows-max="6" v-model="form.textarea" :max-length="255"></mu-text-field>
            </mu-form-item>
            <mu-form-item label="合同文件" :rules="notNullRules" prop="filepath">
                <van-uploader
                    v-model="fileList"
                    upload-icon="orders-o"
                    accept=".doc, .docx, .xml, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    result-type="file"
                    :after-read="afterRead"
                    :before-delete="beforeDelete"
                    multiple
                    :deletable="false"
                    :preview-image="false"
                    :max-count="1"
                />
            </mu-form-item>
            <mu-form-item>
                <ul v-if="form.filepath">
                    <li>
                        {{form.filepath}}
                        <van-button
                            type="primary"
                            size="mini"
                            color="red"
                            @click="delfile(form.filepath)"
                        >删除</van-button>
                    </li>
                </ul>
            </mu-form-item>
           
            <mu-form-item>
                <mu-button color="primary" @click="submit">提交</mu-button>
            </mu-form-item>
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
            title: "新建合同",
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
                total: ""
            },
            start_date: "",
            stop_date: "",
            min_date,
            max_date,
            fileList: [],
            notNullRules: [{ validate: val => !!val, message: "不能为空" }],
            onlyNumberRules: [
                { validate: val => !isNaN(val), message: "请输入数字" },
                { validate: val => !!val, message: "不能为空" }
            ]
        };
    },
    methods: {
        submit() {
            if (this.min_date > this.max_date) {
                Toast.error("开始日期不能大于结束日期");
                return;
            }
            this.$refs.form.validate().then(result => {
                if (result) {
                    this.$axios
                        .post(
                            "/contract/",
                            qs.stringify({
                                id: this.form.id,
                                contract_name: this.form.contract_name,
                                party_b: this.form.party_b,
                                start_date: this.form.start_date,
                                stop_date: this.form.stop_date,
                                type: this.form.type,
                                filepath: this.form.filepath,
                                department: this.$store.state.user.department,
                                sign_people: this.$store.state.user.id,
                                total: this.form.total,
                                describe: this.form.textarea
                            })
                        )
                        .then(response => {
                            

                            if (response.data.code == 200) {
                                Toast.success("新增合同成功");

                                this.$router.replace({path: '/reviewinglist'})
                            } else {
                                Toast.error("新增合同失败");
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            });
        },
        delfile(name) {
            this.form.filepath = "";
            this.fileList = [];
            this.$axios
                .post(
                    "/contract/delfile",
                    qs.stringify({
                        id: this.form.id,
                        filepath: this.form.filepath
                    })
                )
                .then(response => {
                    

                    if (response.data.code == 200) {
                        // this.$router.replace({path: '/showInfo'})
                    } else {
                        Toast.error("失败");
                    }
                });
        },
        afterRead(file) {
            file.status = "uploading";
            file.message = "上传中...";
            let formData = new FormData();
            formData.append("file", file.file);
            this.$axios
                .post("/contract/uploadContract", formData)
                .then(response => {
                    
                    if (response.data.code == 200) {
                        file.status = "done";
                        file.message = "上传成功";
                        this.form.filepath = file.file.name;
                        this.form.id = response.data.data.id;
                    } else {
                        file.status = "failed";
                        file.message = "上传失败";
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },

        beforeDelete(file, detail) {
            this.form.filepath = "";
            return true;
        }
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
</style>