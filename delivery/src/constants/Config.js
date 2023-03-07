
import { Dimensions, Platform } from 'react-native'

export default {
    imageUrl: '',
    appName: 'TheChef',
    payment: {
        store: '23421',
        key: '2ZHR~rBFCf#SCBzx',
        currency: 'AED',
        testMode: false,
        transactionType: 'auth' //auth|sale|verify;
    },
    platform: Platform.OS,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    googleApiKey: 'AIzaSyDv4tbjxizDdu5cz9alkaGdWZydkkf55BQ'
}
