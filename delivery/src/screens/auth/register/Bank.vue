<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" headerName="Personal Savings Account" headerTitle="Personal Savings Account" :registration=true />
        <nb-content class="container" padder>
            <nb-view class="register-identity">
                <InputWithError 
                    :error="$v.form.bankName.$dirty && (!$v.form.bankName.required || errors.bankName)"
                    :msg="errors.bankName!='' ? errors.bankName : 'Bank Name field is required'"> 
                    <nb-label class="input-label">Bank Name</nb-label>
                    <nb-input :on-change-text="(text)=>{form.bankName=text}" :defaultValue="form.bankName" placeholder="Bank Name" class="input-field" :on-blur="() => $v.form.bankName.$touch()"/>
                </InputWithError>
                <InputWithError 
                    :error="$v.form.branch.$dirty && (!$v.form.branch.required || errors.branch)"
                    :msg="errors.branch!='' ? errors.branch : 'Branch Name field is required'"> 
                    <nb-label class="input-label">Branch</nb-label>
                    <nb-input :on-change-text="(text)=>{form.branch=text}" :defaultValue="form.branch" placeholder="Branch" class="input-field" :on-blur="() => $v.form.branch.$touch()"/>
                </InputWithError>
                <InputWithError 
                    :error="$v.form.accountNumber.$dirty && (!$v.form.accountNumber.required || errors.accountNumber)"
                    :msg="errors.accountNumber!='' ? errors.accountNumber : 'Account Number field is required'"> 
                    <nb-label class="input-label">Account Number</nb-label>
                    <nb-input :on-change-text="(text)=>{form.accountNumber=text}" :defaultValue="form.accountNumber" keyboardType="phone-pad" placeholder="Account Number" class="input-field" :on-blur="() => $v.form.accountNumber.$touch()"/>
                </InputWithError>
                <InputWithError 
                    :error="$v.form.ifsc.$dirty && (!$v.form.ifsc.required || errors.ifsc)"
                    :msg="errors.ifsc!='' ? errors.ifsc : 'IFSC field is required'"> 
                    <nb-label class="input-label">IFSC</nb-label>
                    <nb-input :on-change-text="(text)=>{form.ifsc=text}" :defaultValue="form.ifsc" placeholder="IFSC" class="input-field" :on-blur="() => $v.form.ifsc.$touch()"/>
                </InputWithError>
                <InputWithError> 
                    <nb-label class="input-label">SWIFT</nb-label>
                    <nb-input :on-change-text="(text)=>{form.swift=text}" :defaultValue="form.swift"  class="input-field"/>
                </InputWithError>
            </nb-view>
        </nb-content>
        <nb-button full :on-press="()=>addBank()"><nb-text>SUBMIT</nb-text></nb-button>
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
            form:{
                bankName:'',
                branch:'',
                accountNumber:'',
                ifsc:'',
                swift:'',
            },
            errors:{
                bankName:'',
                branch:'',
                accountNumber:'',
                ifsc:'',  
            },
            isLoading:false
        }
    },
    validations:{
        form: {
            bankName:{
                required, 
            },
            branch:{
                required, 
            },
            accountNumber:{
                required,
            },
            ifsc:{
                required,
            },
        }
    },
    methods: {
        addBank(){
            for (const key in this.errors) {
                if (this.errors.hasOwnProperty(key)) {
                    this.errors[key]= '';
                }
            }
            this.$v.form.$touch()
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            console.log(AuthStr)
            if(!this.$v.form.required){
                this.isLoading = true
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.addBank,
                    data:{
                        name:this.form.bankName,
                        branch:this.form.branch,
                        accountNumber:this.form.accountNumber,
                        ifsc:this.form.ifsc,
                        swift:this.form.swift
                    },
                    headers: { 'Content-Type': 'application/json',   'Authorization':AuthStr  },    
                })
                .then(response => { 
                    console.log(response.data);
                    Toast.show({
                       text: "Profile has been submitted for verifiation.",
                       duration : 3000
                   });
                   this.isLoading = false
                   this.navigation.dispatch(StackAction.replace({routeName: 'Home'}))
                })
                .catch(error => {
                    this.isLoading = false
                    for (const key in error.response.data.errors) {
                        if (error.response.data.errors.hasOwnProperty(key)) {
                            this.errors[key]= error.response.data.errors[key][0];
                        }
                    } 
                }) 
            } else {
                this.$v.form.$touch()
            }
        },
        deleteFile(id,index){
            this.api.create({
                method: 'POST',
                url: this.api.routes.fileDelete,
                data :{'id':id},
                headers: { 'Content-Type': 'application/json' },    
            })
            .then(response => {    
                this.sliderImages.splice(index,1)
                    Toast.show({
                       text: "File Deleted Successfully",
                       duration : 3000
                });
            })
            .catch(error => {
                console.log(error.response.data);
            }) 
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