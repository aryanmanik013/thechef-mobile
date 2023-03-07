<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header-with-nav :navigation="navigation" :headerName="'ORDER #'+order.invoicePrefix+order.id"/>
        <nb-content v-if="getpickupDetail" class="container" padder>
            <nb-view class="order-section" padder :style="{shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.2}">
                <nb-view class="order-row">
                    <nb-view class="order-left">
                        <image class="order-left-image" :source="require('../../../assets/images/icons/kitchen.png')" />
                    </nb-view>
                    <nb-view class="order-right">
                        <nb-text class="kitchen-name">{{order.kitchenName}}</nb-text>
                        <nb-text class="kitchen-address">{{order.kitchenAddress}}</nb-text>
                        <nb-view class="order-row">
                            <nb-view class="order-row kitchen-distance">
                                <image class="kitchen-distance-icon" :source="require('../../../assets/images/icons/location.png')" />
                                <nb-text class="kitchen-distance-text">{{distanceInKm?parseFloat(distanceInKm).toFixed(2):0}} Km</nb-text>
                            </nb-view>
                            <nb-view class="order-row">
                                <image class="kitchen-distance-icon" :source="require('../../../assets/images/icons/time.png')" />
                                <nb-text class="kitchen-distance-text">{{timeDuration?timeDuration:0}} Min</nb-text>
                            </nb-view>
                        </nb-view>
                    </nb-view>
                </nb-view>
                <nb-view class="item-details">
                <nb-view class="seperator"></nb-view>
                    <nb-text class="item-detail-header">Item Details</nb-text>
                     <nb-view v-for="item in order.items" :key="item.id" class="item-detail-item">
                        <nb-text class="item-name">{{item.name}}</nb-text>
                        <nb-text class="item-quantity">x {{item.quantity}}</nb-text>
                    </nb-view>
                   
                </nb-view>
                   <touchable-opacity class="direction-button" :on-press="()=>{navigation.navigate('Pickup',{orderId:order.id})}" :style="{shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.2}">
                    <image class="direction-button-icon" :source="require('../../../assets/images/icons/direction.png')" />
                    <nb-text class="direction-button-text">Get Direction</nb-text>
                </touchable-opacity>
            </nb-view>
             <nb-view class="order-section" padder :style="{shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.2}">
                <nb-view class="delivery-location">
                    <nb-view class="delivery-left">
                        <image class="delivery-left-image" :source="require('../../../assets/images/icons/delivery-location.png')" />
                    </nb-view>
                    <nb-view class="delivery-right">
                        <nb-text class="kitchen-name">{{order.customerName}}</nb-text>
                        <nb-text class="kitchen-address">{{order.customerAddress}}</nb-text>
                        <nb-text class="kitchen-name">Landmark </nb-text>
                        <nb-text class="kitchen-address">{{order.customerLandmark}}</nb-text>
                        <nb-text class="kitchen-name">Street</nb-text>
                        <nb-text class="kitchen-address">{{order.customerDoor}}</nb-text>
                    </nb-view>
                </nb-view>
            </nb-view>
        </nb-content>
        <nb-button full v-if="order.orderStatusId==3" :on-press="()=>updateStatus(orderId,order.deliveryStatusId)"><nb-text class="status-text">{{order.deliveryStatusName}}</nb-text></nb-button>
    </nb-container>
</template>

<script>
import { StackActions, NavigationActions } from 'react-navigation';
import { Toast } from 'native-base'
export default {
    props: {
        navigation: { Object }
    },
    data() {
        return {
            newOrderToggle:false,
            order:'',
            orderId :this.navigation.state.params.orderId,
            timeDuration:'',
            distanceInKm:'',
            isLoading: false
            
        }
    },
    beforeMount(){
        console.log(this.$store.state.user.userId)   
    },
    computed:{
        getpickupDetail(){
            this.isLoading = true
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            var status = true;
            this.api.create({
                method: 'POST',
                url: this.api.routes.pickupDetail,
                headers: {'Content-Type': 'application/json','Authorization':AuthStr},
                data:{id:this.orderId}
            })
            .then(response => { 
                console.log(response.data)
                this.order=response.data.orderDetail;
                this.distanceInKm=this.geoDistance(this.$store.state.selectedLocation.coords.latitude,this.$store.state.selectedLocation.coords.longitude, parseFloat(this.order.kitchenLatitude),parseFloat(this.order.kitchenLongitude)).distanceInKm
                this.timeDuration=this.geoDistance(this.$store.state.selectedLocation.coords.latitude,this.$store.state.selectedLocation.coords.longitude, parseFloat(this.order.kitchenLatitude),parseFloat(this.order.kitchenLongitude)).timeDuration
                this.isLoading = false
              
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            }) 
            return status
        }
    },
    methods:{
        updateStatus(orderId,deliveryStatus){
            var status = true;
            this.isLoading = true
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            this.api.create({
                method: 'POST',
                url: this.api.routes.updateDeliveryStatus,
                headers: {'Content-Type':'application/json','Authorization':AuthStr},
                data:{id:orderId,status:deliveryStatus}
            })
            .then(response => { 
                console.log(response.data.status);
              
                Toast.show({
                    text: response.data.message,
                    duration : 3000
                });
                if(response.data.status==2){
                    this.navigation.dispatch(StackActions.replace({routeName:'PickupDetail',params:{orderId:orderId}}))
                } else {
                    this.navigation.dispatch(StackActions.replace({routeName:'DeliveryDetail',params:{orderId:orderId}}))
                }
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error); 
            }) 
            return status
        },
    }
}
</script>

<style>
    .container{
        background-color: #FCFCFC;
    }
    .order-section{
        background-color: #FFFFFF;
        border-radius: 8;
        elevation: 3;
        margin-bottom: 10;
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
        margin-bottom: 14;
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

    .item-details{
        margin-top: 20;
        /* margin-bottom: 20; */
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

    .delivery-location{
        flex-direction: row;
    }
    .delivery-left{
        margin-right: 21;
    }
    .delivery-left-image{
        width: 18;
        height: 22.1;
        resize-mode:contain;
    }
    .delivery-right{
        flex: 1;
    }

    /* Direction Button */

    .direction-button{
        background-color: #FFFFFF;
        height: 42;
        elevation: 3;
        flex-direction: row;
        border-radius: 8;
        justify-content: center;
        align-items: center;
    }
    .direction-button-icon{
        height: 19.8;
        width: 13.8;
        resize-mode: contain;
        margin-right: 8;
    }
    .direction-button-text{
        font-family: Montserrat_Bold;
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
    .status-text{
        text-transform: uppercase;
    }
</style>