<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <nb-content>
            <image :source="require('../../../assets/images/background/login.png')" class="top-image" :style="{width:appConfig.width, height:appConfig.width*72/100}"/>
            <nb-view class="form-container">
                <nb-text class="field-label">Login</nb-text>
                <nb-item regular class="input-item">
                    <nb-input placeholder="Enter your Mobile Number" :on-change-text="(text)=>{mobile=text}" :defaultValue="mobile" class="input-field" keyboardType="phone-pad"/>
                </nb-item>
                <nb-text note :style="{textAlign:'left', alignSelf:'flex-start', color:'#e84a44',fontSize:12}" v-if="$v.mobile.$dirty && (!$v.mobile.required || $v.mobile.$invalid || errors.mobile)">{{errors.mobile!='' ? errors.mobile : ($v.mobile.required && !$v.mobile.$numeric) ? 'Mobile number entered is invalid' : 'Mobile field is required'}}</nb-text>

                <nb-button block :on-press="()=>login()" :style="{marginTop:22}"><nb-text>SUBMIT</nb-text></nb-button>
            </nb-view>
        </nb-content>
    </nb-container>
</template>

<script>
import { StackActions, NavigationActions } from 'react-navigation'
import { required, numeric, minLength, maxLength,email } from 'vuelidate/lib/validators'
export default {
    props: {
        navigation: { Object }
    },
    data() {
        return {
            prefix: '+91',
            countryCode: 'in',
            mobile: '',
            url:'',
            errors:{
                mobile: ''
            },
            isLoading: false
        }
    },
    validations:{
        mobile: {
            required,
            numeric,
            maxLength: maxLength(10),
            minLength: minLength(10)
        }
    },
    beforeMount() {
        if(this.$store.state.user.loggedIn){
            this.navigation.navigate('Home')
        }
    },
    methods: {
        login() {
            this.$v.$touch()
            if(!this.$v.$error){
                this.isLoading = true
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.login,
                    headers: { 'Content-Type': 'application/json' },
                    data:{phone:this.mobile,prefix:this.prefix}
                })
                .then(response => { 
                    console.log(response.data);
                    this.$store.commit('user/setUser', {
                        name : response.data.user.name,
                        email : response.data.user.email,
                        phone : response.data.user.phone,
                        phonePrefix:response.data.user.phone_prefix,
                        id : response.data.user.id,
                        loggedIn: false,
                        authentication : response.data.access_token,
                        availabilityStatus: response.data.user.availability_status,
                        verificationStatus : response.data.user.verification_status,
                        status : response.data.user.status,       
                        approvalStatus:  response.data.user.approval_status,
                    })
                    this.insertToken()
                    this.isLoading = false
                    this.navigation.navigate('ConfirmOTP',{mobile:this.phone,prefix:this.prefix,otp:response.data.verification_otp,url:this.url});  
                })
                .catch(error => {
                    this.isLoading = false
                    
                    console.log(error);
                    console.log(error.response.data);
                }) 
            } else {
                this.$v.$touch()
            }
        },
        insertToken(){
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication); 
            this.api.create({
                method: 'post',
                url: this.api.routes.insertToken,
                headers: { 'Authorization': AuthStr, 'Content-Type' :'application/json'},
                data: {
                    token:this.$store.state.token.token,
                },
            })
            .then(response => { 
                console.log(response.data);
            })
            .catch(error => {
                console.log(error.response.data)
            });
        },
    },
}
</script>

<style>
    .top-image{
        resize-mode: contain;
    }
    .input-item{
        height: 42;
        border-radius: 4;
        border-color: #e6e6e6;
        margin-bottom: 5;
    }
    .form-container{
        padding:30;
    }
    .field-label{
        margin-top: 30;
        margin-bottom: 20;
        font-size: 16;
        color: #000000;
        font-family: Montserrat_Bold;
    }
    .input-field{
        font-family: Montserrat_Medium;
        font-size: 12;
        color: #707070;
        height: 35;
    }  
</style>