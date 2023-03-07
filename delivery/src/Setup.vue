<template>
    <view class="container">
        <!-- <app-loading v-if="!isAppReady && !isCrashed && !isNetworkConnected"> </app-loading> -->
        <image-background :source="require('../assets/splash.png')" class="splash-container" v-if="!isAppReady || !isLocationLoaded"></image-background>
        <app v-if="isAppReady && !isCrashed && isNetworkConnected && isLocationLoaded" :notification="notification"></app>
        <nb-button v-if="!isNetworkConnected"><nb-text>No Internet Connection</nb-text></nb-button>
        <nb-button v-if="isCrashed"><nb-text>RETRY</nb-text></nb-button>
    </view>
</template>

<script>
    import Vue from "vue-native-core"
    import { VueNativeBase } from "native-base"
    import { Input } from "native-base"
    import { AppState, Platform, StatusBar, LogBox } from 'react-native'
    import NetInfo from "@react-native-community/netinfo";
    import { Toast } from 'native-base' 
    import * as Font from "expo-font";
    import * as Permissions from 'expo-permissions'
    import * as Location from 'expo-location'
    import * as Notifications from 'expo-notifications'
    // import AppLoading from 'expo-app-loading'
    import Constants from 'expo-constants'
    import appConfig from '@/constants/Config'
    import store from '@/store'
    import App from '@/Index'
    import HeaderWithNav from '@/components/layouts/HeaderWithNav'
    import Header from '@/components/layouts/Header'
    import Footer from '@/components/layouts/Footer'
    import StarRating from 'react-native-star-rating'
    import InputSpinner from "react-native-input-spinner"
    import Modal from 'react-native-modal'
    import RBSheet from "react-native-raw-bottom-sheet"
    import Geocoder from 'react-native-geocoding'
    import api from '@/constants/Api'
    import HTML from 'react-native-render-html'
    import Vuelidate from 'vuelidate'
    import InputWithError from '@/components/InputWithError'
    import distance from '@/plugins/GeoDistance'
    import distanceTime from '@/plugins/GeoDistanceTime'
    import distanceTimeBulk from '@/plugins/GeoDistanceTimeBulk'
    import Spinner from 'react-native-loading-spinner-overlay'
    import * as TaskManager from 'expo-task-manager'

    Vue.use(VueNativeBase)
    Vue.use(Vuelidate)

    Vue.component('HeaderWithNav', HeaderWithNav)
    Vue.component('Header', Header)
    Vue.component('Footer', Footer)
    Vue.component('StarRating', StarRating)
    Vue.component('InputSpinner', InputSpinner)
    Vue.component('Modal', Modal)
    Vue.component('RBSheet', RBSheet)
    Vue.component('HTML', HTML)
    Vue.component('InputWithError', InputWithError)
    Vue.component('Spinner', Spinner)

    Vue.prototype.geoDistance = distanceTime; 
    Vue.prototype.geoDistanceBulk = distanceTimeBulk; 
    Vue.prototype.api = api;
    Vue.prototype.$store = store;
    Vue.prototype.appConfig = appConfig;

    export default {
        components: { App, StatusBar },
        data() {
            return {
                isAppReady: false,
                isCrashed: false,
                notification: '',
                isNetworkConnected: false,
                isLocationLoaded: false
            };
        },
        props:{ 
            navigation: { type: Object }
        },
        created() {
            NetInfo.addEventListener(network => {
                if(network.isConnected){
                    this.isNetworkConnected = true
                } else {
                    this.isNetworkConnected = false
                }
            }); 
        },
        mounted(){
            /* Input.defaultProps.autoCapitalize = 'none';
            Input.defaultProps.autoCorrect = false;
            Input.defaultProps.autoComplete = 'off';
            Input.defaultProps.autoCompleteType = 'off';
            Input.defaultProps.textContentType = 'none';
            Input.defaultProps.importantForAutofill = 'yesExcludeDescendants'; */

            
            TaskManager.defineTask('the_chef_background_location', ({ data, error }) => {
                if (error) {
                    // Error occurred - check `error.message` for more details.
                    alert(error.message)
                    return;
                }
                if (data) {
                    const { locations } = data;
                    console.log(locations)
                    if(store.state.user.loggedIn && store.state.user.availabilityStatus){
                        this.locataionUpdate(locations.coords)
                    }
                    // do something with the locations captured in the background
                }
            });
        },
        beforeMount(){
            Geocoder.init(this.appConfig.googleApiKey)
            this.loadFonts();
            this.registerForPushNotificationsAsync()
            if(store.state.splash){
                this.isLocationLoaded = true
            } else {
                this.getLocationAsync()
            }
            // this.backgroundLocationFetch()
        },
                
        methods: {
            async loadFonts() {
                try {
                    this.isAppReady = false;
                    await Font.loadAsync({
                        Montserrat_Regular: require("../assets/fonts/Montserrat-Regular.ttf"),
                        Montserrat_Medium: require("../assets/fonts/Montserrat-Medium.ttf"),
                        Montserrat_SemiBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
                        Montserrat_Bold: require("../assets/fonts/Montserrat-Bold.ttf"),
                        Montserrat_ExtraBold: require("../assets/fonts/Montserrat-ExtraBold.ttf"),
                    });
                    this.isAppReady = true;
                } catch (error) {
                    console.log("some error occured", error);
                    this.isAppReady = false;
                    this.isCrashed = true;
                }
            },
            async registerForPushNotificationsAsync(){
                try{
                    if (!store.state.token){
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
                            store.commit('setToken', {
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
            async getLocationAsync(){
                const status = await Permissions.askAsync(Permissions.LOCATION);
                if(status.status !== 'granted' && status.status !== 'denied'){
                    Toast.show({ text: 'Permission to access location was denied.', duration: 3000 });
                }
                await Location.watchPositionAsync(
                {
                    enableHighAccuracy: true,
                    distanceInterval: 10,
                    timeInterval: 30000
                }, 
                newLocation => {
                    // console.log('newLocation');
                    let coords = newLocation.coords;
                    Geocoder.from(
                        parseFloat(coords.latitude),parseFloat(coords.longitude)
                    )
                    .then(json => {
                        var formatted_address = json.results[0].formatted_address;
                        var address_components=json.results[0].address_components;
                        var addressComponents = {};
                        address_components.forEach(component => {
                            var title= component.types[0]
                            addressComponents[title] = component.long_name;
                              if(title == 'country'){
                                 addressComponents[title+'_short'] = component.short_name;
                            }
                            if(title =='administrative_area_level_1'){
                                 addressComponents[title+'_short'] = component.short_name;
                            }
                        });
                        var formattedAddress = formatted_address.split(",")
                        var addressTitle= formattedAddress[0]
                        formattedAddress = formattedAddress.slice(1)
                        var addressSubtitle = formattedAddress.join(',')
                        store.commit('setSelectedLocation', {
                            addressComponents:addressComponents,
                            address:formatted_address,
                            addressTitle: addressTitle,
                            addressSubtitle: addressSubtitle,
                            coords: coords
                        })
                        console.log(coords)
                        this.isLocationLoaded = true
                        if(store.state.user.loggedIn){
                            this.locataionUpdate(coords)
                        }
                    })
                    .catch(error => 
                        console.warn(error)
                    );
                }, error => console.log(error))

                /* await Location.getCurrentPositionAsync(
                {
                    accuracy: 6
                })
                .then((newLocation) => {
                    let coords = newLocation.coords
                    Geocoder.from(
                        parseFloat(coords.latitude),parseFloat(coords.longitude)
                    )
                    .then(json => {
                        var formatted_address = json.results[0].formatted_address;
                        var address_components=json.results[0].address_components;
                        var addressComponents = {};
                        address_components.forEach(component => {
                            var title= component.types[0]
                            addressComponents[title] = component.long_name;
                            if(component.types[0]=='country'){
                                addressComponents['countryCode'] = component.short_name
                            }
                        });
                        var formattedAddress = formatted_address.split(",")
                        var addressTitle= formattedAddress[0]
                        formattedAddress = formattedAddress.slice(1)
                        var addressSubtitle = formattedAddress.join(',')
                        store.commit('setSelectedLocation', {
                            addressComponents:addressComponents,
                            address:formatted_address,
                            addressTitle: addressTitle,
                            addressSubtitle: addressSubtitle,
                            country: addressComponents.country ? addressComponents.country : '',
                            countryCode: addressComponents.countryCode ? addressComponents.countryCode : '',
                            coords: coords
                        })
                        this.isLocationReady = true
                    })
                    .catch(error => 
                        console.warn(error)
                    );
                }) */
            },
            locataionUpdate(coords){
                console.log(coords)
                const AuthStr = 'Bearer '.concat(store.state.user.authentication);
                api.create({
                    method: 'POST',
                    url: api.routes.updateLocation,
                    headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
                    data: coords
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(error => {
                    console.log(error.response.data);
                }) 
            },
            /* async backgroundLocationFetch(){
                const { status } = await Permissions.askAsync(Permissions.LOCATION);
                if (status === 'granted') {
                    await Location.startLocationUpdatesAsync('the_chef_background_location', {
                        accuracy: Location.Accuracy.Balanced,
                        // enableHighAccuracy: true,
                        // distanceInterval: 1000,
                        timeInterval: 30000
                    });
                }
            } */
        }
    }   
</script>
<style>
    .container {
        flex: 1;
    }
</style>
