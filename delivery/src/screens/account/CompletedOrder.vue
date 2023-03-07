<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header-with-nav :navigation="navigation" headerName="Delivered Orders" />
        <nb-content padder :contentContainerStyle="{flexGrow: 1, width:'100%'}" :automaticallyAdjustContentInsets="true">
            <DropDownPicker
                :items="reportPeriod"
                :containerStyle="{height: 60, width:100, marginBottom:15}"
                :style="{borderWidth:0, paddingHorizontal:0, zIndex:99}"
                :itemStyle="{
                    justifyContent: 'flex-start'
                }"
                :defaultValue="filter"
                :placeholderStyle="{ fontSize:14, fontFamily:'Montserrat_Medium'}"
                :showArrow=true
                placeholder="Filter"
                :dropDownStyle="{backgroundColor: '#FFFFFF'}"
                :onChangeItem="(item)=>{
                    selectCategory(item)
                }"
            />
            <nb-view v-if="completedOrders.length" :style="{zIndex:10}">
                <touchable-opacity :on-press="()=>{navigation.navigate('DeliveryDetail',{orderId:order.id})}" v-for="order in completedOrders" :key="order.id" class="completed-order-row order-section" :style="{shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.2}">
                    <nb-view class="completed-order-left">
                        <nb-view class="order-number-status">
                            <nb-text class="order-number">{{order.invoicePrefix+order.id}}</nb-text>
                            <nb-text class="status-name">{{ order.deliveryStatus }}</nb-text>
                        </nb-view>
                        <nb-text class="kitchen-name">{{order.customerName}}</nb-text>
                        <nb-text class="kitchen-address">{{order.address}}</nb-text>
                        <nb-view class="order-number-status">
                            <nb-text class="amount-earned">₹{{parseFloat(order.deliveryCharge).toFixed(2)}}</nb-text>
                            <nb-text class="pickup-time">{{ order.deliveryTime }}</nb-text>
                        </nb-view>
                    </nb-view>
                    <nb-view class="completed-order-right">
                        <nb-view >
                            <image class="order-detail-button" :source="require('../../../assets/images/icons/chevron-right.png')"/>
                        </nb-view>
                    </nb-view>
                </touchable-opacity>
            </nb-view>
            <nb-view v-if="!isLoading && !completedOrders.length" padder class="no-result">
                <nb-text class="no-result-text">No orders found</nb-text>
            </nb-view>
        </nb-content>
    </nb-container>
</template>

