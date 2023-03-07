<template>
    <nb-view>
        <nb-header iosBarStyle="dark-content" :style="{backgroundColor:'transparent', border:'none', borderShadow:'none', elevation:0, width:'100%', height:55}">
            <nb-left :style="{flex:.2}">
                <nb-button transparent :on-press="() => {}" disabled v-if="navigation.state.routeName == 'Register' || navigation.state.routeName=='RegisterProof' || navigation.state.routeName=='RegisterBank' || navigation.state.routeName=='RegisterUpload'">
                    <!-- <nb-icon name="back" /> -->
                    <!-- <image :source="require('../../../assets/images/icons/chevron-left.png')" class="navigate-back" /> -->
                    <image :source="require('../../../assets/icon.png')" class="logo" />
                </nb-button>
                <nb-button transparent :on-press="() => { navigation.goBack() }" disabled v-else >
                    <!-- <nb-icon name="back" /> -->
                    <image :source="require('../../../assets/images/icons/chevron-left.png')" class="navigate-back" />
                    <!-- <image :source="require('../../../assets/icon.png')" class="logo" /> -->
                </nb-button>
            </nb-left>
            <nb-body class="center" :style="{flex:1}">
                <nb-title class="navigate-header-text">{{ headerTitle }}</nb-title>
            </nb-body>
            <!-- <nb-right class="center" v-if="registration" :style="{flex:.2, marginRight:10}"> -->
                <!-- <image :source="require('../../../assets/images/logo-w.png')" class="logo" /> -->
                <nb-button transparent :on-press="() => { navigateToLogin() }" class="button-home">
                    <image :source="require('../../../assets/images/icons/navigation/home.png')" class="home-icon" />
                    <nb-title class="button-home-text">Home</nb-title>
                </nb-button>
            <!-- </nb-right> -->
        </nb-header>
    </nb-view>
</template>
<script>
import { StackActions, NavigationActions } from 'react-navigation';
export default {
    props:{
        navigation: {
            type: Object,
            required :true
        }, 
        headerTitle: {
            type: String,
            required: false
        },
        registration: {
            type: Boolean,
            required: false
        }
    },
    methods: {
        navigateToLogin(){
            this.$store.commit('user/unsetUser');
            /* var routeCount = (this.navigation.dangerouslyGetParent().state.routes).length
            this.navigation.dispatch(StackActions.pop({n:routeCount-1})); */
            const resetAction = StackActions.reset({
                index: 0,
                key:'authStackNavigator',
                actions: [NavigationActions.navigate({ routeName: 'drawerNavigator' })]
            })
            this.navigation.dispatch(resetAction);
        }
    }
}
</script>
<style>
    .navigate-back{
        width:17;
        resizeMode:contain;
    }
    .header{
        height:50;
        background-color: transparent;
    }
    .navigate-header-text{
        font-size: 16;
        color: #364151;
        font-family: Montserrat_Bold;
    }
    .logo{
        width: 23.1;
        height: 38.2;
        resize-mode: contain;
    }
    .button-home{
        border-width: 1;
        border-color: #fcbe00;
        border-radius: 5;
        height: 30;
        padding-horizontal: 0;
    }
    .home-icon{
        height: 14;
        width: 14;
        resize-mode: contain;
    }
    .button-home-text{
        font-size: 12;
        color: #fcbe00;
        font-family: Montserrat_Medium;
    }
</style>