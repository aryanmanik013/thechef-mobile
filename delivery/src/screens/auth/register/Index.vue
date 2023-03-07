<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" headerName="Registration" headerTitle="Registration" :registration=true />
        <nb-content padder>
            <MapView 
                :zoomEnabled="false"
                :scrollEnabled="false"
                :initialRegion="{
                    latitude: $store.state.selectedLocation.coords.latitude,
                    longitude: $store.state.selectedLocation.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }"
                :region=region
                provider="google"
                :style="{width:'100%',height:150, borderRadius:4, marginBottom:10}"
                :on-press="()=>{navigation.navigate('Location')}"
            >
                <Marker
                    :coordinate="{
                        'latitude' : $store.state.selectedLocation.coords.latitude,
                        'longitude' : $store.state.selectedLocation.coords.longitude
                    }"
                />
            </MapView>
            <nb-item regular :class="$v.form.name.$dirty && (!$v.form.name.required || errors.name) ?'input-item-error':'input-item'">
                <nb-input :on-change-text="(text)=>{form.name=text}" :defaultValue="form.name" placeholder="Name" :on-blur="() => $v.form.name.$touch()" />
            </nb-item>
            <nb-text v-if="errors.name" :style="{color:'red',fontSize:12}">{{errors.name}}</nb-text>
            <nb-item regular :class="$v.form.email.$dirty && (!$v.form.email.required || $v.form.email.$invalid || errors.email) ?'input-item-error':'input-item'" >
                <nb-input :on-change-text="(text)=>{form.email=text}" :defaultValue="form.email" placeholder="Email Address" :on-blur="() => {$v.form.email.$touch()
                    console.log($v.form.email)}" />
            </nb-item>
            <nb-text v-if="errors.email" :style="{color:'red',fontSize:12}">{{errors.email}}</nb-text>
            <nb-item regular class="input-item">
                <nb-input v-model="form.phone" keyboardType="phone-pad" :editable="false" placeholder="Phone"/>
            </nb-item>
            <nb-item regular :class="$v.form.addressLine1.$dirty && (!$v.form.addressLine1.required || errors.addressLine1) ?'input-item-error':'input-item'">
                <nb-input :on-change-text="(text)=>{form.addressLine1=text}" :defaultValue="form.addressLine1" placeholder="Address Line 1" :on-blur="() => $v.form.addressLine1.$touch()"/>
            </nb-item>
            <nb-text v-if="errors.addressLine1" :style="{color:'red',fontSize:12}">{{errors.addressLine1}}</nb-text>
            <nb-item regular :class="$v.form.addressLine2.$dirty && (!$v.form.addressLine2.required || errors.addressLine2) ?'input-item-error':'input-item'">
                <nb-input :on-change-text="(text)=>{form.addressLine2=text}" :defaultValue="form.addressLine2" placeholder="Address Line 2" :on-blur="() => $v.form.addressLine2.$touch()"/>
            </nb-item>
            <nb-text v-if="errors.addressLine2" :style="{color:'red',fontSize:12}">{{errors.addressLine2}}</nb-text>
            <nb-item regular :class="$v.form.streetName.$dirty && (!$v.form.streetName.required || errors.streetName) ?'input-item-error':'input-item'" >
                <nb-input :on-change-text="(text)=>{form.streetName=text}" :defaultValue="form.streetName" placeholder="Street Name" :on-blur="() => $v.form.streetName.$touch()"/>
            </nb-item>
            <nb-text v-if="errors.streetName" :style="{color:'red',fontSize:12}">{{errors.streetName}}</nb-text>
            <nb-item regular :class="$v.form.landmark.$dirty && (!$v.form.landmark.required || errors.landmark) ?'input-item-error':'input-item'">
                <nb-input :on-change-text="(text)=>{form.landmark=text}" :defaultValue="form.landmark" placeholder="Landmark" :on-blur="() => $v.form.landmark.$touch()"/>
            </nb-item>
            <nb-text v-if="errors.landmark" :style="{color:'red',fontSize:12}">{{errors.landmark}}</nb-text>
            <nb-item regular :class="$v.form.country.$dirty && (!$v.form.country.required || errors.country) ?'input-item-error':'input-item'" >
                <nb-input :editable="false" v-model="form.country" placeholder="Country" :on-blur="() => $v.form.country.$touch()"/>
            </nb-item>
            <nb-text v-if="errors.country" :style="{color:'red',fontSize:12}">{{errors.country}}</nb-text>
             <nb-item regular :class="$v.form.state.$dirty && (!$v.form.state.required || errors.state) ?'input-item-error':'input-item'" >
                <nb-input :editable="false" v-model="form.state" placeholder="State" :on-blur="() => $v.form.state.$touch()"/>
            </nb-item>
            <nb-text v-if="errors.state" :style="{color:'red',fontSize:12}">{{errors.state}}</nb-text>
            <nb-item regular :class="$v.form.city.$dirty && (!$v.form.city.required || errors.city) ?'input-item-error':'input-item'" > 
                <nb-input :on-change-text="(text)=>{form.city=text}" :defaultValue="form.city" placeholder="City" :on-blur="() => $v.form.city.$touch()"/>
            </nb-item>
            <nb-text v-if="errors.city" :style="{color:'red',fontSize:12}">{{errors.city}}</nb-text>
            <nb-item regular  :class="$v.form.pincode.$dirty && (!$v.form.pincode.required || $v.form.pincode.$invalid || errors.pincode) ?'input-item-error':'input-item'">
                <nb-input :on-change-text="(text)=>{form.pincode=text}" :defaultValue="form.pincode" keyboardType="phone-pad" placeholder="Pincode" :on-blur="() => $v.form.pincode.$touch()"/>
            </nb-item>
            <nb-text v-if="errors.pincode" :style="{color:'red',fontSize:12}">{{errors.pincode}}</nb-text>
            <nb-button block rounded class="button-next" :on-press="()=>register()">
                <nb-text>Next</nb-text>
            </nb-button>
        </nb-content>
    </nb-container>
