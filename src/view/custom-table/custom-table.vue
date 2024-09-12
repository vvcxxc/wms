<template>
<div>
    <search :searchdata="searchdata"></search>
</div>
    
</template>
<script>
import Search from '@/view/list-page/components/search/search.vue'
import{ getSearchHeader } from '@/api/business-manage.js'
export default {
    components: {
        Search
    },
    data(){
        return{
            tableID:'',
            searchdata:[]

        }
    },
    methods: {
        init(){
            this.tableID = this.$route.query.id
            this.getSearchHeaderFun()

        },
        getSearchHeaderFun(){
            let id = this.$route.query.name
             if(id == undefined){
                id = ''
                return
            }
            getSearchHeader(id).then(res=>{
                let data1 = JSON.parse(res.data.resultdata)
                this.searchdata = data1.filter_list
            }).catch(error=>{
                console.log(error)
            })
        }

    },
    mounted(){
        this.init()

    }
}
</script>
<style lang="less" scoped>

</style>