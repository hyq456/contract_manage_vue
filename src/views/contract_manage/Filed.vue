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
        </mu-list>
        <mu-linear-progress :value="progress" mode="determinate"></mu-linear-progress>
        <h3>履行记录</h3>

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
                </div>
            </template>
            <template slot-scope="scope">
                <td>{{scope.row.name}}</td>
                <td class="is-center">{{scope.row.number}}</td>
                <td class="is-center">{{scope.row.time}}</td>
            </template>
        </mu-data-table>
    </div>
</template>

<script>
import myheader from "../../components/Myheader";
import Toast from "muse-ui-toast";
import qs from "qs";
export default {
    data() {
        return {
            title: "已归档的合同",
            contractData: "",
            sort: {
                name: "",
                order: "asc"
            },
            columns: [
                { title: "收付款名称", name: "name" },
                {
                    title: "收付款金额",
                    name: "number",
                    align: "center",
                    sortable: true
                },
                {
                    title: "日期",
                    name: "time",
                    align: "center",
                    cellAlign: "center"
                }
            ],
            list: [],

            value1: "",
            progress: 0,
            search: ""
        };
    },
    methods: {
        handleSortChange({ name, order }) {
            this.list = this.list.sort((a, b) =>
                order === "asc" ? a[name] - b[name] : b[name] - a[name]
            );
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
        }
    },

    computed: {
        searchlist: function() {
            var search = this.search;
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
                this.title = this.contractData.name;
                this.progress =
                    100 -
                    (this.contractData.remainder / this.contractData.total) *
                        100;
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