<template>
    <div class="userinfo">
        <myheader :title="title"></myheader>
        <mu-container>
            <mu-form ref="form" :model="userInfo" label-position="left" label-width="100">
                <mu-form-item label="姓名">
                    <mu-text-field v-model="userInfo.realname" disabled></mu-text-field>
                </mu-form-item>
                <mu-form-item label="用户名">
                    <mu-text-field v-model="userInfo.username" disabled></mu-text-field>
                </mu-form-item>
                <mu-form-item label="电话">
                    <mu-text-field v-model="userInfo.tel" type="number"></mu-text-field>
                </mu-form-item>
                <mu-form-item label="邮箱" prop="email" :rules="mailRules">
                    <mu-text-field v-model="userInfo.email"></mu-text-field>
                </mu-form-item>
                <mu-form-item label="新密码" >
                    <mu-text-field v-model="userInfo.newPw" :action-icon="visibility ? 'visibility_off' : 'visibility'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'"></mu-text-field>
                </mu-form-item>
                <mu-form-item label="确认密码" prop="confirmPw" :rules="passwordRules" >
                    <mu-text-field v-model="userInfo.confirmPw" :action-icon="visibility2 ? 'visibility_off' : 'visibility'" :action-click="() => (visibility2 = !visibility2)" :type="visibility2 ? 'text' : 'password'"></mu-text-field>
                </mu-form-item>
                
                <mu-form-item>
                    <mu-button color="primary" @click="submit" >保存</mu-button>
                </mu-form-item>
            </mu-form>
        </mu-container>

        <mu-snackbar :position="normal.position" :open.sync="normal.open" :color="normal.color">
            {{normal.message}}
            <mu-button flat slot="action" color="#fff" @click="normal.open = false">Close</mu-button>
        </mu-snackbar>
    </div>
</template>

<script>
import myheader from "@/components/Myheader";
import qs from "qs";
const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
export default {
    data() {
        return {
            title: "个人中心",
            userInfo: {
                realname:'',
                usernme:'',
                tel:'',
                email:'',
                newPw:'',
                confirmPw:'',
            },
            normal: {
                position: "top",
                message: "Hello World, Snackbar !",
                open: false,
                timeout: 3000,
                color: "success"
            },
            visibility: false,
            visibility2: false,

            mailRules: [
                { validate: (val) => !!val, message: '必须填写邮箱'},
                { validate: (val) => mailReg.test(val), message: '邮箱格式不正确'}
            ],
            passwordRules:[
                { validate: (val) => val==this.userInfo.newPw, message: '两次输入密码不一致，请重试!'},
                
            ],
        };
    },
    methods: {
        submit(){
            this.$refs.form.validate().then((result) => {
                if(result){
                    var par = "";
                    if(!!this.userInfo.newPw){
                        par = qs.stringify({
                            id:this.$store.state.user.id,
                            tel: this.userInfo.tel,
                            email: this.userInfo.email,
                            newPw: this.$md5(this.userInfo.newPw),
                        })
                    }
                    else{
                        par = qs.stringify({
                            id:this.$store.state.user.id,
                            tel: this.userInfo.tel,
                            email: this.userInfo.email,
                        })
                    }
                    this.$axios.post("/user/",par)
                    .then(result => {
                        if(result.data.code == 200){
                            var _self = this;
                            this.$options.methods.openNormalSnackbar(_self,result.data.message)
                        }
                        else{
                            var _self = this;
                            this.normal.color = error;
                            this.$options.methods.openNormalSnackbar(_self,result.data.message)
                        }
                    })
                }
                
            });
        },
        openNormalSnackbar(_self, msg) {
            if (_self.normal.timer) clearTimeout(_self.normal.timer);
            _self.normal.message = msg;
            _self.normal.open = true;
            _self.normal.timer = setTimeout(() => {
                _self.normal.open = false;
            }, _self.normal.timeout);
        },
        clearPwError(){
            this.pwErrorText = "";
        }
    },
    mounted() {
        this.$axios
            .get("/user", {
                params: {
                    id: this.$store.state.user.id
                }
            })
            .then(response => {
                
                this.userInfo.realname = response.data.data.realname;
                this.userInfo.username = response.data.data.username;
                this.userInfo.tel = response.data.data.tel;
                this.userInfo.email = response.data.data.email;
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

<style>
</style>