<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header-with-nav :navigation="navigation" :headerName="'ORDER #'+order.invoicePrefix+order.id" />
        <nb-content v-if="getDeliveryDetail" class="container">
            <nb-view>
                <MapView
                    :initialRegion="{
                        latitude: $store.state.selectedLocation.coords.latitude,
                        longitude: $store.state.selectedLocation.coords.longitude,
                        latitudeDelta: 0.00222,
                        longitudeDelta: 0.00121,
                    }"
                    :style="{width:'100%',height:mapHeight}">
                    <Marker 
                        :coordinate=deliveryBoy 
                        title="You"
                    > 
                        <image :source="require('../../../assets/images/icons/delivery-boy.png')" :style="{height: 35, width:35, resizeMode:'contain' }" />
                    </Marker>
                    <Marker 
                        :coordinate=customer 
                        title="Customer"
                    > 
                        <image :source="require('../../../assets/images/icons/customer-icon.png')" :style="{height: 35, width:35, resizeMode:'contain' }" />
                    </Marker>
                    <Marker 
                        :coordinate=kitchen 
                        title="Kitchen"
                    > 
                        <image :source="require('../../../assets/images/icons/kitchen-icon.png')" :style="{height: 35, width:35, resizeMode:'contain' }" />
                    </Marker>
                    <MapViewDirections
                        :origin="kitchen"
                        :destination="customer"
                        apikey=AIzaSyDv4tbjxizDdu5cz9alkaGdWZydkkf55BQ
                        :strokeWidth=3
                        strokeColor="#fcbe00"
                        optimizeWaypoints=true
                        :onStart="(params) => {
                            console.log(params);
                        }"
                        :onReady="result => {
                            console.log(`Distance: ${result.distance} km`)
                            console.log(`Duration: ${result.duration} min.`)
                            distance=result.distance;
                            duration=result.duration;
                        }"
                    />
                </MapView>
                <touchable-opacity class="direction" :on-press="()=>{navigation.navigate('Direction',{customerlongitude:order.customerLongitude,customerlatitude:order.customerLatitude,kitchenlongitude:order.kitchenLongitude,kitchenlatitude:order.kitchenLatitude})}">
                    <image class="direction-icon" :source="require('../../../assets/images/icons/distance.png')" />
                </touchable-opacity>
            </nb-view>
            <nb-view padder>
                <nb-view :on-press="()=>{ newOrderToggle=!newOrderToggle }" class="section-header">
                    <nb-view class="active-dot"></nb-view>
                    <nb-text class="header-title">Delivery</nb-text>
                </nb-view>
                <nb-view class="seperator"></nb-view>
                <nb-view class="order-row padding-bottom-content">
                    <nb-view class="order-left">
                        <image class="order-left-image" :source="require('../../../assets/images/icons/kitchen.png')" />
                    </nb-view>
                    <nb-view class="order-right">
                        <nb-text class="kitchen-name">{{order.customerName}}</nb-text>
                        <nb-text class="kitchen-address">{{order.customerAddress}}</nb-text>
                        <nb-view class="order-row">
                            <nb-view class="order-row kitchen-distance">
                                <image class="kitchen-distance-icon" :source="require('../../../assets/images/icons/location.png')" />
                                <nb-text class="kitchen-distance-text">{{parseFloat(distance).toFixed(2)}} Km</nb-text>
                            </nb-view>
                            <nb-view class="order-row">
                                <image class="kitchen-distance-icon" :source="require('../../../assets/images/icons/time.png')" />
                                <nb-text class="kitchen-distance-text">{{parseInt(duration)}} Min</nb-text>
                            </nb-view>
                        </nb-view>
                        <touchable-opacity :on-press="() => dialPhone(order.customerPhone)" class="call-button">
                            <image class="call-button-icon" :source="require('../../../assets/images/icons/call.png')" />
                            <nb-text class="call-button-text">Call {{order.customerName}}</nb-text>
                        </touchable-opacity>
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
            </nb-view>
        </nb-content>
        <nb-button v-if="order.orderStatusId==5" full disabled><nb-text class="status-text">Order Delivered</nb-text></nb-button>
        <nb-button v-if="order.orderStatusId==4" full :on-press="()=>statusUpdate(orderId,order.deliveryStatusId)"><nb-text class="status-text">{{order.deliveryStatusName}}</nb-text></nb-button>
        <RBSheet
            ref="confirm"
            height="160"
            :closeOnPressMask="false"
            :customStyles="{
                container: {
                    borderTopLeftRadius:15, borderTopRightRadius:15
                }
            }"
        >
            <nb-content class="modal-content">
                <nb-text class="modal-title">Deliver Order</nb-text>
                <nb-text class="modal-subtitle">Are you sure? </nb-text>
                <nb-view class="modal-footer">
                    <touchable-opacity class="cancel-button" :on-press="()=>{ $refs.confirm.close() }">
                        <nb-text class="cancel-button-text">CANCEL</nb-text>
                    </touchable-opacity>
                    <touchable-opacity class="confirm-button" :on-press="()=>updateStatus(orderId,order.deliveryStatusId)">
                        <nb-text class="confirm-button-text">YES</nb-text>
                    </touchable-opacity>
                </nb-view>
            </nb-content>
        </RBSheet>
    </nb-container>
