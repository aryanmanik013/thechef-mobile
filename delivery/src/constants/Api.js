import axios from 'axios';

export default {
    create: axios.create({
        // baseURL: 'https://admin.thechef-app.com/api-deliveryPartner/'
        baseURL: 'http://127.0.0.1:8000/api-deliveryPartner/'
    }),
    routes: {
        login : 'auth/login',
        register : 'auth/register',
        insertToken: 'auth/insertToken',
        logout : 'logout',
        otpVerify:'otpVerify',
        resendOTP:'resendOtp',
        fileUpload:'fileUpload',
        addKYC:'addKYC',
        addBank:'addBank',
        fileDelete:'fileDelete',
        orderDetail:'orderDetail',
        deliveryDetail:'deliveryDetail',
        pickupDetail:'pickupDetail',
        todayTasks:'todayTasks',
        updateStatus:'updateStatus',
        updateDeliveryStatus:'updateDeliveryStatus',
        completedTasks:'completedTasks',
        getStatus:'getStatus',
        getProfile: 'getProfile',
        getEarnings: 'getEarnings',
        submitHelp:'submitHelp',
        updateLocation: 'updateLocation',
        getDeliveryRequests: 'getDeliveryRequests',
        getPendingOrders: 'getPendingOrders',
        acceptOrder: 'acceptOrder',
        getProfile: 'getProfile',
        getAllDeliveryRequests: 'getAllDeliveryRequests',
        getPayouts: 'getPayouts',
        getInformation: 'getInformation'
    }
}
