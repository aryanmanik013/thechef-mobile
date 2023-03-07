<template>
    <nb-container>
    <nb-content class="sidebar-content-wrapper" :bounces="false" :style="{paddingLeft:15, paddingRight:15}">
      <nb-view :style="{marginTop:20, marginBottom:25,}">
          <image :source="image ? {uri:image} :require('../../../assets/images/icons/delivery.png')" class="profile-image" />
          <nb-text class="profile-name">{{ $store.state.user.username }}</nb-text>
          <nb-text class="profile-id">ID: {{ $store.state.user.userId }}</nb-text>
          <nb-view class="duty-status">
            <nb-text class="duty-status-text">Duty Status</nb-text>
            <nb-switch v-if="getStatus" :value="updateStatus == true ? true : false" :trackColor="{true: '#32b546', false: 'grey'}" thumbColor='#FFFFFF' :on-change="()=>updateAvailabilityStatus()" />
          </nb-view>
      </nb-view>
      <nb-list>
        <nb-list-item v-for="data in datas" :key="data.route=='Information'?data.route+Math.random():data.route" button noBorder :onPress="() => handleListItemClick(data)" :style="{marginLeft:5}">
          <nb-left>
            <image :source="data.icon" :style="{width:20,height:20,marginRight:8, resizeMode:'contain', tintColor:'#040505'}"/>
            <nb-text :style="{ color: '#000000', fontSize:14 }">
              {{ data.name }}
            </nb-text>
          </nb-left>
          <nb-right v-if="data.types" :style="{ flex: 1 }">
            <nb-badge
              class="list-item-badge-container"
              :style="{ backgroundColor: data.bg }"
            >
              <nb-text
                class="list-item-badge-text"
                :style="stylesObj.badgeText"
              >
                {{ `${data.types} ` }}
              </nb-text>
            </nb-badge>
          </nb-right>
        </nb-list-item>
      </nb-list>
      
    </nb-content>
    <!-- <nb-view :style="{backgroundColor:'#0d2a17',padding:5, paddingLeft:10, paddingRight:10, alignItems:'center', borderTopWidth:1, borderTopColor:'#424242'}">
      <nb-text note :style="{fontSize:13}">App developed by</nb-text>
      <touchable-opacity :on-press="openUrl">
        <nb-text note :style="{color:'#000000', fontFamily:'Proxima_nova_regular'}">TNM Online Solutions</nb-text>
      </touchable-opacity>
    </nb-view> -->
  </nb-container>
</template>