</template>

<script>
import MapView,{Marker} from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import {Linking,Platform} from "react-native"
import { StackActions, NavigationActions } from 'react-navigation';
import { Toast } from 'native-base'
import { Animated, Easing } from "react-native"
import moment from 'moment'
export default {
    props: {
        navigation: { Object }
    },
    components: {
        MapView,Marker,MapViewDirections
    },
    data() {
        return {
            mapHeight: this.appConfig.height/3,
            order:'',
            orderId :this.navigation.state.params.orderId,
            googleApiKey:'',
            distance:'',
            duration:'',      
            kitchen: {
                latitude:12.88214805964617 , longitude:75.37280886840823 
            },
            deliveryBoy:{ 
                latitude: this.$store.state.selectedLocation.coords.latitude,
                longitude: this.$store.state.selectedLocation.coords.longitude,  
            },
            customer:{ 
                latitude: this.$store.state.selectedLocation.coords.latitude,
                longitude: this.$store.state.selectedLocation.coords.longitude,  
            },
            isLoading: false
        }
    },
    beforeMount() {
        this.googleApiKey = this.appConfig.googleApiKey
    },
    computed:{
        getDeliveryDetail(){
            this.isLoading = true
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            var status = true;
            this.api.create({
                method: 'POST',
                url: this.api.routes.deliveryDetail,
                headers: {'Content-Type': 'application/json','Authorization':AuthStr},
                data:{id:this.orderId}
            })
            .then(response => { 
                console.log(response.data)
                this.order=response.data.orderDetail;
                this.customer={
                   latitude:parseFloat(this.order.customerLatitude) , longitude:parseFloat(this.order.customerLongitude)
                }
                this.kitchen={
                   latitude:parseFloat(this.order.kitchenLatitude) , longitude:parseFloat(this.order.kitchenLongitude)
                }
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            }) 
            return status
        }
    },
    methods: {
        statusUpdate(orderId,deliveryStatus){
            if(deliveryStatus==3)
            this.$refs.confirm.open()
            else
            this.updateStatus(orderId,deliveryStatus)
        },
        updateStatus(orderId,deliveryStatus){
            var status = true;
            if(deliveryStatus==3)
                this.$refs.confirm.close()
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
                this.isLoading = false
                if(response.data.status==3){
                    this.navigation.dispatch(StackActions.replace({routeName:'Delivered'}))
                }else{
                    this.navigation.dispatch(StackActions.replace({routeName:'DeliveryDetail',params:{orderId:orderId}}))
                }
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);  
            }) 
            return status
        },
        dialPhone(number){
            let phoneNumber = '';
            if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
            else {phoneNumber = `telprompt:${number}`; }
            Linking.openURL(phoneNumber);
        },  
    }
}
</script>

<style>
    .container{
        background-color: #fcfcfc;
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
        background-color: #27b8e3;
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
        margin-bottom: 20;
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

    .call-button{
        flex-direction: row;
        align-items: center;
        margin-top: 20;
    }
    .call-button-icon{
        width: 14.7;
        height: 14.7;
        resize-mode: contain;
        margin-right: 8.3;
    }
    .call-button-text{
        font-family: Montserrat_Regular;
        color: #32b546;
        font-size: 12;
    }
    .direction-icon{
        width: 25;
        height: 25;
        resize-mode:contain; 
    }
    .direction{
        margin-top:190;
        align-self: flex-end;
        position:absolute;
        border-radius: 30;
        padding:10;
        right: 5;
        background-color: #FFFFFF; 
        margin-right: 15;

    }
    
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
        font-size: 17;
        margin-bottom: 8;
        align-self: center;
    }
    .modal-footer{
        flex-direction: row;
        align-items: center;
        margin-top: 25;
        justify-content: space-between;
    }
    .cancel-button{
        margin-right: 35
    }
    .cancel-button-text{
        color:#ff1919;
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