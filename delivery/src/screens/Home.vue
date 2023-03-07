<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header-with-nav :navigation="navigation" headerName="" />
        
        <nb-view class="container">
            <nb-view class="split-container">
                <nb-text class="home-title">Delivery Requests</nb-text>
                <!-- <nb-content> -->
                <PTRView :onRefresh="()=>{ getRecentRequests() }" :style="{backgroundColor:'#FFFFFF', borderRadius:4}">
                    <nb-view v-if="deliveryRequests.length">
                        <nb-view class="order-section" padder v-for="request in deliveryRequests" :key="request.requestId" :style="{shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.2}">
                            <touchable-opacity :on-press="()=>{ newOrderToggle=!newOrderToggle }" class="section-header" disabled>
                                <!-- <nb-view class="active-dot"></nb-view>
                                <nb-text class="header-title">New Order</nb-text> -->
                                <!-- <image v-if="!newOrderToggle" class="header-icon" :source="require('../../assets/images/icons/chevron-down.png')" />
                                <image v-else class="header-icon" :source="require('../../assets/images/icons/chevron-up.png')" /> -->
                                <nb-view class="delivery-time">
                                    <image class="kitchen-distance-icon" :source="require('../../assets/images/icons/time.png')" />
                                    <nb-text class="delivery-time-value">{{ request.pickupTime }}</nb-text>
                                </nb-view>
                                <touchable-opacity :on-press="()=>{ confirmAcceptOrder(request.requestId) }" class="header-button">
                                    <nb-text class="header-button-text">ACCEPT ORDER</nb-text>
                                </touchable-opacity>
                                <!-- <nb-button block :on-press="()=>{ confirmAcceptOrder(request.requestId) }"><nb-text>ACCEPT ORDER</nb-text></nb-button> -->
                            </touchable-opacity>
                            <nb-view class="seperator"></nb-view>
                            <nb-view class="order-row padding-bottom-content">
                                <nb-view class="order-left">
                                    <image class="order-left-image" :source="require('../../assets/images/icons/kitchen.png')" />
                                </nb-view>
                                <nb-view class="order-right">
                                    <nb-text class="kitchen-name">{{request.kitchenName}}</nb-text>
                                    <nb-text class="kitchen-address">{{request.kitchenAddress}}</nb-text>
                                    <nb-view class="order-row">
                                        <nb-view class="order-row kitchen-distance">
                                            <image class="kitchen-distance-icon" :source="require('../../assets/images/icons/location.png')" />
                                            <nb-text class="kitchen-distance-text">{{ request.kitchenDistanceInKm }} Km</nb-text>
                                        </nb-view>
                                        <nb-view class="order-row">
                                            <image class="kitchen-distance-icon" :source="require('../../assets/images/icons/time.png')" />
                                            <nb-text class="kitchen-distance-text">{{ request.kitchenTimeDuration }} Min</nb-text>
                                        </nb-view>
                                    </nb-view>
                                </nb-view>
                            </nb-view>
                            <nb-view class="order-row padding-bottom-content">
                                <nb-view class="order-left">
                                    <nb-view class="dotted-line"></nb-view>
                                    <image class="order-left-image" :source="require('../../assets/images/icons/delivery-location.png')" />
                                </nb-view>
                                <nb-view class="order-right">
                                    <nb-text class="kitchen-name">{{request.customerName}} </nb-text>
                                    <nb-text class="kitchen-address">{{request.customerAddress}}</nb-text>
                                    <nb-view class="order-row">
                                        <nb-view class="order-row kitchen-distance">
                                            <image class="kitchen-distance-icon" :source="require('../../assets/images/icons/location.png')" />
                                            <nb-text class="kitchen-distance-text">{{ request.customerDistanceInKm }} Km</nb-text>
                                        </nb-view>
                                        <nb-view class="order-row">
                                            <image class="kitchen-distance-icon" :source="require('../../assets/images/icons/time.png')" />
                                            <nb-text class="kitchen-distance-text">{{ request.customerTimeDuration }} Min</nb-text>
                                        </nb-view>
                                    </nb-view>
                                </nb-view>
                            </nb-view>
                            <!-- <nb-view v-if="newOrderToggle" class="item-details">
                                <nb-view class="seperator"></nb-view>
                                <nb-text class="item-detail-header">Item Details</nb-text>
                                <nb-view v-for="item in todayTask.items" :key="item.id" class="item-detail-item">
                                    <nb-text class="item-name">{{item.name}}</nb-text>
                                    <nb-text class="item-quantity">x {{item.quantity}}</nb-text>
                                </nb-view>
                            </nb-view> -->
                            <!-- <nb-button block :on-press="()=>{ confirmAcceptOrder(request.requestId) }"><nb-text>ACCEPT ORDER</nb-text></nb-button> -->
                        </nb-view>
                    </nb-view>
                    <nb-view padder class="no-result" v-else>
                        <nb-text class="no-result-text">No Tasks Found</nb-text>
                    </nb-view>
                <!-- </nb-content> -->
                </PTRView>
            </nb-view>

            <nb-view class="split-container">
                <nb-text class="completed-head">Pending Deliveries</nb-text>
                <PTRView :onRefresh="()=>{ getPendingOrders() }"  :style="{backgroundColor:'#FFFFFF', borderRadius:4}">
                <!-- <nb-content> -->
                    <nb-view v-if="pendingOrders.length">
                        <nb-view v-for="order in pendingOrders" :key="order.id" class="pending-orders" :style="{shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.2}">
                            <touchable-opacity :on-press="()=>{navigation.navigate('DeliveryDetail',{orderId:order.orderDetails.id})}" class="completed-order-row" :disabled="!order.orderDetails">
                                <nb-view class="completed-order-left" v-if="order.orderDetails!=''">
                                    <nb-view class="order-number-status">
                                        <nb-text class="order-number">{{order.orderDetails.invoicePrefix+order.orderDetails.id}}</nb-text>
                                        <nb-text class="status-name">{{ order.orderStatus }}</nb-text>
                                    </nb-view>
                                    <nb-text class="kitchen-name">{{order.orderDetails.kitchenName}}</nb-text>
                                    <nb-text class="kitchen-address">{{order.orderDetails.address}}</nb-text>   
                                    <nb-view class="order-number-status">
                                        <nb-text class="amount-earned">₹{{parseFloat(order.orderDetails.total).toFixed(2)}}</nb-text>
                                        <nb-text class="pickup-time">{{ order.pickupTime }}</nb-text>
                                    </nb-view>
                                </nb-view>
                                <nb-view class="completed-order-left" v-else>
                                    <nb-view class="order-number-status">
                                        <nb-text class="order-number">CHEF{{order.requestId}}</nb-text>
                                        <nb-text class="status-name">{{ order.orderStatus }}</nb-text>
                                    </nb-view>
                                    <nb-text class="kitchen-name">{{order.kitchenName}}</nb-text>
                                    <nb-text class="kitchen-address">{{order.kitchenAddress}}</nb-text>
                                    <nb-view class="order-number-status">
                                        <!-- <nb-text class="amount-earned">₹{{parseFloat(order.orderDetails.total).toFixed(2)}}</nb-text> -->
                                        <nb-text class="pickup-time">{{ order.pickupTime }}</nb-text>
                                    </nb-view>
                                </nb-view>
                                <nb-view class="completed-order-right"  v-if="order.orderDetails!=''">
                                    <nb-view v-if="order.orderDetails!=''">
                                    <image class="order-detail-button" :source="require('../../assets/images/icons/chevron-right.png')"/>
                                    </nb-view>
                                </nb-view>
                            </touchable-opacity>
                            <nb-view class="message-section" v-if="order.orderDetails!='' && order.orderDetails.statusId < 2">
                                <nb-text class="message-section-text">Waiting for kitchen confirmation</nb-text>
                            </nb-view>
                            <nb-view class="message-section-active" v-if="order.orderDetails!='' && order.orderDetails.statusId == 3">
                                <nb-text class="message-section-text">Order is ready for pickup</nb-text>
                            </nb-view>
                        </nb-view>
                    </nb-view>
                    <nb-view v-else padder class="no-result">
                        <nb-text class="no-result-text">No pending orders</nb-text>
                    </nb-view>
                <!-- </nb-content> -->
                </PTRView>
            </nb-view>
        </nb-view>
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
                <nb-text class="modal-title">Accept Order</nb-text>
                <nb-text class="modal-subtitle">Are you sure?</nb-text>
                <nb-view class="modal-footer">
                    <touchable-opacity class="cancel-button" :on-press="()=>{ $refs.confirm.close() }">
                        <nb-text class="cancel-button-text">CANCEL</nb-text>
                    </touchable-opacity>
                    <touchable-opacity class="confirm-button" :on-press="()=>acceptOrder(orderId)">
                        <nb-text class="confirm-button-text">YES</nb-text>
                    </touchable-opacity>
                </nb-view>
            </nb-content>
        </RBSheet>
    </nb-container>
