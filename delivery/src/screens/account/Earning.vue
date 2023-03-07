<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header-with-nav :navigation="navigation" headerName="Earnings & Incentives" :style="{elevation:2}"/>
        <nb-content v-if="getEarnings" class="container">
            <nb-view class="report-section" padder>
                <nb-view class="report">
                    <nb-text class="report-label">Total Earnings</nb-text>
                    <nb-text class="report-value">₹{{parseFloat(totalEarnings).toFixed(2)}}</nb-text>   
                </nb-view>
                <!-- <nb-view class="report">
                    <nb-text class="report-label">Total Paid</nb-text>
                    <nb-text class="report-value">₹{{parseFloat(totalPaid).toFixed(2)}}</nb-text>   
                </nb-view>
                <nb-view class="report">
                    <nb-text class="report-label">Pending</nb-text>
                    <nb-text class="report-value">₹{{parseFloat(pending).toFixed(2)}}</nb-text>   
                </nb-view> -->
            </nb-view>
            <nb-view padder>
                <nb-text class="recent-head">Completed Deliveries</nb-text>
                <nb-view v-if="completedTasks.length">
                    <nb-view class="recent-item" v-for="task in completedTasks" :key="task.id" padder>
                        <nb-view class="recent-item-left">
                            <nb-view class="recent-order">
                                <nb-text class="order-number">Order No</nb-text>
                                <nb-text class="order-number">CHEF{{task.id}}</nb-text>
                                <nb-text class="order-number"></nb-text>
                            </nb-view>
                            <nb-view class="order-detail">
                                <nb-text class="order-item-date">{{task.itemCount}} Item(s)</nb-text>
                                <nb-text class="order-item-date">{{task.orderTime}}</nb-text>
                                <nb-text class="order-item-date">{{task.orderDate}}</nb-text>
                            </nb-view>
                        </nb-view>
                        <nb-text class="order-earning">₹{{parseFloat(task.total).toFixed(2)}}</nb-text>
                    </nb-view> 
                </nb-view>
                <nb-view v-if="!isLoading && !completedTasks.length" padder class="no-result">
                    <nb-text class="no-result-text">No orders found</nb-text>
                </nb-view>
            </nb-view>
        </nb-content>
    </nb-container>
</template>

<script>
export default {
    props: {
        navigation: { Object }
    },
    data() {
        return {
            completedTasks:'',
            totalEarnings:0,
            totalPaid:'',
            pending:'',
            isLoading: false
        }
    },
    
    beforeMount(){
        console.log(this.$store.state.user.userId)   
    },
    computed:{
        getEarnings(){
            // console.log('hi');
            this.isLoading = true
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            var status = true;
            this.api.create({
                method: 'POST',
                url: this.api.routes.getEarnings,
                headers: {'Content-Type': 'application/json','Authorization':AuthStr},
            })
            .then(response => { 
                console.log(response.data)
                this.completedTasks=response.data.completedTasks
                this.totalEarnings=response.data.totalEarnings
                this.totalPaid=response.data.totalPaid
                this.pending=response.data.pending
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            }) 
            return status
        }
    },
}
</script>

<style>
    .container{
        background-color: #f4f4f4;
    }
    .report-section{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: #FFFFFF;
        padding-vertical: 20;
    }
    .report{

    }
    .report-label{
        font-family: Montserrat_Regular;
        color: #000000;
        font-size: 12;
        margin-bottom: 8;
    }
    .report-value{
        font-family: Montserrat_Bold;
        color: #000000;
        font-size: 22;
    }

    /* Recent Order */

    .recent-head{
        font-family: Montserrat_Regular;
        font-size: 12;
        color: #999999;

    }
    .recent-item{
        margin-vertical: 5;
        background-color: #FFFFFF;
        flex-direction: row;
        align-items: center;
    }
    .recent-item-left{
        flex: 3;
    }
    .recent-order{
        flex-direction: row;
        align-items: center;
        flex: 3;
        margin-bottom: 4;
    }
    .order-number{
        flex: 1;
        font-size: 12;
        font-family: Montserrat_SemiBold;
        color: #000000;
    }
    .order-detail{
        flex-direction: row;
        align-items: center;
    }
    .order-item-date{
        flex: 1;
        color: #949494;
        font-size: 12;
        font-family: Montserrat_Medium;
    }
    .order-earning{
        font-size: 20;
        flex: 1;
        text-align: right;
        font-family: Montserrat_SemiBold;
        color: #000000;
    }

</style>