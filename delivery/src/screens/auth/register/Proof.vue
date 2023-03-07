<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" headerName="Complete your KYC" headerTitle="Complete your KYC" :registration=true />
        <nb-content class="container" padder>
            <nb-view class="register-header">
                <nb-text class="register-title">Proof Identity</nb-text>
                <nb-text class="register-subtitle">{{$store.state.selectedLocation.addressSubtitle}}</nb-text>
            </nb-view>
            <nb-view class="register-identity">
                <nb-text class="register-head">Choose your identity</nb-text>
                <nb-view class="identity-row">
                    <nb-view class="identity-item">
                        <nb-radio color='#06b2a1' selectedColor='#06b2a1' :on-press="()=> selectProofType('Driving Licence')" 
                        :selected="(proofType=='Driving Licence' ? true :false)"  />
                        <nb-text class="identity-text">Licence</nb-text>
                    </nb-view>
                    <nb-view class="identity-item">
                        <nb-radio color='#06b2a1' selectedColor='#06b2a1' :on-press="()=> selectProofType('Aadhaar')" 
                        :selected="(proofType=='Aadhaar' ? true :false)" />
                        <nb-text class="identity-text">Aadhaar</nb-text>
                    </nb-view>
                    <nb-view class="identity-item">
                        <nb-radio color='#06b2a1' selectedColor='#06b2a1' :on-press="()=> selectProofType('Voter ID')" 
                        :selected="(proofType=='Voter ID' ? true :false)" />
                        <nb-text class="identity-text">Voter ID</nb-text>
                    </nb-view>
                </nb-view>
                <nb-view class="identity-form" padder>
                    <InputWithError
                     :error="$v.form.idNumber.$dirty && (!$v.form.idNumber.required || errors.idNumber)"
                        :msg="errors.idNumber!='' ? errors.idNumber : 'ID Number field is required'">
                        <nb-label class="input-label">ID Number</nb-label>
                        <nb-input class="input-field" :on-change-text="(text)=>{form.idNumber=text}" :defaultValue="form.idNumber" :on-blur="() => $v.form.idNumber.$touch()" />
                    </InputWithError>
                    <InputWithError
                     :error="$v.form.name.$dirty && (!$v.form.name.required || errors.name)"
                        :msg="errors.name!='' ? errors.name : 'Name field is required'">
                        <nb-label class="input-label">Name</nb-label>
                        <nb-input class="input-field" :on-change-text="(text)=>{form.name=text}" :defaultValue="form.name" :on-blur="() => $v.form.name.$touch()"/>
                    </InputWithError>
                    <touchable-opacity :on-press="()=>pickFile()" class="upload-button">
                        <image class="upload-button-icon" :source="require('../../../../assets/images/icons/file-upload.png')" />
                        <nb-text class="upload-button-text">Choose document</nb-text>
                    </touchable-opacity>
                    <nb-text class="upload-or">Or</nb-text>
                    <touchable-opacity :on-press="()=>captureImage()" class="upload-button">
                        <image class="upload-button-icon" :source="require('../../../../assets/images/icons/camera-upload.png')" />
                        <nb-text class="upload-button-text">Take a photo</nb-text>
                    </touchable-opacity>
                       <nb-text :style="{color:'red',fontSize:12,alignSelf:'center'}">{{fileError}}</nb-text>
                </nb-view>
            </nb-view>
            <nb-view class="gallery-container">
                <image-background v-for="(proofFile,index) in proofFiles" :key="index" :source="{uri:proofFile.uri}" class="image-container" :imageStyle="{margin:2}">
                    <touchable-opacity :on-press="()=>deleteFile(index)" class="image-remove">
                        <image :source="require('../../../../assets/images/icons/remove.png')"  class="image-remove-icon" />
                    </touchable-opacity>
                </image-background>          
            </nb-view>
            <nb-button full :on-press="()=>addKYC()"><nb-text>NEXT</nb-text></nb-button>
        </nb-content>
    </nb-container>
</template>

