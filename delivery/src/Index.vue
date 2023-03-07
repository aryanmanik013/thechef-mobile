<template>
    <root>
        <AppNavigator />
    </root>
</template>

<script>
    import { Root } from 'native-base'
    import Splash from '@/screens/Splash'
    import Sidebar from '@/components/layouts/Sidebar'
    import Home from '@/screens/Home'
    import Login from '@/screens/auth/Login'
    import ConfirmOTP from '@/screens/auth/ConfirmOTP'
    import Delivered from '@/screens/order/Delivered'
    import CompletedOrder from '@/screens/account/CompletedOrder'
    import DeliveryRequest from '@/screens/account/DeliveryRequest'
    import Payout from '@/screens/account/Payout'
    import DeliveryDetail from '@/screens/order/DeliveryDetail'
    import PickupDetail from '@/screens/order/PickupDetail'
    import Pickup from '@/screens/order/Pickup'
    import Delivery from '@/screens/order/Delivery'
    import Direction from '@/screens/order/Direction'
    import Earning from '@/screens/account/Earning'
    import Profile from '@/screens/account/Profile'
    import Help from '@/screens/account/Help'
    import RegisterProof from '@/screens/auth/register/Proof'
    import Register from '@/screens/auth/register/Index'
    import RegisterUpload from '@/screens/auth/register/FinalStep'
    import RegisterBank from '@/screens/auth/register/Bank'
    import Verification from '@/screens/auth/register/Verification'
    import Location from '@/screens/auth/register/Location'
    import Information from '@/screens/Information'
    
    import { createStackNavigator, createAppContainer, StackActions, NavigationActions, createDrawerNavigator, createSwitchNavigator } from 'react-navigation'
    
    const drawer =    createStackNavigator({Home,Information,Splash,ConfirmOTP,Login,Delivered,DeliveryDetail,PickupDetail,Direction,Earning,RegisterProof,Profile,Register,Pickup,Delivery,Location,RegisterUpload,RegisterBank,Verification,Help,Profile,CompletedOrder,Payout,DeliveryRequest},{ initialRouteName: 'Home',headerMode: 'none'})

    const drawerNavigator = createDrawerNavigator({
        drawer,
    },
    {
        initialRouteName: 'drawer',
        headerMode: 'float',
        drawerType: 'front',
        overlayColor: 0.5,
        drawerBackgroundColor: '#0d2a17',
        contentComponent: Sidebar
    })

    const authStackNavigator = createStackNavigator({ 
        Splash,
        drawerNavigator
    },
    {
        initialRouteName: 'drawerNavigator',
        headerMode: 'none',
    })

    const AppNavigator = createAppContainer(createSwitchNavigator({
            authStackNavigator: {
                screen: authStackNavigator
            },
            /* drawerNavigator: {
                screen: drawerNavigator
            }, */
        },
        { 
            initialRouteName : 'authStackNavigator'
        })
    )

    export default {
        components: {
            Root, AppNavigator
        },
    }
</script>