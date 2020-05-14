<template>
    <div>
        <h1>合同管理系统</h1>

        <mu-form
            ref="form"
            :model="validateForm"
            class="mu-demo-form"
            :auto-validate="autovalidate"
        >
            <mu-form-item label="用户名" help-text="请输入用户名" prop="username" :rules="usernameRules">
                <mu-text-field v-model="validateForm.username" prop="username"></mu-text-field>
            </mu-form-item>
            <mu-form-item label="密码" help-text="请输入密码" prop="password" :rules="passwordRules">
                <mu-text-field
                    v-model="validateForm.password"
                    prop="password"
                    :action-icon="visibility ? 'visibility_off' : 'visibility'"
                    :action-click="() => (visibility = !visibility)"
                    :type="visibility ? 'text' : 'password'"
                ></mu-text-field>
            </mu-form-item>

            <mu-form-item>
                <mu-button color="primary" @click="submit">登录</mu-button>
                <mu-snackbar :color="snackbar.color" :open.sync="snackbar.open" position="top">
                    <mu-icon left :value="icon"></mu-icon>
                    {{snackbar.message}}
                    <mu-button flat slot="action" color="#fff" @click="snackbar.open = false">Close</mu-button>
                </mu-snackbar>
                <mu-button @click="clear">重置</mu-button>
            </mu-form-item>
        </mu-form>
    </div>
</template>

<script>
import qs from "qs";
import Toast from "muse-ui-toast";

export default {
    data() {
        return {
            autovalidate: true,
            result: "nothing",
            usernameRules: [
                { validate: val => !!val, message: "必须填写用户名" },
                { validate: val => val.length >= 2, message: "用户名长度大于3" }
            ],
            passwordRules: [
                { validate: val => !!val, message: "必须填写密码" },
                {
                    validate: val => val.length >= 3 && val.length <= 10,
                    message: "密码长度大于3小于10"
                }
            ],

            validateForm: {
                username: "",
                password: "",
                isAgree: false
            },
            snackbar: {
                color: "success",
                message: "Hello World, Snackbar !",
                open: false,
                timeout: 3000
            },
            visibility: false
        };
    },
    methods: {
        submit() {
            this.$refs.form.validate().then(result => {
                var _this = this;
                if (result) {
                    this.$axios
                        .post(
                            "/login/auth",
                            qs.stringify({
                                username: this.validateForm.username,
                                password: this.$md5(this.validateForm.password)
                            })
                        )
                        .then(response => {
                            this.result = response.data.msg;
                            if (this.snackbar.timer)
                                clearTimeout(this.snackbar.timer);
                            this.snackbar.open = true;
                            this.snackbar.timer = setTimeout(() => {
                                this.snackbar.open = false;
                            }, this.snackbar.timeout);
                            this.snackbar.message = "验证中...";
                            this.snackbar.color = "info";
                            if (response.data.code == 200) {
                                if (this.snackbar.timer)
                                    clearTimeout(this.snackbar.timer);
                                this.snackbar.open = true;
                                this.snackbar.timer = setTimeout(() => {
                                    this.snackbar.open = false;
                                }, this.snackbar.timeout);
                                this.snackbar.message = "登陆成功";
                                this.snackbar.color = "success";

                                sessionStorage.setItem(
                                    "user",
                                    qs.stringify(response.data.user)
                                );
                                sessionStorage.setItem(
                                    "token",
                                    response.data.token
                                );
                                var userInfo = response.data.user;
                                this.$store.commit("set_user", userInfo);
                                setTimeout(function() {
                                    _this.$router.replace({
                                        path: "/index"
                                    });
                                }, 1000);
                            } else {
                                if (this.snackbar.timer)
                                    clearTimeout(this.snackbar.timer);
                                this.snackbar.open = true;
                                this.snackbar.timer = setTimeout(() => {
                                    this.snackbar.open = false;
                                }, this.snackbar.timeout);
                                this.snackbar.message = response.data.msg;
                                this.snackbar.color = "error";
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            });
        },

        clear() {
            this.$refs.form.clear();
            this.validateForm = {
                username: "",
                password: "",
                isAgree: false
            };
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
        }
    }
};
</script>

<style scoped>
@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic";
@import "http://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.css";
</style>