<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <nb-view class="header" padder :style="{marginTop: appConfig.platform==='ios'? statusBarHeight : 0}">
            <touchable-opacity :on-press="()=>home()" >
                <image class="header-close" :source="require('../../../assets/images/icons/close.png')"/>
            </touchable-opacity>
            <nb-text class="header-title">Delivery</nb-text>
        </nb-view>
        <nb-view class="container">
            <image class="delivered-image" :source="require('../../../assets/images/order/success.png')" />
            <nb-text class="delivered-text">Order Delivered</nb-text>
        </nb-view>
        <nb-button full :on-press="()=>home()"><nb-text class="status-text">BACK TO HOME</nb-text></nb-button>
    </nb-container>
</template>

<script>
import { StackActions, NavigationActions } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';
export default {
    props: {
        navigation: { Object }
    },
    data() {
        return {
            isLoading: false,
            statusBarHeight: getStatusBarHeight()
        }
    },
    methods:{
        home(){
            this.navigation.dispatch(StackActions.replace({routeName:'Home'}))
        }
    }
}
</script>

<style>
    .header{
        elevation: 2;
        background-color: #FFFFFF;
        flex-direction: row;
        align-items: center;
    }
    .header-close{
        height: 15.4;
        width: 15.4;
        resize-mode: contain;
        margin-right: 21;
    } 
    .header-title{
        color: #000000;
        font-family: Montserrat_Regular;
        font-size: 16;
    }
    .container{
        background-color: #fafafa;
        flex: 1;
        justify-content: center;
        align-content: center;
        align-items: center;
    }
    .delivered-image{
        height: 155.3;
        width: 196;
        resize-mode: contain;
        margin-bottom: 35;
    }
    .delivered-text{
        font-family: Montserrat_Medium;
        font-size: 26;
        color: #2c2b27;
    }

</style>