</template>

<script>
import { StackActions, NavigationActions } from 'react-navigation';
import { Toast } from 'native-base'
import PTRView from 'react-native-pull-to-refresh'
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants'
export default {
    props: {
        navigation: { Object }
    },
    components: {
        PTRView
    },
    data() {
        return {
            newOrderToggle:false,
            todayTask:'',
            completedTasks:'',
            orderId:'',
            timeDuration:'',
            distanceInKm:'',
            deliveryRequests: '',
            pendingOrders: '',
            isLoading : false
        }
    },
    mounted(){
        this.willFocusSubscription = this.navigation.addListener(
            'willFocus',
            () => {
                this.getRecentRequests()
                this.getPendingOrders()
            }
        );
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });

        Notifications.addNotificationReceivedListener(this._handleNotification)
        Notifications.addNotificationResponseReceivedListener(this._handleNotification)
    },
    beforeMount() {
        this.registerForPushNotificationsAsync()
        console.log(this.$store.state)
        var routeName = ''
        if(this.$store.state.splash) {
            routeName = 'Splash'
        } else if(!this.$store.state.user.loggedIn && !this.$store.state.user.verificationStatus && this.$store.state.user.authentication){
            routeName = 'ConfirmOTP'
        } else if(!this.$store.state.user.loggedIn && !this.$store.state.splash){
            routeName = 'Login' 
        } else if(this.$store.state.user.loggedIn && !this.$store.state.user.approvalStatus){
            routeName = 'Verification'
        }
        if(routeName){
            if(routeName=='ConfirmOTP'){
                this.navigation.dispatch(StackActions.replace({ routeName: 'Login' }))
            } else if(routeName=='Login') {
                this.navigation.dispatch(StackActions.replace({ routeName: routeName }))
            } else {
                this.navigation.dispatch(StackActions.replace({ routeName: routeName }))
            }
        } else {
            this.getRecentRequests()
            this.getPendingOrders()
        }
    },

    methods:{
        confirmAcceptOrder(requestId){
            this.orderId = requestId
            this.$refs.confirm.open()
        },
        async registerForPushNotificationsAsync(){
            try{
                if (!this.$store.state.token){
                    if (Constants.isDevice) {
                        let { status: existingStatus } = await Notifications.getPermissionsAsync();
                        let finalStatus = existingStatus;
                        // console.warn(finalStatus)
                        if (existingStatus !== 'granted') {
                            const { status } = await Notifications.requestPermissionsAsync();
                            finalStatus = status;
                            // alert('permission')
                        }
                        if (finalStatus !== 'granted') {
                            // alert('Failed to get push token for push notification!');
                            return;
                        }
                        token = (await Notifications.getExpoPushTokenAsync()).data;
                        this.$store.commit('setToken', {
                            token : token
                        })
                        // alert(token)
                        // console.log(token);
                    } else {
                        // alert('Must use physical device for Push Notifications');
                    }
                }
            } catch(error){
                // alert(error)
            }
        },
        acceptOrder(orderId){
            this.isLoading = true
            var status = true;
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            this.api.create({
                method: 'POST',
                url: this.api.routes.acceptOrder,
                headers: {'Content-Type':'application/json','Authorization':AuthStr},
                data:{id:orderId,status:1}
            })
            .then(response => { 
                console.log(response.data)
                this.$refs.confirm.close()
                Toast.show({
                    text: response.data.message,
                    duration : 3000
                });
                this.deliveryRequests = this.geoDistanceBulk(response.data.deliveryRequests, this.$store.state.selectedLocation.coords.latitude, this.$store.state.selectedLocation.coords.longitude)
                this.getPendingOrders()
                setTimeout(() => {this.isLoading = false}, 2000)
                // this.navigation.dispatch(StackActions.replace({routeName:'PickupDetail',params:{orderId:orderId}}))
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);  
            }) 
            return status
        },
        /* getTodayTasks(){
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            var status = true;
            this.api.create({
                method: 'POST',
                url: this.api.routes.todayTasks,
                headers: {'Content-Type': 'application/json','Authorization':AuthStr},
            })
            .then(response => { 
                console.log('Todays Task')
                this.todayTask=response.data.todayTask;
                console.log(this.todayTask)
                this.distanceInKm=this.geoDistance(this.$store.state.selectedLocation.coords.latitude,this.$store.state.selectedLocation.coords.longitude, this.todayTask.kitchenLatitude,this.todayTask.kitchenLongitude).distanceInKm
                this.timeDuration=this.geoDistance(this.$store.state.selectedLocation.coords.latitude,this.$store.state.selectedLocation.coords.longitude, this.todayTask.kitchenLatitude,this.todayTask.kitchenLongitude).timeDuration
                if(this.todayTask.deliveryStatus==1 || this.todayTask.deliveryStatus==2){
                    this.navigation.navigate('PickupDetail',{orderId:this.todayTask.id})
                } else if(this.todayTask.deliveryStatus==3 || this.todayTask.deliveryStatus==4){
                    this.navigation.navigate('DeliveryDetail',{orderId:this.todayTask.id})
                }
            })
            .catch(error => {
                console.log(error);
                console.log(error.response.data);
            }) 
            return status
        }, */
        getRecentRequests(){
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            var status = true;
            this.isLoading = true
            this.api.create({
                method: 'POST',
                url: this.api.routes.getDeliveryRequests,
                headers: {'Content-Type': 'application/json','Authorization':AuthStr},
            })
            .then(response => { 
                console.log('Todays Task')
                console.log(response.data)
                // this.deliveryRequests=response.data.deliveryRequests;

                this.deliveryRequests = this.geoDistanceBulk(response.data.deliveryRequests, this.$store.state.selectedLocation.coords.latitude, this.$store.state.selectedLocation.coords.longitude)
                setTimeout(() => {this.isLoading = false}, 1000)
            })
            .catch(error => {
                this.isLoading = false
                console.log(error);
                console.log(error.response.data);
            }) 
            return status
        },
        getPendingOrders(){
            this.isLoading = true
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            var status = true;
            this.api.create({
                method: 'POST',
                url: this.api.routes.getPendingOrders,
                headers: {'Content-Type':'application/json','Authorization':AuthStr},
            })
            .then(response => { 
                console.log(response.data.pendingOrders)
                this.pendingOrders = response.data.pendingOrders
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
                console.log(error);
            }) 
            return status
        },
        /* getCompletedTasks(){
             const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            var status = true;
            this.api.create({
                method: 'POST',
                url: this.api.routes.completedTasks,
                headers: {'Content-Type':'application/json','Authorization':AuthStr},
            })
            .then(response => { 
                console.log('Completed Task')
                this.completedTasks=response.data.completedTasks;
            })
            .catch(error => {
                console.log(error);
                console.log(error.response.data);
            }) 
            return status
        }, */
        _handleNotification(notification){
            console.log(notification)
            if(notification.actionIdentifier){
                if(notification.request.content.data.route=='Home'){
                    this.getRecentRequests()
                    this.getPendingOrders()
                } else {
                    this.navigation.navigate(notification.notification.request.content.data.route, notification.notification.request.content.data.params)
                }
            } else {
                if(notification.request.content.data.route=='Home'){
                    this.getRecentRequests()
                    this.getPendingOrders()
                } else {
                    this.navigation.navigate(notification.request.content.data.route, notification.request.content.data.params)
                }
            }
        },
    }
}
</script>
<style>
    .container{
        background-color: #F2F2F2;
        flex: 1;
    }
    .split-container{
        flex: 1;
        padding: 10;
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
        elevation: 2;
        margin-bottom: 12;
    }
    .section-header{
        flex-direction: row;
        align-items: center;
        padding-top: 5;
        justify-content: space-between;
        padding-bottom: 10;
    }
    .header-button{
        background-color: #26aa4a;
        padding-vertical:6;
        border-radius: 4;
        padding-horizontal: 12;
    }
    .header-button-text{
        color: #FFFFFF;
        font-size: 12
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
        margin-top: 6;
        width: 7.7;
        height: 10.0;
        resize-mode: contain;
    }
    .completed-head{
        color: #26aa4a;
        font-size: 14;
        font-family: Montserrat_SemiBold;
        margin-bottom: 15;
        /* margin-top: 15; */
    }
    .completed-order-row{
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        background-color: #FFFFFF;
        padding: 10;
        border-radius: 8;
        z-index: 99;
    }
    .completed-order-left{
        margin-right: 15;
        flex: 1;
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

    /*  */

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

    .pending-orders{
        background-color: #FFFFFF;
        border-radius: 8;
        elevation: 3;
        margin-bottom: 12;
    }

    .message-section{
        background-color: #ff1919;
        padding-horizontal: 15;
        padding-vertical: 3;
        border-bottom-left-radius: 8;
        border-bottom-right-radius: 8;
        align-items: center;
        justify-content: center;
        margin-top: -8;
        padding-top: 8;
    }
    .message-section-active{
        background-color: #26aa4a;
        padding-horizontal: 15;
        padding-vertical: 3;
        border-bottom-left-radius: 8;
        border-bottom-right-radius: 8;
        align-items: center;
        justify-content: center;
        margin-top: -8;
        padding-top: 8;
    }
    .message-section-text{
        font-size: 12;
        color: #FFFFFF;
        text-align: center;
    }

</style>