<script>
import { Dimensions, Platform, Linking } from "react-native";
import { StackActions, NavigationActions } from 'react-navigation';
import profile from '../../../assets/images/icons/account.png'
import earnings from '../../../assets/images/icons/earnings.png'
import order from '../../../assets/images/icons/order.png'
import help from '../../../assets/images/icons/info.png'
import logout from '../../../assets/images/icons/logout.png'
import payout from '../../../assets/images/icons/payout.png'
import deliveryRequest from '../../../assets/images/icons/delivery-request.png'
import { Toast } from 'native-base'
import * as TaskManager from 'expo-task-manager'
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  props: {
    navigation: {
      type: Object
    }
  },
  data() {
    return {
      /* drawerCover,
      drawerImage, */
      id:this.$store.state.user.userId,
      name:this.$store.state.user.username,
      image:this.$store.state.user.image,
      updateStatus:'',
      stylesObj: {
        drawerCoverObj: {
          height: deviceHeight / 3.5
        },
        drawerImageObj: {
          left: Platform.OS === "android" ? deviceWidth / 10 : deviceWidth / 9,
          top:
            Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
          resizeMode: "cover"
        },
        badgeText: {
          fontSize: Platform.OS === "android" ? 11 : 12,
          marginTop: Platform.OS === "android" ? 0 : 0,
          fontWeight: "400"
        }
      },
      datas: [
        {
          name: "Profile",
          route: "Profile",
          icon: profile,
          bg: "#FFFFFF"
        },
        {
          name: "Delivered Orders",
          route: "CompletedOrder",
          icon: order,
          bg: "#FFFFFF",
        },
        {
          name: "Delivery Requests",
          route: "DeliveryRequest",
          icon: deliveryRequest,
          bg: "#FFFFFF",
        },
        {
          name: "Earnings & Incentives ",
          route: "Earning",
          icon: earnings,
          bg: "#FFFFFF",
        },
        {
          name: "Payouts",
          route: "Payout",
          icon: payout,
          bg: "#FFFFFF",
        },
        {
          name: "Help",
          route: "Help",
          icon: help,
          bg: "#FFFFFF"
        },
        {
          name: "Logout",
          route: "Logout",
          icon: logout,
          bg: "#FFFFFF",
        }
      ]
    };
  },
  beforeMount(){
    // console.log(this.datas)
  },
  methods: {
     updateAvailabilityStatus(){
          var status = true;
          this.updateStatus=!this.updateStatus
             const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
          this.api.create({
              method: 'POST',
              url: this.api.routes.updateStatus,
              headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
          })
          .then(response => { 
              this.updateStatus=response.data.status;
              this.$store.commit('user/setAvailabilityStatus', response.data.status)
            console.log(response.data.status);
            Toast.show({
                  text: "Status Updated",
                  duration : 3000
              });
          })
          .catch(error => {
              console.log(error.response.data);  
          }) 
        return status
    },
    handleListItemClick(dataObj) {
      // console.log(dataObj.route);
      if(dataObj.route == 'Logout'){
        this.Logout()
      }else {
        this.navigation.navigate(dataObj.route);
      }
      // console.log(dataObj.route);
    },
    openUrl(){
      // let mailto = 'mailto:'+ (this.$store.state.user.branch.contact_email?this.$store.state.user.branch.contact_email:this.$store.state.user.branch.email) +'?subject=Customer Support Query'
      // // console.log(mailto)
      Linking.openURL('https://tnmonlinesolutions.com');
    },
    Logout(){
        this.$store.commit('user/unsetUser');
        const resetAction = StackActions.reset({
            index: 0,
            key:'authStackNavigator',
            actions: [NavigationActions.navigate({ routeName: 'Login' })]
        })
        this.navigation.dispatch(resetAction);
    },
    signIn(){
        this.navigation.navigate('Login');
    }
  },
  computed:{
    getStatus(){
      if(this.$store.state.user.loggedIn){
        var status = true;
        const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
        this.api.create({
            method: 'POST',
            url: this.api.routes.getStatus,
            headers: { 'Content-Type': 'application/json','Authorization':AuthStr  },
        })
        .then(response => { 
            console.log(response.data); 
            this.updateStatus=response.data.status; 
        })
        .catch(error => {
            console.log(error.response.data);  
        }) 
        return status
      }
    },
  }
};
</script>

<style>
.sidebar-content-wrapper {
  flex: 1;
  background-color:#FFFFFF;
}
.drawer-cover {
  flex: 1;
  align-self: stretch;
  position: relative;
  margin-bottom: 10;
}
.drawer-image {
  align-self: center;
  position: absolute;
  height: 75;
  width: 210;
}
.list-item-badge-container {
  border-radius: 30;
  justify-content:center;
  align-items: center;
  height: 25;
  width: 25;
  padding-left:2;
  padding-right:1;
}
.list-item-badge-text {
  color: #FFFFFF;
  align-self: center;
  text-align: center;
  margin: 0;
}
.profile-image{
  width: 53;
  height: 53;
  border-radius: 60;
  resize-mode: contain;
  margin-bottom: 15;
}
.profile-name{
  font-family: Montserrat_Medium;
  color: #000000;
  font-size: 16;
}
.profile-id{
  font-family: Montserrat_Regular;
  color: #000000;
  font-size: 12;
}
.duty-status{
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 30;
}
.duty-status-text{
  font-family: Montserrat_Regular;
  color: #000000;
  font-size: 14;
}
</style>