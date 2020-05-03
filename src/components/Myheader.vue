<template>
    <div class="header">
        <mu-appbar style="width: 100%;" color="primary">
            <mu-button icon slot="left" @click="draweropen = !draweropen">
                <mu-icon value="menu"></mu-icon>
            </mu-button>
            {{title}}
            <mu-button ref="button" fab small slot="right" @click="open2 = !open2">
                <!-- <mu-icon value="notifications"></mu-icon> -->
                <mu-avatar color="teal">{{this.$store.state.user.realname[0]}}</mu-avatar>
            </mu-button>
            <mu-popover :open.sync="open2" :trigger="trigger" placement="bottom-end" slot="right">
                <mu-list>
                    <mu-list-item button to="userinfo">
                        <mu-list-item-action>
                            <mu-icon value="perm_identity"></mu-icon>
                        </mu-list-item-action>
                        <mu-list-item-title>个人中心</mu-list-item-title>
                    </mu-list-item>

                    <mu-list-item button @click="logout">
                        <mu-list-item-action>
                            <mu-icon value="power_settings_new"></mu-icon>
                        </mu-list-item-action>
                        <mu-list-item-title>Sign out</mu-list-item-title>
                    </mu-list-item>
                </mu-list>
            </mu-popover>
        </mu-appbar>

        <mu-drawer :open.sync="draweropen" :docked="docked" :right="position === 'right'">
            <mu-list toggle-nested>
                <!-- v-if="this.$store.state.user.role == 1" -->
                <mu-list-item button :to="{name:'Index'}">
                    <mu-list-item-action>
                        <mu-icon value="home"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item-title>首页</mu-list-item-title>
                </mu-list-item>
                <mu-list-item
                    button
                    :ripple="false"
                    nested
                    :open="open === 'template'"
                    @toggle-nested="open = arguments[0] ? 'template' : ''"
                >
                    <mu-list-item-action>
                        <mu-icon value="description"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item-title>合同模板</mu-list-item-title>
                    <mu-list-item-action>
                        <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item button :ripple="false" slot="nested" to="templatedownload">
                        <mu-list-item-title>模板下载</mu-list-item-title>
                    </mu-list-item>
                    <mu-list-item button :ripple="false" slot="nested" to="templatemanage" v-if="this.$store.state.user.department == 2">
                        <mu-list-item-title>模板管理</mu-list-item-title>
                    </mu-list-item>
                </mu-list-item>
                <mu-list-item
                    button
                    :ripple="false"
                    nested
                    :open="open === 'manage'"
                    @toggle-nested="open = arguments[0] ? 'manage' : ''"
                >
                    <mu-list-item-action>
                        <mu-icon value="chrome_reader_mode"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item-title>合同管理</mu-list-item-title>
                    <mu-list-item-action>
                        <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item button :ripple="false" slot="nested" to="newcontract">
                        <mu-list-item-title>新增合同</mu-list-item-title>
                    </mu-list-item>
                    <mu-list-item button :ripple="false" slot="nested" :to="{name:'ReviewingList'}">
                        <mu-list-item-title>审核中合同</mu-list-item-title>
                    </mu-list-item>
                    <mu-list-item button :ripple="false" slot="nested" :to="{name:'ExecutingList'}">
                        <mu-list-item-title>执行中合同</mu-list-item-title>
                    </mu-list-item>
                </mu-list-item>
                <mu-list-item
                    button
                    :ripple="false"
                    nested
                    :open="open === 'approval'"
                    @toggle-nested="open = arguments[0] ? 'approval' : ''"
                    v-if="this.$store.state.user.role == 2||this.$store.state.user.department == 1 || this.$store.state.user.department == 2"
                >
                    <mu-list-item-action>
                        <mu-icon value="check_box"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item-title>审批列表</mu-list-item-title>
                    <mu-list-item-action>
                        <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item
                        button
                        :ripple="false"
                        slot="nested"
                        :to="{name:'WaitReviewList'}"
                    >
                        <mu-list-item-title>待审批</mu-list-item-title>
                    </mu-list-item>
                    <mu-list-item button :ripple="false" slot="nested" :to="{name:'ApprovedList'}">
                        <mu-list-item-title>已审批</mu-list-item-title>
                    </mu-list-item>
                </mu-list-item>

                <mu-list-item
                    button
                    :ripple="false"
                    nested
                    :open="open === 'receipt'"
                    @toggle-nested="open = arguments[0] ? 'receipt' : ''"
                >
                    <mu-list-item-action>
                        <mu-icon value="check_box"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item-title>发票管理</mu-list-item-title>
                    <mu-list-item-action>
                        <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item
                        button
                        :ripple="false"
                        slot="nested"
                        :to="{name:'MyReceipt'}"
                    >
                        <mu-list-item-title>我的发票</mu-list-item-title>
                    </mu-list-item>
                    <mu-list-item button :ripple="false" slot="nested" :to="{name:'ApprovedList'}">
                        <mu-list-item-title>待审批</mu-list-item-title>
                    </mu-list-item>
                    <mu-list-item button :ripple="false" slot="nested" :to="{name:'ApprovedList'}">
                        <mu-list-item-title>已审批</mu-list-item-title>
                    </mu-list-item>
                </mu-list-item>

                <mu-list-item button :to="{name:'FiledList'}">
                    <mu-list-item-action>
                        <mu-icon value="folder"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item-title>归档合同</mu-list-item-title>
                </mu-list-item>
            </mu-list>
        </mu-drawer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            draweropen: false,
            docked: false,
            open: "template",
            position: "left",
            menuopen: false,
            open2: false,
            trigger: null
        };
    },
    methods:{
      logout(){
           this.$axios
            .get("/login/logout")
            .then(response => {
                sessionStorage.clear();
                this.$router.replace({
                                    path: "/login"
                                })
            })
            .catch(error => {
                console.log(error);
            });

      }  
    },
    props: {
        title: {
            type: String,
            default: ""
        }
    },
    mounted() {
        this.trigger = this.$refs.button.$el;
    }
};
</script>

<style scoped>
@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic";
@import "http://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.css";
a {
    color: black;
}
</style>