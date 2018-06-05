import { Injectable } from '@angular/core';

@Injectable()
export class ValidationService {

  constructor() { }

  validateRegistrationFields(fields){
    if(fields.first_name === undefined || fields.last_name === undefined || fields.username === undefined
      || fields.password === undefined || fields.email === undefined){
        return false;
    }else{
      return true;
    }
  }

  validatePassword(password){
    //console.log(/^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{5,}$/.test(password))
    return /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{5,}$/.test(password);
  }

  checkSpecialChar(value){
    //console.log(/[#?!@$%^&*\-]/.test(value))
    return /[#?!@$%^&*\-]/.test(value);
  }

  checkDigit(value){
    //console.log(/[0-9]/.test(value))
    return /[0-9]/.test(value);
  }

  checkPasswordLength(password){
    return password.length >=5;
  }

  checkOneUppercaseOnPassword(password){
    return /[A-Z]/.test(password);
  }

  checkOneLowercaseOnPassword(password){
    return /[a-z]/.test(password);
  }

  checkUsernameContainsSpecialChar(username){
    return /[#?!@$%^&*\-]/.test(username);
  }
  validateName(name){
    return /^[a-zA-Z]{2,15}$/.test(name);
  }
  validateConfirmAndNewPasswordMatch(newPassword, confirmPassword){
    return newPassword == confirmPassword;
  }

  validateEmail(email){
    return  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  }

  validateUsername(username){
    return /^[(0-9)?a-zA-Z]{3,10}$/.test(username) && !/[\)\(#?!@$%^&*\-+_=\{\}\[\]:;"'><\,\.\/`~\?]/.test(username);
  }
}