<script>
import DropDownPicker from 'react-native-dropdown-picker';
export default {
    props: {
        navigation: { Object }
    },
    components: {
        DropDownPicker
    },
    data() {
        return {
            newOrderToggle:false,
            completedOrders:'',
            isLoading : false,
            reportPeriod:[
                {label: 'All', value: ''},
                {label: 'Today', value: 'today'},
                {label: 'Week', value: 'week'},
                {label: 'Month', value: 'month'},
                {label: 'Year', value: 'year'},
            ],
            filter: ''
        }
    },
    beforeMount() {
        this.getCompletedOrders()
    },
    methods:{
        selectCategory(item) {
            this.filter=item.value 
            this.getCompletedOrders()
        },
        getCompletedOrders(){
            this.isLoading = true
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            var status = true;
            this.api.create({
                method: 'POST',
                url: this.api.routes.completedTasks,
                headers: {'Content-Type':'application/json','Authorization':AuthStr},
                data:{
                    filter:this.filter
                }
            })
            .then(response => { 
                console.log(response.data)
                this.completedOrders = response.data.completedTasks;
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error);
                console.log(error.response.data);
            }) 
            return status
        },
    }
}
</script>
<style>
    .container{
        background-color: #FCFCFC;
        flex: 1;
    }
    .split-container{
        flex: 1;
        padding: 15;
    }
    .home-title{
        font-family: Montserrat_Medium;
        font-size: 14;
        color: #707070;
        margin-bottom: 15;
    }
    .order-section{
        background-color: #FFFFFF;
        border-radius: 8;
        elevation: 3;
        margin-bottom: 12;
    }
    .section-header{
        flex-direction: row;
        align-items: center;
        padding-top: 5;
        padding-bottom: 15;
    }
    .active-dot{
        height: 8;
        width: 8;
        background-color: #26aa4a;
        border-radius: 30;
        margin-right: 15;
    }
    .header-title{
        font-family: Montserrat_Bold;
        color: #000000;
        flex: 1;
        font-size: 16;
    }
    .header-icon{
        width: 14.1;
        height: 7.7;
        resize-mode: contain;
    }
    .seperator{
        border-bottom-width: 1;
        border-color: #ededed;
        margin-bottom: 10;
    }
    .order-row{
        flex-direction: row;
        align-items: center;
    }
    .order-left{
        margin-right: 20;
        align-self: flex-start;
        padding: 10;
        padding-top: 5;
        /* justify-content: center; */
    }
    .order-left-image{
        width: 36.4;
        height: 31.4;
        resize-mode: contain;
    }
    .order-right{
        flex: 1;
    }
    .kitchen-name{
        font-family: Montserrat_Medium;
        color: #000000;
        font-size: 14;
        margin-bottom: 3;
    }
    .kitchen-address{
        font-family: Montserrat_Medium;
        color: #707070;
        font-size: 12;
        margin-bottom: 6;
    }
    .kitchen-distance{
        margin-right: 10;
    }
    .kitchen-distance-icon{
        width: 13.6;
        height: 16;
        resize-mode: contain;
        margin-right: 6;
    }
    .kitchen-distance-text{
        font-family: Montserrat_Medium;
        color: #707070;
        font-size: 12;
    }
    .padding-bottom-content{
        padding-bottom: 20;
    }
    .dotted-line{
        height: 35;
        margin-top: -35;
        border-left-width: 0.5;
        border-style: dashed;
        border-color: #707070;
        align-self: center;
    }

    
    .item-details{
    }
    .item-detail-header{
        font-family: Montserrat_Medium;
        font-size: 14;
        color: #000000;
        margin-bottom: 14;
        margin-top: 5;
    }
    .item-detail-item{
        flex-direction: row;
        align-items: center;
        margin-bottom: 14;
    }
    .item-name{
        flex: 1;
        color: #707070;
        font-family: Montserrat_Medium;
        font-size: 12;
    }
    .item-quantity{
        flex: 1;
        color: #707070;
        font-family: Montserrat_Medium;
        font-size: 12;
    }



    .amount-earned{
        color: #414141;
        font-family: Montserrat_Medium;
        font-size: 12;
    }
    .order-detail-button{
        width: 7.7;
        height: 15.5;
        resize-mode: contain;
    }
    .completed-head{
        color: #26aa4a;
        font-size: 12;
        font-family: Montserrat_SemiBold;
        margin-bottom: 15;
        margin-top: 15;
    }
    .completed-order-row{
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        padding: 15;
    }
    .completed-order-left{
        margin-right: 15;
        flex: 1;
    }
       .no-result{
        flex: 1;
        justify-content: center;
        align-items: center;
        margin-top: 30;
    }
    .no-result-text{
        font-size: 14;
        color: #000000;
    }

    /* Modal */

    .modal-content{
        padding: 30;
    }
    .modal-title{
        color: #000000;
        font-family: Montserrat_Medium;
        font-size: 17;
        margin-bottom: 5;
    }
    .modal-subtitle{
        color: #707070;
        font-family: Montserrat_Medium;
        font-size: 12;
        margin-bottom: 8;
    }
    .modal-footer{
        flex-direction: row;
        align-items: center;
        margin-top: 25;
        justify-content: flex-end;
    }
    .cancel-button{
        margin-right: 35
    }
    .cancel-button-text{
        color:#000000;
        font-family: Montserrat_Medium;
        font-size: 14;
    }
    .confirm-button-text{
        color:#26aa4a;
        font-family: Montserrat_Medium;
        font-size: 14;
    }

    .order-number-status{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .order-number{
        font-size: 14;
        font-family: Montserrat_SemiBold;
        /* margin-top: 5; */
    }
    .status-name{
        font-size: 13;
        font-family: Montserrat_Medium;
        color: #ffd400;
    }

    .delivery-time{
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .delivery-time-value{
        font-size: 14;
        color:#26aa4a;
        font-family: Montserrat_Medium;
    }
    .pickup-time{
        font-size: 12;
        color:#26aa4a;
        font-family: Montserrat_Medium;
    }
</style>