<script>
import React from "react";
import { Picker, Icon } from "native-base";
import {StackActions, navigationActions} from 'react-navigation'
import { Toast } from 'native-base'
import { required,minLength,email } from 'vuelidate/lib/validators'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants'
import FormData from 'form-data'
export default {
    props: {
        navigation : { Object }
    },
      components: {
    
    },
    data() {
        return {
            proofType:'Aadhaar',
            proofFiles:[],
            fileError:'',
            form: {
                idNumber:'',
                name:''
            },
            errors:{
                idNumber:'',
                name:''
            },
            isLoading: false
        }
    },
    validations:{
            form: {
                idNumber: {
                    required,
                },
                name:{
                     required, 
                },
            }
    },
    methods: {
        selectProofType(proofType){
            this.proofType = proofType;
        },
        async pickFile(){
            const {
                status: cameraRollPerm
            } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            // only if user allows permission to camera roll
            if (cameraRollPerm === 'granted') {
                let pickerResult = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    // aspect: [4, 3],
                });
                this.assignImagePicked(pickerResult)                
            } 
        },
        async captureImage(){
            const {
                status: cameraPerm
            } = await Permissions.askAsync(Permissions.CAMERA);
            const {
                status: cameraRollPerm
            } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            // only if user allows permission to camera AND camera roll
            if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
                let pickerResult = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    // aspect: [4, 3],
                });
                this.assignImagePicked(pickerResult)  
            }
        },
        assignImagePicked(pickerResult){
            if(!pickerResult.cancelled){
                this.proofFiles.push({
                    uri: Platform.OS === 'android' ? pickerResult.uri : pickerResult.uri.replace('file://', ''),
                    name: 'galleryImage',
                    type: 'image/jpeg', // it may be necessary in Android. 
                })
                this.fileError=''
            }
        },
        addKYC(){
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            for (const key in this.errors) {
                if (this.errors.hasOwnProperty(key)) {
                    this.errors[key]= '';
                }
            }
            this.$v.form.$touch()
            if(!this.$v.form.$error && !this.$v.form.required && this.proofFiles.length!=0){  
                this.isLoading = true
                var formData = new FormData();
                this.proofFiles.forEach((item) => {
                    formData.append('proofFiles[]', item);
                });
                formData.append('name',this.form.name)
                formData.append('idNumber',this.form.idNumber)
                formData.append('type',this.proofType)
                console.log(formData)
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.addKYC,
                    data:formData,
                    headers: {'Content-Type': 'multipart/form-data','Accept': 'application/json',   'Authorization':AuthStr  },
                })
                .then(response => { 
                    console.log(this.$store.state.selectedLocation);  
                    Toast.show({
                       text: "KYC added successfully",
                       duration : 3000
                    });
                    this.isLoading = false
                   this.navigation.dispatch(StackActions.replace({ routeName: 'RegisterBank' }))
                })
                .catch(error => {
                    this.isLoading = false
                     console.log(error);  
                     /* console.log(error.response.data); 
                    console.log(error.response.data.message);  */ 
                    for (const key in error.response.data.errors) {
                        if (error.response.data.errors.hasOwnProperty(key)) {
                            this.errors[key]= error.response.data.errors[key][0];
                        }
                    }
                    this.$v.form.$touch()
                });
            } else {
                if(this.proofFiles.length==0)
                this.fileError='KYC Documents Required'
                console.log(this.$v.form.required) 
                this.$v.form.$touch()   
            }
        },
        deleteFile(index){
            this.proofFiles.splice(index,1)
        },
    },
}
</script>
<style>
    .container{
        background-color: #f7f9fb;
    }
    .register-header{
        margin-bottom: 25;
    }
    .register-title{
        font-family: Montserrat_Medium;
        font-size: 18;
        color: #000000;
        margin-bottom: 3;
    }
    .register-subtitle{
        font-family: Montserrat_Medium;
        font-size: 12;
        color: #707070;
    }
    .register-identity{

    }
    .register-head{
        font-family: Montserrat_Medium;
        font-size: 14;
        color: #000000;
        margin-bottom: 20;
    }
    .identity-row{
        flex-direction: row;
        align-items: center;
    }
    .identity-item{
        align-items: center;
        flex-direction: row;
        flex: 1;
    }
    .identity-text{
        margin-left: 10;
        font-family: Montserrat_Regular;
        font-size: 12;
        color: #000000;
    }
    .identity-form{
        border-width: 1;
        border-style: dotted;
        border-radius: 8;
        background-color: #FFFFFF;
        justify-content: center;
        margin-top: 25;
        margin-bottom: 25;
    } 
    .input-label{
        font-size: 12;
        color: #3c3c3c;
        font-family: Montserrat_Regular;
    }
    .input-field{
        font-size: 14;
        color: #3c3c3c;
        font-family: Montserrat_Regular;
    }
    .upload-button{
        height: 54;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-color: #e6e6e6;
        border-width: 1;
        border-radius: 6;
        margin: 15;
    }
    .upload-button-icon{
        width: 20;
        height: 20;
        resize-mode: contain;
        margin-right: 15;
    }
    .upload-button-text{
        font-family: Montserrat_Medium;
        font-size: 14;
        color: #000000;
        
    }
    .upload-or{
        font-family: Montserrat_Medium;
        font-size: 14;
        color: #000000;
        align-self: center;
    }
    .gallery-container{
        margin-vertical: 5;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 30;
        /* justify-content: space-around; */
    }
    .image-container{
        height: 73;
        width: 73;
        resize-mode:contain;
        border-radius: 9;
        /* border-color: #e2e2e2; */
        /* border-width: 1; */
        background-color: #FFFFFF;
        margin-right: 15;
    }
    .image-remove{
        align-self: flex-end;
        margin-right: -7;
        margin-top: -7;
    }
    .image-remove-icon{
        width: 19;
        height: 19;
        resize-mode: contain;
    }
</style>