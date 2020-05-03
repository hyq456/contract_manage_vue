<template>
    <div>
        <myheader :title="title"></myheader>

    </div>
</template>

<script>
import myheader from "../../components/Myheader";
import qs from "qs";
export default {
     data() {
        return {
            title: "我的发票",
            receiptData: [],
        };
    },
    components: {
        myheader
    }
}
</script>

<style>

</style>