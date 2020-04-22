<template>
    <div>
        <myheader :title="title"></myheader>
        <van-search v-model="search" placeholder="请输入搜索关键词" />
        <h3
            v-if="reviews.length == 0"
            style="text-align: center;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);"
        >暂无已审批合同！</h3>
        <mu-list
            class="list"
            v-for="review,index in searchData"
            :key="review.review.id"
            textline="two-line"
        >
            <mu-list-item :to="{name:'Approved', query:{id: review.review.id}}">
                <mu-list-item-content>
                    <mu-list-item-title>{{review.contract.name}}</mu-list-item-title>
                    <mu-list-item-sub-title>{{review.contract.partyB}}</mu-list-item-sub-title>
                </mu-list-item-content>
                <p>审批时间：{{review.review.reviewTime}}</p>
            </mu-list-item>

            <mu-divider></mu-divider>
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
            reviews: [],
            search:'',

        };
    },
    mounted() {
        this.$axios
            .get("/review/approved", {
                params: {
                    reviewPeople: this.$store.state.user.id
                }
            })
            .then(response => {
                
                this.reviews = response.data.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
    computed: {
        

        searchData: function() {
            var search = this.search;
            if (search) {
                return this.reviews.filter(reviews => {
                    if (reviews.contract.name.includes(search)) {
                        return reviews;
                    }
                });
            }
            return this.reviews;
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