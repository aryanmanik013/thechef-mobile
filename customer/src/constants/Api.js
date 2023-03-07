import axios from 'axios';

export default {
    kitchen: axios.create({
        // baseURL:'https://admin.thechef-app.com/api-kitchen/'
        baseURL:'http://127.0.0.1:8000/api-kitchen/'

    }),
    create: axios.create({
        // baseURL:'https://admin.thechef-app.com/api-customer/'
        baseURL:'http://127.0.0.1:8000/api-customer/'

    }),
    paymentUrl: 'https://admin.thechef-app.com/api-customer/makePayment/',
    routes: {
        login : 'auth/login',
        register : 'auth/register',
        logout : 'logout',
        otpVerify:'otpVerify',
        getUser: 'getUser',
        getProfile: 'getProfile',
        getFiles: 'getFiles',
        setProfileName: 'setProfileName',
        search:'search',
        resendOTP:'resendOtp',
        popularCategories:'popularCategories',
        allBanners : 'allBanners',
        allCategories : 'allCategories',
        allKitchens : 'allKitchens',
        kitchenDetail :'kitchenDetail',
        allMenus :'allMenus',
        menuDetail:'menuDetail',
        menuDetailWithCart:'cart/menuDetail',
        kitchenDetail :'kitchenDetail',
        kitchenMenu :'kitchenMenu',
        kitchenReview :'kitchenReview',
        orderList : 'orderList',
        addOrderRating:'addOrderRating',
        orderDetail :'orderDetail',
        orderTracking :'orderTracking',
        address :'address',
        deleteAddress:'deleteAddress',
        addAddress:'addAddress',
        editAddress:'editAddress',
        updateAddress:'updateAddress',
        cartStore:'cart/store',
        cartList:'cart/getCartDetails',
        cartUpdateQuantity:'cart/updateQuantity',
        cartUpdateItem:'cart/updateItem',
        clearCart:'cart/clearCart',
        couponList:'coupon',
        applyCoupon:'applyCoupon',
        checkoutStore:'checkout/store',
        getDefaultAddress:'getDefaultAddress',
        getAddressById: 'getAddressById',
        allFaq:'getFaq',
        getInformation:'getInformation',
        updateProfile:'updateProfile',
        veryfyOtp:'submitUpdateProfile',
        favorite:'favoriteKitchen',
        getFavoriteKitchen:'getFavoriteKitchen',
        removeFavorite:'removeFavorite',
        GetKitchenByCategory:'GetKitchenByCategory',
        getKitchenDeliveryType:'kitchenDeliveryType',
        orderStatus:'orderStatus',
        getCancellationReasons: 'getCancellationReasons',
        cancelOrder: 'cancelOrder',
        searchDelivery: 'checkout/searchDelivery',
        getAcceptedDelivery : 'checkout/getAcceptedDelivery',
        cancelAcceptedDelivery : 'checkout/cancelDelivery',

        orders : 'orders',
        orderDetail : 'orderDetail',
        menu :'menu',
        updateMenuStatus : 'updateMenuStatus',
        updateStatus :'updateStatus',
        updateOrderStatus : 'updateOrderStatus',
        profile :'profile',
        support :'support',
        feedback :'feedback',
        salesInfo:'salesInfo',
        allCategories:'allCategories',
        editKitchen:'editKitchen',
        updateKitchen:'updateKitchen',
        addMenu:'addMenu',
        imageDelete:'imageDelete',
        fileUpload:'fileUpload',
        repostMenu:'repostMenu',
        editMenu:'editMenu',
        updateMenu:'updateMenu',
        foodSchedule:'foodSchedule',
        foodRepost:'foodRepost',
        foodDelete:'foodDelete',
        scheduleFood:'scheduleFood',
        addFood:'addFood',
        report:'report',
        mapReport:'mapReport',
        cancelledReport: 'cancelledReport',
        completedReport:'completedReport',
        couponReport:'couponReport',
        getAllMenu:'getAllMenu',
        getNotifications: 'getNotifications',
        getReportReasons : 'getReportReasons',
        reportKitchen : 'reportKitchen',
        reportDelivery : 'reportDelivery',
        getPayouts : 'getPayouts',
        insertToken: 'auth/insertToken',
        getAllOrders: 'getAllOrders'
    }
}
