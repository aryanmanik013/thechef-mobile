import Config from '@/constants/Config'
import axios from 'axios';

var distanceInKm = ''
var timeDuration = ''
var storeWithTime = ''

function getGoogleDirectionKitchen (sourceLatitude, sourceLongitude, destinationLatitude, destinationLongitude, key) {
    var url = 'https://maps.googleapis.com/maps/api/directions/json?origin='+sourceLatitude+','+sourceLongitude+'&destination='+destinationLatitude+','+destinationLongitude+'&key='+Config.googleApiKey
    return axios.get(
        url
    )
    .then(response => {
        storeWithTime[key].kitchenDistanceInKm = response.data.routes ? parseFloat(response.data.routes[0].legs[0].distance.text) * 1.609344 : 0
        storeWithTime[key].kitchenTimeDuration = response.data.routes ? parseFloat(response.data.routes[0].legs[0].duration.text) : 0
        // console.log(storeWithTime)
    })
    .catch(error => {
        storeWithTime[key].kitchenDistanceInKm = 0
        storeWithTime[key].kitchenTimeDuration = 0
        console.log(error) 
    })
}
function getGoogleDirectionCustomer (sourceLatitude, sourceLongitude, destinationLatitude, destinationLongitude, key) {
    var url = 'https://maps.googleapis.com/maps/api/directions/json?origin='+sourceLatitude+','+sourceLongitude+'&destination='+destinationLatitude+','+destinationLongitude+'&key='+Config.googleApiKey
    return axios.get(
        url
    )
    .then(response => {
        storeWithTime[key].customerDistanceInKm = response.data.routes ? parseFloat(response.data.routes[0].legs[0].distance.text) * 1.609344 : 0
        storeWithTime[key].customerTimeDuration = response.data.routes ? parseFloat(response.data.routes[0].legs[0].duration.text) : 0
        // console.log(storeWithTime)
    })
    .catch(error => {
        storeWithTime[key].customerDistanceInKm = 0
        storeWithTime[key].customerTimeDuration = 0
        console.log(error) 
    })
}

function GeoDistanceTime(stores, sourceLatitude, sourceLongitude){
    storeWithTime = stores
    Object.keys(stores).map(key => {
        // console.log(sourceLatitude, sourceLongitude, stores[key].latitude, stores[key].longitude, key)
        getGoogleDirectionCustomer(
            sourceLatitude, sourceLongitude, stores[key].customerLatitude, stores[key].customerLongitude, key
        )
        .then((response) => {
            return response
        })
        .catch(error => {
            console.log("Request error: ", error)
        })
        getGoogleDirectionKitchen(
            sourceLatitude, sourceLongitude, stores[key].kitchenLatitude, stores[key].kitchenLongitude, key
        )
        .then((response) => {
            return response
        })
        .catch(error => {
            console.log("Request error: ", error)
        })
    })
    // console.log(storeWithTime)
    return storeWithTime
}

export default GeoDistanceTime