</template>

<script>
import { Toast } from 'native-base'
import { required,minLength,email,numeric } from 'vuelidate/lib/validators'
import MapView, {Marker} from 'react-native-maps'
import Geocoder from 'react-native-geocoding'
import Constants from 'expo-constants'

export default {
     state : { 
            region: {},
        },
    props: {
        navigation: { Object } 
    },
    components: {
        MapView,Marker
    },
    data() {
        return {
            marker: {
                latitude: this.$store.state.selectedLocation.coords.latitude,
                longitude: this.$store.state.selectedLocation.coords.longitude,
            },
            region:{ 
                latitude:this.$store.state.selectedLocation.coords.latitude,
                longitude:  this.$store.state.selectedLocation.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            form: { 
                name:'',
                email:'',
                phone:this.$store.state.user.phone,
                addressLine1:'',
                addressLine2:'',
                streetName:'',
                landmark:'',
                country:'',
                state:'',
                city:'',
                pincode:'',
                latitude: this.$store.state.selectedLocation.coords.latitude,
                longitude: this.$store.state.selectedLocation.coords.longitude,
                country:'',
                state:''
            },
           errors:{ 
                name:'',
                email:'',
                addressLine1:'',
                addressLine2:'',
                streetName:'',
                landmark:'',
                country:'',
                state:'',
                city:'',
                pincode:'',
                country:'',
                state:''
            },
            isLoading: false
        }
    },
    validations:{
        form: {
            name:{
                required,
            },
            email:{
                required,
                email
            },
            phone:{
                required,
            },
            addressLine1:{
                required,
            },
            addressLine2:{
                required,
            },
            streetName:{
                required,
            },
            landmark:{
                required,
            },
            country:{
                required,
            },
            state:{
                required,
            },
            city:{
                required,
            },
            pincode:{
                required,
                numeric
            },
            latitude:{
                required,
            },
            longitude:{
                required,
            },
        }
    },
    beforeMount() {
        if(this.$store.state.selectedLocation){
            this.form.pincode = this.$store.state.selectedLocation.addressComponents.postal_code ? this.$store.state.selectedLocation.addressComponents.postal_code : ''
            this.form.state = this.$store.state.selectedLocation.addressComponents.administrative_area_level_1 ? this.$store.state.selectedLocation.addressComponents.administrative_area_level_1 : ''
            this.form.country = this.$store.state.selectedLocation.addressComponents.country ? this.$store.state.selectedLocation.addressComponents.country : ''
            this.form.streetName = this.$store.state.selectedLocation.addressComponents.neighborhood ? this.$store.state.selectedLocation.addressComponents.neighborhood : ''
            this.form.landmark = this.$store.state.selectedLocation.addressComponents.political ? this.$store.state.selectedLocation.addressComponents.political : ''
            this.state = this.$store.state.selectedLocation.addressComponents.administrative_area_level_1_short ? this.$store.state.selectedLocation.addressComponents.administrative_area_level_1_short : ''
            this.country = this.$store.state.selectedLocation.addressComponents.country_short ? this.$store.state.selectedLocation.addressComponents.country_short : ''
            this.latitude= this.$store.state.selectedLocation.coords.latitude ? this.$store.state.selectedLocation.coords.latitude : ''
            this.longitude= this.$store.state.selectedLocation.coords.longitude ? this.$store.state.selectedLocation.coords.longitude : ''
        }
    },
    methods: {
        register() {
            for (const key in this.errors) {
                if (this.errors.hasOwnProperty(key)) {
                    this.errors[key]= '';
                }
            }
            this.$v.form.$touch()
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            if(!this.$v.form.required) {
                this.isLoading = true
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.register,
                    data:{
                        name:this.form.name,
                        email:this.form.email,
                        phone:this.form.phone,
                        delivery:this.form.delivery,
                        addressLine1:this.form.addressLine1,
                        addressLine2:this.form.addressLine2,
                        streetName:this.form.streetName,
                        landmark:this.form.landmark,
                        country:this.country,
                        state:this.state,
                        city:this.form.city,
                        pincode:this.form.pincode,
                        latitude:this.form.latitude,
                        longitude:this.form.longitude
                    },
                    headers: {'Content-Type': 'application/json','Authorization':AuthStr},    
                })
                .then(response => { 
                    this.$store.commit('user/setProfile', {
                        name : response.data.deliveryPartner.name,
                        email : response.data.deliveryPartner.email,
                        phone : response.data.deliveryPartner.phone,
                        id : response.data.deliveryPartner.id,
                    })
                    Toast.show({
                       text: "Registration successfull",
                       duration : 3000
                   });
                   this.isLoading = false
                   this.navigation.navigate('RegisterProof')
                })
                .catch(error => {
                    for (const key in error.response.data.errors) {
                        if (error.response.data.errors.hasOwnProperty(key)) {
                            this.errors[key]= error.response.data.errors[key][0];
                        }
                    }
                    this.isLoading = false       
                }) 
            } else {
                console.log('else case')
                this.$v.form.$touch()
            }
        },
    },
}
</script>

<style>
    .input-item{
        border-radius: 4;
        border-color: #d1d1d1;
        height: 45;
        flex: 1;
        margin-top: 10;
    }
    .row-split{
        flex-direction: row;
        justify-content: space-evenly;
    }
    .button-next{
        margin-top: 25;
    }
    .input-item-error{
        border-radius: 4;
        border-color: #e94444;
        height: 45;
        flex: 1;
        margin-top: 10;
    }
</style>