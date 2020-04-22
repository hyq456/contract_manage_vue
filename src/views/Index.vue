<template>
    <div class="index">
        <myheader :title="title"></myheader>
        <mu-container>
            <div style="text-align: left;margin: 0rem 1rem;font-size: 0.9rem">
                <h2>{{$store.state.user.realname}},祝你开心每一天</h2>
            </div>
            <mu-paper class="demo-paper" :z-depth="2">
                <div class="title">
                    <h3>当前审批中合同：</h3>
                </div>
                <div class="number">{{approving}}</div>
            </mu-paper>
            <mu-paper
                class="demo-paper"
                :z-depth="2"
                v-if="this.$store.state.user.role == 2||this.$store.state.user.department == 1 || this.$store.state.user.department == 2"
            >
                <div class="title">
                    <h3>待审批合同：</h3>
                </div>
                <div class="number">{{waitApprove}}</div>
            </mu-paper>

            <mu-paper class="demo-paper" :z-depth="2">
                <div class="title">
                    <h3>执行中合同：</h3>
                </div>
                <div class="number">{{execute}}</div>
            </mu-paper>
            <mu-paper class="demo-paper" :z-depth="2">
                <div class="title">
                    <h3>临到期合同(10天内)：</h3>
                </div>
                <div class="number">{{expire.expireNum}}</div>
                <mu-divider></mu-divider>

                <div v-for="e,index in expire.expireData" :key="index" class="subtitle">
                    {{e.name}}:{{e.days}}天
                </div>
            </mu-paper>

            <mu-paper class="demo-paper" :z-depth="2">
                <div class="title">
                    <h3>待收销售额：</h3>
                </div>
                <div class="number">{{sales.todo|NumFormat}}</div>
                <div style="text-align: left">
                    <span class="subtitle">已收销售额：</span>
                    <span class="number2">{{sales.done|NumFormat}}</span>
                </div>
                <div class="progress">
                    <mu-linear-progress mode="determinate" :value="sales.progress" :size="10"></mu-linear-progress>
                </div>
                <mu-divider></mu-divider>
                <div class="subtitle">总销售额：{{sales.total|NumFormat}}</div>
            </mu-paper>

            <mu-paper class="demo-paper" :z-depth="2">
                <div class="title">
                    <h3>待付采购款：</h3>
                </div>
                <div class="number">{{purchase.todo|NumFormat}}</div>
                <div style="text-align: left">
                    <span class="subtitle">已付采购款：</span>
                    <span class="number2">{{purchase.done|NumFormat}}</span>
                </div>
                <div class="progress">
                    <mu-linear-progress mode="determinate" :value="purchase.progress" :size="10"></mu-linear-progress>
                </div>
                <mu-divider></mu-divider>
                <div class="subtitle">总采购款：{{purchase.total|NumFormat}}</div>
            </mu-paper>

            <mu-paper class="demo-paper" :z-depth="2">
                <mu-tabs :value.sync="active" inverse indicator-color="blue">
                    <mu-tab>销售额</mu-tab>
                    <mu-tab>采购额</mu-tab>
                </mu-tabs>
                <div class="hello" v-if="active === 0">
                    <v-chart ref="barchart" :options="monthSaleBar" auto-resize></v-chart>
                </div>
                <div class="hello" v-if="active === 1">
                    <v-chart ref="barchart" :options="monthPurchaseBar" :auto-resize="true"></v-chart>
                </div>
            </mu-paper>

            <mu-paper class="demo-paper" :z-depth="2">
                <div class="title">
                    <h3>销售相关数据</h3>
                </div>
                <mu-tabs :value.sync="saleChartSelect" inverse indicator-color="blue">
                    <mu-tab>销售额</mu-tab>
                    <mu-tab>待收帐款</mu-tab>
                </mu-tabs>
                <div class="hello" v-if="saleChartSelect === 0">
                    <v-chart ref="piechart" :options="saleChart" auto-resize theme="light"></v-chart>
                </div>
                <div class="hello" v-if="saleChartSelect === 1">
                    <v-chart ref="piechart" :options="saleChartTodo" auto-resize></v-chart>
                </div>
            </mu-paper>

            <mu-paper class="demo-paper" :z-depth="2">
                <div class="title">
                    <h3>采购相关数据</h3>
                </div>
                <mu-tabs :value.sync="purchaseChartSelect" inverse indicator-color="blue">
                    <mu-tab>采购款</mu-tab>
                    <mu-tab>代付帐款</mu-tab>
                </mu-tabs>
                <div class="hello" v-if="purchaseChartSelect === 0">
                    <v-chart ref="piechart" :options="purchaseChart" auto-resize theme="light"></v-chart>
                </div>
                <div class="hello" v-if="purchaseChartSelect === 1">
                    <v-chart ref="piechart" :options="purchaseChartTodo" auto-resize></v-chart>
                </div>
            </mu-paper>
        </mu-container>
    </div>
