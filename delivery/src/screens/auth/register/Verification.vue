<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <nb-view class="verification" padder v-model="initCheckStatus">
            <image :source="require('../../../../assets/images/user/verification.png')" class="verification-image" />
            <nb-text class="verification-title">Verification on process</nb-text>
            <nb-text class="verification-description">Your request for verification has been recieved. Our KYC team will be verifying your documents and details soon and welcome you on board to The Chef app</nb-text>
        </nb-view>
    </nb-container>
</template>

<script>
import { StackActions, NavigationActions } from 'react-navigation'
import { Toast } from 'native-base'
export default {
    props: {
        navigation: { Object }
    },
    data() {
        return {
            isLoading: false
        }
    },
    computed: {
        initCheckStatus(){
            this.checkStatus()
        }
    },
    beforeMount() {
        // this.checkStatus()
    },
    methods: {
        checkStatus(){
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            this.isLoading = true
            this.api.create({
                method: 'POST',
                url: this.api.routes.getProfile,
                headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
            })
            .then(response => {
                if(response.data.deliveryPartner.approval_status){
                    this.$store.commit('user/setApprovalStatus')
                    Toast.show({
                        text: 'Verfication Successful',
                        duration : 3000
                    });
                    this.isLoading = false
                    this.navigation.dispatch(StackActions.replace({ routeName: 'Home'}))
                } else if(!response.data.deliveryPartner.approval_request_date) {
                    if(response.data.deliveryPartner.email==response.data.deliveryPartner.phone+'@thechef.com'){
                        routeName = 'Register'
                    } else if(!response.data.kyc){
                        routeName = 'RegisterProof'
                    } else {
                        routeName = 'RegisterBank'
                    } 
                    this.isLoading = false
                    this.navigation.dispatch(StackActions.replace({ routeName: routeName }))
                } else {
                    this.isLoading = false
                    setTimeout(function(){
                        Toast.show({
                            text: 'Checking Verification Status',
                            duration: 2000
                        })
                        this.checkStatus()
                    }.bind(this), 20000);
                }
            })
            .catch(error => {
                this.isLoading = false
                console.log(error);
                console.log(error.response.data);
            }) 
        }
    },
}
</script>


<style>
    .verification{
        flex: 1;
        justify-content: center;
        align-items: center;
    }
    .verification-image{
        height: 250;
        width: 100%;
        resize-mode: contain;
        margin-bottom: 25;
    }   
    .verification-title{
        font-size: 22;
        color: #707070;
        font-family: Montserrat_SemiBold;
        margin-bottom: 15;
    }
    .verification-description{
        font-size: 12;
        color: #707070;
        padding-horizontal: 15;
        text-align: center;
    }
</style>