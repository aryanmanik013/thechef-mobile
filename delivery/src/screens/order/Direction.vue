<template>
    <nb-container>
        <header-with-nav :navigation="navigation" headerName="Direction Map" />
        <nb-view class="container">
            <MapView
                :initialRegion="{
                    latitude: $store.state.selectedLocation.coords.latitude,
                    longitude: $store.state.selectedLocation.coords.longitude,
                    latitudeDelta: 0.00222,
                    longitudeDelta: 0.00121,
                }"
                :style="{width:'100%',height:'100%'}">
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
                    :origin=kitchen
                    :destination=customer
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
                        distance=result.distance +' km';
                        duration=result.duration +' min';
                    }"
                />
            </MapView>
        </nb-view>
    </nb-container>
</template>
<script>
import MapView,{Marker} from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
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
            kitchen: {
                 latitude:parseFloat(this.navigation.state.params.kitchenlatitude) , 
                longitude:parseFloat(this.navigation.state.params.kitchenlongitude)  
            },
            deliveryBoy:{ 
                latitude: this.$store.state.selectedLocation.coords.latitude,
                longitude: this.$store.state.selectedLocation.coords.longitude 
            },
            customer: {
                latitude:parseFloat(this.navigation.state.params.customerlatitude) , 
                longitude:parseFloat(this.navigation.state.params.customerlongitude) 
            }
        
        }
    },
    beforeMount()
    {
        this.googleApiKey = this.appConfig.googleApiKey
    },
}
</script>

<style>
    
</style>