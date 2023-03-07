<template>
    <nb-view>
        <nb-header iosBarStyle="dark-content" class="header">
            <nb-left class="center">
                <nb-button v-if="!headerName" transparent :on-press="toggleDrawer">
                    <!-- <nb-icon name="menu" /> -->
                    <image :source="require('../../../assets/images/icons/menu.png')" :style="{width:22,height:15.1, resizeMode:'contain'}"/>
                </nb-button>
                <nb-button v-else-if="headerName" transparent :on-press="goBack">
                 <image :source="require('../../../assets/images/icons/chevron-left.png')" :style="{width:9.6,height:17.5, marginLeft:5}"/>
                </nb-button>
            </nb-left>
            <nb-body class="header-body">
                <nb-title v-if="headerName" class="header-title">{{ headerName }}</nb-title>
                <!-- <image v-else :source="require('../../../assets/logo.png')" :style="{height:30, resizeMode:'contain'}" /> -->
            </nb-body>
            <nb-right class="header-right" v-if="!headerName">
                <!-- <nb-button vertical badge transparent :on-press="() => {}" class="header-notification">
                    <nb-badge v-if="$store.state.notification" :style="{alignSelf:'flex-end', backgroundColor:'red', zIndex:1, marginBottom:-5, paddingLeft:0, paddingRight:0,justifyContent:'center', height:7, width:7}" />
                    <image :source="require('../../../assets/images/icons/notification.png')" :style="{width:17.7,height:18.7, marginLeft:5}"/>
                </nb-button> -->
                <nb-button vertical badge transparent :on-press="() => { navigation.navigate('Help') }" class="header-help">
                    <image class="header-help-icon" :source="require('../../../assets/images/icons/help.png')"/>
                </nb-button>
            </nb-right>
        </nb-header>
    </nb-view>
</template>

<script>
    import { DrawerActions } from 'react-navigation-drawer'
    import { StackActions, NavigationActions } from 'react-navigation';
    export default {
        props: {
            navigation: {
                type: Object,
                required :true
            }, 
            headerName: {
                type: String,
                required: false
            }
        },
        data: function (){
            return {
                drawerAction: 'drawer',
                drawerRoute: '',
                draweRouteParams: '',
                navigateBack: false
            }
        },
        methods: {
            toggleDrawer(){
                this.navigation.dispatch(DrawerActions.toggleDrawer())
            },
            gotoPage(routeName){
                this.navigation.dispatch(StackActions.replace({ routeName: routeName} ))
            },
            goBack(){
                if(this.navigateBack){
                    this.navigation.goBack()
                } else {
                    console.log(this.drawerRoute)
                    this.navigation.dispatch(StackActions.replace({ routeName: this.drawerRoute, params: this.draweRouteParams }));
                }
            }
        },
        beforeMount(){
            var navigation = this.navigation.dangerouslyGetParent()
            var routeLength = navigation.state.routes.length
            // console.log( navigation.state.routes[routeLength-3])
            if(routeLength > 1) {
                this.drawerAction = 'back' 
                /* if(navigation.state.routes[routeLength-1].routeName == 'Cart' && navigation.state.routes[routeLength-2].routeName == 'MenuOption'){
                    this.drawerRoute = navigation.state.routes[routeLength-3].routeName
                    this.draweRouteParams = navigation.state.routes[routeLength-3].params
                } else {
                    this.navigateBack = true
                } */
                this.navigateBack = true

            }
        }
    }
</script>

<style>
    .header-body{
        flex:1
    }
    .header-right{
        flex:0
    }
    .header{
        background-color: #FFFFFF;
        height: 50;
        elevation: 3;
    }
    .header-title{
        font-family: Montserrat_Medium;
        font-size: 14;
        color: #000000;

    }
    .header-help-icon{
        width: 19.1;
        height: 19.1;
        resize-mode: contain;
    }
    .logo{
        width: 23.1;
        height: 38.2;
        resize-mode: contain;
    }
</style>