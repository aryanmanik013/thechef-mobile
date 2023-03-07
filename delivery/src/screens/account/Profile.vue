<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header-with-nav :navigation="navigation" headerName="Profile" :style="{elevation:2}"/>
        <nb-view class="profile-header" v-if="profileDetail!=''">
            <!-- <touchable-opacity :on-press="()=>{}" class="button-edit">
                <image class="button-edit-icon" :source="require('../../../assets/images/icons/edit-profile.png')" />
                <nb-text class="button-edit-text">Edit</nb-text>
            </touchable-opacity> -->
            <image class="profile-image" :source="image ? {uri:image} :require('../../../assets/images/icons/delivery.png')" />
            <nb-text class="profile-name">{{ profileDetail.name }}</nb-text>
        </nb-view>
        <nb-content padder>
           <nb-view class="section" padder>
               <image class="section-icon" :source="require('../../../assets/images/icons/account-icon.png')" />
               <nb-view class="section-right">
                   <nb-text class="section-head">Personal Details</nb-text>
                   <nb-view class="content-row">
                       <nb-text class="content-title">Partner ID</nb-text>
                       <nb-text class="content-separator">:</nb-text>
                       <nb-text class="content-value">{{ profileDetail.id }}</nb-text>
                   </nb-view>
                   <nb-view class="content-row">
                       <nb-text class="content-title">Phone</nb-text>
                       <nb-text class="content-separator">:</nb-text>
                       <nb-text class="content-value">{{ profileDetail.phone }}</nb-text>
                   </nb-view>
                   <nb-view class="content-row">
                       <nb-text class="content-title">Email</nb-text>
                       <nb-text class="content-separator">:</nb-text>
                       <nb-text class="content-value">{{ profileDetail.email }}</nb-text>
                   </nb-view>
                   <nb-view class="content-row">
                       <nb-text class="content-title">Address</nb-text>
                       <nb-text class="content-separator">:</nb-text>
                       <nb-text class="content-value">{{ profileDetail.address_line_1 +', '+profileDetail.address_line_2 +', '+ profileDetail.street_name +', '+profileDetail.landmark +', '+ profileDetail.city}}</nb-text>
                   </nb-view>
               </nb-view>
           </nb-view>   

           <nb-view class="section" padder>
               <image class="section-icon" :source="require('../../../assets/images/icons/bank.png')" />
               <nb-view class="section-right">
                   <nb-text class="section-head">Bank Details</nb-text>
                   <nb-view class="content-row">
                       <nb-text class="content-title">Account Number</nb-text>
                       <nb-text class="content-separator">:</nb-text>
                       <nb-text class="content-value">{{ profileBank.account_number }}</nb-text>
                   </nb-view>
                   <nb-view class="content-row">
                       <nb-text class="content-title">Bank Name</nb-text>
                       <nb-text class="content-separator">:</nb-text>
                       <nb-text class="content-value">{{ profileBank.bank_name }}</nb-text>
                   </nb-view>
                   <nb-view class="content-row">
                       <nb-text class="content-title">Branch</nb-text>
                       <nb-text class="content-separator">:</nb-text>
                       <nb-text class="content-value">{{ profileBank.branch }}</nb-text>
                   </nb-view>
                   <nb-view class="content-row">
                       <nb-text class="content-title">IFSC Code</nb-text>
                       <nb-text class="content-separator">:</nb-text>
                       <nb-text class="content-value">{{ profileBank.ifsc }}</nb-text>
                   </nb-view>
               </nb-view>
           </nb-view>   
           <nb-view class="section" padder>
               <image class="section-icon" :source="require('../../../assets/images/icons/proof.png')" />
               <nb-view class="section-right">
                   <nb-text class="section-head">KYC Details</nb-text>
                   <nb-view class="content-row">
                       <nb-text class="content-title">Proof Document</nb-text>
                       <nb-text class="content-separator">:</nb-text>
                       <nb-text class="content-value">{{ profileDetail.kyc_proof }}</nb-text>
                   </nb-view>
                   <nb-view class="content-row">
                       <nb-text class="content-title">Proof Number</nb-text>
                       <nb-text class="content-separator">:</nb-text>
                       <nb-text class="content-value">{{ profileDetail.kyc_id_number }}</nb-text>
                   </nb-view>
               </nb-view>
           </nb-view> 
        </nb-content>
     
    </nb-container>
</template>

<script>
import { LinearGradient } from 'expo-linear-gradient'
import { StackActions, NavigationActions } from 'react-navigation'
export default {
    props: {
        navigation: { Object }
    },
    components: {
        LinearGradient
    },
    data() {
        return {
            // profile:'',
            name:this.$store.state.user.username,
            image:this.$store.state.user.image,
            profileDetail: '',
            profileBank: '',
            isLoading: false
        }
    },
    beforeMount() {
        this.getProfileDetails()
    },
    methods:
    {
        getProfileDetails(){
            this.isLoading = true
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            this.api.create({
                method: 'POST',
                url: this.api.routes.getProfile,
                headers: { 'Content-Type': 'application/json','Authorization':AuthStr },   
                    })
            .then(response => { 
                console.log(response.data)
                this.profileDetail = response.data.deliveryPartner
                this.profileBank = response.data.deliveryPartnerBank
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            })
        },
        logout() {
            this.isLoading = true
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            this.api.create({
                method: 'GET',
                url: this.api.routes.logout,
                headers: { 'Content-Type': 'application/json','Authorization':AuthStr },   
                    })
            .then(response => { 
                this.$store.commit('user/unsetVerificationStatus');
                this.$store.commit('user/unsetAuthentication');
                this.$store.commit('user/unsetUser');
                this.$store.commit('user/unsetImage');
                this.$store.commit('user/unsetProfile');
                this.navigation.dispatch(StackActions.replace({ routeName: 'Home' }));
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            })
        }
     },
}
</script>

<style>
    .profile-header{
        /* flex: 1; */
        justify-content: center;
        align-items: center;
        padding: 15;
        border-bottom-width: 1;
        border-bottom-color: #FFFFFF;
        elevation: 1;
    }
    .button-edit{
        align-self: flex-end;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .button-edit-icon{
        width: 13;
        height: 13;
        resize-mode: contain; 
        margin-right: 10;
    }
    .button-edit-text{
        font-size: 13;
        font-family: Montserrat_Medium;
    }
    .profile-image{
        width: 86;
        height: 86;
        resize-mode: contain;
        margin-bottom: 10;
    }
    .profile-name{
        font-size: 16;
        font-family: Montserrat_SemiBold;
        color: #000000;
    }

    /* Section */

    .section{
        border-color: #ededed;
        border-width: 1;
        border-radius: 3;
        flex-direction: row;
        margin-bottom: 10;
    }
    .section-icon{
        width: 17;
        height: 17;
        resize-mode: contain;
        margin-right: 10;
    }
    .section-right{
        flex: 1;
    }
    .section-head{
        font-size: 14;
        font-family: Montserrat_Medium;
        color: #000000;
    }
    .content-row{
        flex-direction: row;
        align-items: center;
        flex: 1;
        padding-vertical: 3;
    }
    .content-title{
        font-size: 12;
        font-family: Montserrat_Regular;
        color: #888888;
        flex: .35;
    }
    .content-separator{
        font-size: 12;
        font-family: Montserrat_Regular;
        color: #888888;
        margin-right: 10
    }
    .content-value{
        font-size: 12;
        font-family: Montserrat_Regular;
        color: #000000;
        flex: .65;
    }

</style>