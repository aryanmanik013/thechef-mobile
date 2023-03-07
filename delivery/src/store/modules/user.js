import { AsyncStorage } from "react-native";
// import AsyncStorage from '@callstack/async-storage'


const state = {
    username: '',
    email: '',
    phone: '',
    userId: '',
    authentication: '',
    phonePrefix: '+91',
    loggedIn: false,
    verificationStatus: false,
    status: false,
    deliveryAddress: '',
    availabilityStatus: false,
    image :'',
    approvalStatus:false
}

const getters = {
    username: state => state.username,
    email: state => state.email,
    phone: state => state.phone,
    userId: state => state.userId,
    authentication: state => state.authentication,
    phonePrefix: state => state.phonePrefix,
    loggedIn: state => state.loggedIn,
    verificationStatus: state => state.verificationStatus,
    approvalStatus:state => state.approvalStatus,
    status: state => state.status,
    image: state => state.image,
    availabilityStatus: state => state.availabilityStatus,
    deliveryAddress: state => state.deliveryAddress
}

const mutations = {
    setUser (state, user) {
        state.username = user.name;
        state.authentication = user.authentication;
        state.userId = user.id;
        state.email = user.email;
        state.phone = user.phone;
        state.phonePrefix = user.phonePrefix;
        state.loggedIn = user.loggedIn;
        state.verificationStatus = user.verificationStatus,
        state.availabilityStatus = user.availabilityStatus,
        state.approvalStatus = user.approvalStatus,
        state.status = user.status
    },

    unsetUser (state) {
        AsyncStorage.clear();
        state.username = '';
        state.authentication = '';
        state.userId = '';
        state.email = '';
        state.phone = '';
        state.loggedIn = false;
        state.verificationStatus = false;
        state.approvalStatus = false;
        state.availabilityStatus = false,
        state.phonePrefix = '+91';
        state.status = false;
    },
    setProfile (state, user) {
        state.username = user.name;
        state.userId = user.id;
        state.email = user.email;
        state.phone = user.phone;
    },
    setProfileName (state, username) {
        state.username = username
    },
    setLoggedIn(state){
        state.loggedIn = true
    },
    setAuthentication(state,user) {
        state.authentication = user.authentication
    },
    unsetAuthentication(state) {
        state.authentication = ''
    },
    setVerificationStatus(state){
        state.verificationStatus = true
    },
    unsetVerificationStatus(state){
        state.verificationStatus = false
    },
    setDeliveryAddress(state, addressId){
        state.deliveryAddress = addressId
    },
    unsetDeliveryAddress(state){
        state.deliveryAddress = ''
    },
    setImage (state, image) {
        state.image = image
    },
    unsetImage (state) {
        state.image = ''
    },
    setApprovalStatus(state){
        state.approvalStatus = true
    },
    unsetApprovalStatus(state){
        state.approvalStatus = false
    },
    setAvailabilityStatus(state, status){
        state.availabilityStatus = status
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}