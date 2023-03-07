<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <nb-content>
            <image :source="require('../../../assets/images/background/confirm-otp.png')" class="top-image"/>
            <nb-view class="container">
                <nb-text class="head-title">ENTER OTP</nb-text>
                <nb-text class="head-subtitle">We have sent you an access code Via  SMS to your registered mobile number  </nb-text>
                <OTPInputView
                    :style="{width: '80%', height: 45, maxWidth:220, marginBottom:50}"
                    :pinCount=4
                    :autoFocusOnLoad="false"
                    :codeInputFieldStyle="{width: 40, height: 45, borderWidth: 0, borderBottomWidth: 2,fontSize:22, fontFamily:'Montserrat_Medium', color:'#1a1a1a'}"
                    :codeInputHighlightStyle="{borderColor: '#464646', borderBottomWidth:2}"
                    :onCodeFilled="(code)  => { 
                        otp = code
                        
                    }"
                />
                <nb-text :style="{color:'red',fontSize:14,alignSelf:'flex-start'}" v-if="errors.otp">{{ errors.otp }}</nb-text>
                <nb-button block :on-press="()=>verifyOTP()"><nb-text>SUBMIT</nb-text></nb-button>
                <nb-view class="resend">
                    <nb-text class="resend-text">Didn't received the code? </nb-text>
                    <touchable-opacity :on-press="resendOTP"><nb-text class="resend-button-text">Resend</nb-text></touchable-opacity>
                </nb-view>
            </nb-view>
        </nb-content>
    </nb-container>
</template>

<script>
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { StackActions, NavigationActions } from 'react-navigation'
import { Toast } from 'native-base'
export default {
    props: {
        navigation: { Object }
    },
    components: {
        OTPInputView
    },
    data() {
        return {
            otp: '',
            otpSend: this.navigation.state.params.otp,
            phone: this.navigation.state.params.mobile,
            prefix:this.navigation.state.params.prefix,
            url:this.navigation.state.params.url,
            errors:{
                otp: ''
            },
            isLoading: false
        }
    },
     methods: {
        verifyOTP(){
            if (!this.otp && this.otp.length != 4) {
                this.errors.otp = "Please enter the verification OTP";
                return true;
            } 
            else {
                this.errors.otp = "";
            }
            if(this.otp.length==4) {
                this.isLoading = true
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
                this.api.create({
                    method: 'post',
                    url: this.api.routes.otpVerify,
                    headers: { Authorization: AuthStr },
                    data: {
                        otp: this.otp,
                    },
                })
                .then(response => { 
                    console.log(response.data)
                    if(response.data.status == 1){
                        this.$store.commit('user/setLoggedIn')
                        Toast.show({
                            text: response.data.message,
                            duration: 3000
                        });
                        this.isLoading = false
                        var routeCount = (this.navigation.dangerouslyGetParent().state.routes).length
                        this.navigation.dispatch(StackActions.pop({n:routeCount-1}));
                        this.navigation.dispatch(StackActions.replace({routeName: 'Home'}))
                    } 
                    else {
                        this.isLoading = false
                        Toast.show({
                            text: response.data.error,
                            duration: 3000
                        });
                    }
                })
                .catch(error => {
                    this.isLoading = false
                    console.log(error);
                });  
            }
        },
        resendOTP(){
            this.isLoading = true
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            this.api.create({
                method: 'POST',
                url: this.api.routes.resendOTP,
                headers: { 'Content-Type': 'application/json' , 'Authorization':AuthStr },
                data:{phone:this.phone,prefix:this.prefix}
            })
            .then(response => { 
                this.isLoading = false
                this.navigation.replace('ConfirmOTP',{mobile:this.phone,prefix:this.prefix,otp:response.data.verification_otp});
            })
            .catch(error => {
                this.isLoading = false
                console.log(error);
            }) 
        }
    },
}
</script>

<style>
    .top-image{
        resize-mode: cover;
        width: 100%;
        height: 150;
    }
    .input-item{
        height: 42;
        border-radius: 4;
        border-color: #e6e6e6;
        margin-bottom: 22;
    }
    .container{
       flex: 1;
       align-items: center;
       justify-content: center;
       padding: 30;
    }
    .head-title{
        margin-top: 30;
        margin-bottom: 22;
        font-size: 16;
        color: #000000;
        font-family: Montserrat_Bold;
    }
    .head-subtitle{
        font-size: 12;
        font-family: Montserrat_Medium;
        color: #707070; 
        margin-bottom: 45;
        text-align: center;
    }
    .input-field{
        font-family: Montserrat_Medium;
        font-size: 12;
        color: #707070;
        height: 35;
    }  
    .resend{
        flex-direction: row;
        margin-top: 32;
    }
    .resend-button-text{
        color: #ffd400;
        font-family: Montserrat_Medium;
        font-size: 12;
    }
    .resend-text{
        color: #707070;
        font-family: Montserrat_Medium;
        font-size: 12;
    }
</style>