</template>

<script>
import qs from "qs";
import myheader from "../components/Myheader";
export default {
    data() {
        return {
            title: "首页",
            expend1: true,
            active: 0,
            saleChartSelect: 0,
            purchaseChartSelect: 0,
            orgOptions: {},
            options1: {},
            //审批中
            approving: 0,
            //待审批
            waitApprove: 0,
            //执行中
            execute: 0,
            //销售额
            sales: {
                total: 0,
                todo: 0,
                done: 0,
                progress: 0
            },
            //采购额
            purchase: {
                total: 0,
                todo: 0,
                done: 0,
                progress: 0
            },
            //销售图表
            saleChart: {},
            saleChartTodo: {},
            //采购图表
            purchaseChart: {},
            purchaseChartTodo: {},
            //每月销售额
            monthSale: {},
            monthSaleBar: {},
            //每月采购额
            monthPurchase: {},
            monthPurchaseBar: {},
            //临到期
            expire:{},
        };
    },
    methods: {
        resizeTheChart() {
            if (this.$refs && this.$refs.piechart) {
                this.$refs.piechart.resize();
            }
            if (this.$refs && this.$refs.barchart) {
                this.$refs.barchart.resize();
            }
        }
    },
    mounted() {
        //获取合同数信息
        this.$axios
            .get("/contract/contractnumber", {
                params: {
                    userId: this.$store.state.user.id
                }
            })
            .then(response => {
                this.approving = response.data.data.approving;
                this.waitApprove = response.data.data.waitApprove;
                this.execute = response.data.data.execute;
            })
            .catch(error => {
                console.log(error);
            });
            //获取临到期合同
        this.$axios
            .get("/contract/expire", {
                params: {
                    userId: this.$store.state.user.id
                }
            })
            .then(response => {
                this.expire = response.data.data
            })
            .catch(error => {
                console.log(error);
            });
        //获取销售额相关信息
        var myDate = new Date();
        var tYear = myDate.getFullYear();

        this.$axios
            .get("/record/getMonthRecord", {
                params: {
                    toyear: tYear,
                    id: this.$store.state.user.id
                }
            })
            .then(response => {
                this.monthSale = response.data.data.monthSale;
                this.monthPurchase = response.data.data.monthPurchase;
                this.monthSaleBar = {
                    xAxis: {
                        type: "category",
                        // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                        data: [
                            "一月",
                            "二月",
                            "三月",
                            "四月",
                            "五月",
                            "六月",
                            "七月",
                            "八月",
                            "九月",
                            "十月",
                            "十一月",
                            "十二月"
                        ]
                    },
                    yAxis: {
                        type: "value",
                        name: "销售额(元)",
                        axisLabel: {
                            formatter: function(value, index) {
                                if (value >= 10000 && value < 10000000) {
                                    value = value / 10000 + "万";
                                } else if (value >= 10000000) {
                                    value = value / 10000000 + "千万";
                                }
                                return value;
                            }
                        }
                    },
                    grid: {
                        left: 50
                    },
                    series: [
                        {
                            data: this.monthSale,
                            type: "bar",
                            itemStyle: {
                                color: "#2196F3"
                            }
                        }
                    ]
                };
                this.monthPurchaseBar = {
                    xAxis: {
                        type: "category",
                        // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                        data: [
                            "一月",
                            "二月",
                            "三月",
                            "四月",
                            "五月",
                            "六月",
                            "七月",
                            "八月",
                            "九月",
                            "十月",
                            "十一月",
                            "十二月"
                        ]
                    },
                    yAxis: {
                        type: "value",
                        name: "采购额(元)",
                        axisLabel: {
                            formatter: function(value, index) {
                                if (value >= 10000 && value < 10000000) {
                                    value = value / 10000 + "万";
                                } else if (value >= 10000000) {
                                    value = value / 10000000 + "千万";
                                }
                                return value;
                            }
                        }
                    },
                    grid: {
                        left: 50
                    },
                    series: [
                        {
                            data: this.monthPurchase,
                            type: "bar",
                            itemStyle: {
                                color: "#2196F3"
                            }
                        }
                    ]
                };
            })
            .catch(error => {
                console.log(error);
            });

        // 销售饼图
        this.$axios
            .get("/contract/saleData", {
                params: {
                    userId: this.$store.state.user.id
                }
            })
            .then(response => {
                this.sales.total = response.data.data.total;
                this.sales.todo = response.data.data.todo;
                this.sales.done = this.sales.total - this.sales.todo;
                this.sales.progress =
                    100 - (this.sales.todo / this.sales.total) * 100;

                //图
                this.saleChart = {
                    tooltip: {
                        show: true,
                        trigger: "item",
                        formatter: "{a} <br/>{b}: {c}元 ({d}%)",
                        confine: true
                    },
                    graphic: {
                        type: "group",
                        top: "middle",
                        left: "center",
                        height: 80,
                        children: [
                            {
                                type: "text",
                                left: "center",
                                top: "30%",
                                style: {
                                    text: "总销售额",
                                    textAlign: "center",
                                    textVerticaAlign: "middle",
                                    fill: "#999",
                                    font: "15px 'Helvetica',sans-serif"
                                }
                            },
                            {
                                type: "text",
                                top: "60%",
                                left: "center",
                                position: [0, 10],
                                style: {
                                    text: this.sales.total,
                                    textAlign: "center",
                                    textVerticaAlign: "middle",
                                    fill: "#3d383a",
                                    font: "22px 'Helvetica',sans-serif"
                                }
                            }
                        ]
                    },
                    series: [
                        {
                            name: "销售额",
                            type: "pie",
                            radius: ["40%", "60%"],
                            avoidLabelOverlap: true,
                            label: {
                                show: true,
                                position: "outside"
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: "30",
                                    fontWeight: "bold"
                                }
                            },
                            labelLine: {
                                show: true
                            },
                            data: response.data.data.totalList
                        }
                    ]
                };
                //待收账款图
                this.saleChartTodo = {
                    tooltip: {
                        show: true,
                        trigger: "item",
                        formatter: "{a} <br/>{b}: {c}元 ({d}%)",
                        confine: true
                    },
                    graphic: {
                        type: "group",
                        top: "middle",
                        left: "center",
                        height: 80,
                        children: [
                            {
                                type: "text",
                                left: "center",
                                top: "30%",
                                style: {
                                    text: "总待收款",
                                    textAlign: "center",
                                    textVerticaAlign: "middle",
                                    fill: "#999",
                                    font: "15px 'Helvetica',sans-serif"
                                }
                            },
                            {
                                type: "text",
                                top: "60%",
                                left: "center",
                                position: [0, 10],
                                style: {
                                    text: this.sales.todo,
                                    textAlign: "center",
                                    textVerticaAlign: "middle",
                                    fill: "#3d383a",
                                    font: "22px 'Helvetica',sans-serif"
                                }
                            }
                        ]
                    },
                    series: [
                        {
                            name: "待收账款",
                            type: "pie",
                            radius: ["40%", "60%"],
                            avoidLabelOverlap: true,
                            label: {
                                show: true,
                                position: "outside"
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: "30",
                                    fontWeight: "bold"
                                }
                            },
                            labelLine: {
                                show: true
                            },
                            data: response.data.data.todoList
                        }
                    ]
                };
            })
            .catch(error => {
                console.log(error);
            });

        //采购饼图
        this.$axios
            .get("/contract/purchaseData", {
                params: {
                    userId: this.$store.state.user.id
                }
            })
            .then(response => {
                this.purchase.total = response.data.data.total;
                this.purchase.todo = response.data.data.todo;
                this.purchase.done = this.purchase.total - this.purchase.todo;
                this.purchase.progress =
                    100 - (this.purchase.todo / this.purchase.total) * 100;

                //图
                this.purchaseChart = {
                    tooltip: {
                        show: true,
                        trigger: "item",
                        formatter: "{a} <br/>{b}: {c}元 ({d}%)",
                        confine: true
                    },
                    graphic: {
                        type: "group",
                        top: "middle",
                        left: "center",
                        height: 80,
                        children: [
                            {
                                type: "text",
                                left: "center",
                                top: "30%",
                                style: {
                                    text: "总采购额",
                                    textAlign: "center",
                                    textVerticaAlign: "middle",
                                    fill: "#999",
                                    font: "15px 'Helvetica',sans-serif"
                                }
                            },
                            {
                                type: "text",
                                top: "60%",
                                left: "center",
                                position: [0, 10],
                                style: {
                                    text: this.purchase.total,
                                    textAlign: "center",
                                    textVerticaAlign: "middle",
                                    fill: "#3d383a",
                                    font: "22px 'Helvetica',sans-serif"
                                }
                            }
                        ]
                    },
                    series: [
                        {
                            name: "采购额",
                            type: "pie",
                            radius: ["40%", "60%"],
                            avoidLabelOverlap: true,
                            label: {
                                show: true,
                                position: "outside"
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: "30",
                                    fontWeight: "bold"
                                }
                            },
                            labelLine: {
                                show: true
                            },
                            data: response.data.data.totalList
                        }
                    ]
                };
                //待付账款图
                this.purchaseChartTodo = {
                    tooltip: {
                        show: true,
                        trigger: "item",
                        formatter: "{a} <br/>{b}: {c}元 ({d}%)",
                        confine: true
                    },
                    graphic: {
                        type: "group",
                        top: "middle",
                        left: "center",
                        height: 80,
                        children: [
                            {
                                type: "text",
                                left: "center",
                                top: "30%",
                                style: {
                                    text: "待付账款",
                                    textAlign: "center",
                                    textVerticaAlign: "middle",
                                    fill: "#999",
                                    font: "15px 'Helvetica',sans-serif"
                                }
                            },
                            {
                                type: "text",
                                top: "60%",
                                left: "center",
                                position: [0, 10],
                                style: {
                                    text: this.purchase.todo,
                                    textAlign: "center",
                                    textVerticaAlign: "middle",
                                    fill: "#3d383a",
                                    font: "22px 'Helvetica',sans-serif"
                                }
                            }
                        ]
                    },
                    series: [
                        {
                            name: "待收账款",
                            type: "pie",
                            radius: ["40%", "60%"],
                            avoidLabelOverlap: true,
                            label: {
                                show: true,
                                position: "outside"
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: "30",
                                    fontWeight: "bold"
                                }
                            },
                            labelLine: {
                                show: true
                            },
                            data: response.data.data.todoList
                        }
                    ]
                };
            })
            .catch(error => {
                console.log(error);
            });
        window.addEventListener("resize", this.resizeTheChart);
    },
    filters: {
        NumFormat: function(value) {
            if (!value) return "0.00";

            /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
            /*后来改成了 Number(value)|0,但是输入超过十一位就为负数了，具体见评论 */
            var intPart = Number(value) - (Number(value) % 1); //获取整数部分（这里是windy93的方法）
            var intPartFormat = intPart
                .toString()
                .replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); //将整数部分逢三一断

            var floatPart = ".00"; //预定义小数部分
            var value2Array = value.toString().split(".");

            //=2表示数据有小数位
            if (value2Array.length == 2) {
                floatPart = value2Array[1].toString(); //拿到小数部分

                if (floatPart.length == 1) {
                    //补0,实际上用不着
                    return intPartFormat + "." + floatPart + "0";
                } else {
                    return intPartFormat + "." + floatPart;
                }
            } else {
                return intPartFormat + floatPart;
            }
        }
    },
    components: {
        myheader
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.resizeTheChart);
    }
};
</script>

<style scoped>
.hello {
    width: 100%;
    height: 25rem;
    /* height: 5rem; */
}
.echarts {
    width: 100%;
    height: 100%;
}
.demo-paper {
    margin: 1rem 0;
    padding: 0.15rem 0;
    width: 100%;
    /* height: 20rem; */
}
.title {
    /* float: left; */
    text-align: left;
    margin: 0rem 1rem;
    /* color:#b8b8b8; */
    color: dimgrey;
    font-size: 0.9rem;
}
.subtitle {
    text-align: left;
    margin: 0rem 0rem 0rem 1rem;
    /* color:#b8b8b8; */
    color: dimgrey;
    font-size: 1rem;
    font-weight: bold;
}
.number {
    text-align: left;
    /* float: left; */
    font-size: 2.5rem;
    margin: 0rem 1rem;
    color: red;
}
.number2 {
    text-align: left;
    /* float: left; */
    font-size: 1rem;
    font-weight: bold;

    /* margin: 0rem 1rem; */
    color: green;
}
.progress {
    margin: 0.3rem 1rem;
}
.mu-tabs-inverse {
    background-color: white;
}
@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic";
@import "http://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.css";
</style>