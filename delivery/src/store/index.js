import Vue from "vue-native-core"
import Vuex from 'vuex'
import { AsyncStorage } from "react-native";
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)


import user from './modules/user'


const state = {
    splash: true,
    token: '',
    selectedLocation: '',
    notification:0,
}

const mutations = {
    unsetSplash (state) {
        state.splash = false;
    },
    setSplash (state) {
        state.splash = true;
    },
    setToken (state, token) {
        state.token = token;
    },
    setSelectedLocation (state, location) {
        state.selectedLocation = location
    },
    unsetSelectedLocation (state){ 
        state.selectedLocation = ''
    },
    setNotification(state, notificationCount){
        state.notification = notificationCount
    },
    setUserType(state, userType){
        state.userType = userType
    },
    unsetUserType(state){
        state.userType = ''
    },

}

const vuexLocal = new VuexPersistence({
    strictMode: false,
    storage: AsyncStorage,
    asyncStorage: true,
});

const vuexPersistEmitter = () => {
    return store => {
        store.subscribe((mutation,state) => {
            // console.log(mutation.type);
            if (mutation.type === "RESTORE_MUTATION") {
                // console.log("345345345");
                store._vm.$root.$emit("storageReady");
            }
            // vuexLocal.storage.setItem('vuex',JSON.stringify(state))
        });
    };
};

Object.assign(mutations,{
    RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION
});

const store = new Vuex.Store({
    strict: false,
    modules: {
        user
    },
    state : state,
    mutations: mutations,
    plugins: [vuexLocal.plugin,vuexPersistEmitter()]
})

export default store;