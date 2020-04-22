<template>
    <mu-form ref="form" :model="recordForm" >
        <mu-form-item prop="recordForm.name" label="收付款名称" :rules="notNullRules">
            <mu-text-field v-model="recordForm.name"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="recordForm.type" label="类型">
            <mu-radio v-model="recordForm.type" value="0" label="收款"></mu-radio>
            <mu-radio v-model="recordForm.type" value="1" label="付款"></mu-radio>
        </mu-form-item>
        <mu-form-item prop="recordForm.number" label="金额" >
            <mu-text-field type="number" v-model="recordForm.number" suffix="元"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="recordForm.time" label="日期">
                <mu-date-input
                    v-model="recordForm.time"
                    label-float
                    full-width
                    no-display
                    value-format="YYYY-MM-DD"
                ></mu-date-input>
        </mu-form-item>
        <mu-form-item prop="recordForm.more" label="备注">
            <mu-text-field v-model="recordForm.more"></mu-text-field>
        </mu-form-item>
        </mu-form-item>

        <mu-button slot="actions" flat color="primary" @click="closeSimpleDialog">open</mu-button>
        <mu-button slot="actions" flat color="primary" @click="closeSimpleDialog">Close</mu-button>
        </mu-form-item>

    </mu-form>
</template>

<script>
export default {
    data() {
        return {
            recordForm: {
                name: "",
                type: "",
                number: "",
                time: "",
                more: ""
            },
            notNullRules: [{ validate: val => !!val, message: "不能为空" }],


        };
    },
    watch:{
        'recordForm':{
            handler(val){
                this.$emit("func",this.recordForm);
            },
            deep: true
        }
    }

};
</script>

<style scoped>
</style>>
