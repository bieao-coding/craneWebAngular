import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "../service/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private login: LoginService) {
  }

  name = '';
  password = '';
  remember;
  showCloth = false;
  nameError = '';
  passwordError = '';
  nameHTML: HTMLElement;
  passwordHTML: HTMLElement;
  isPh = false;

  ngOnInit() {
    const body = document.getElementById('body');
    if(body.clientWidth <= 640){//手机端
      this.isPh = true;
    }
    this.addListen();
    this.rememberPassword();
  }
  /*记住密码*/
  rememberPassword(){
    if(this.getCookie('username') && this.getCookie('password')){
      this.name = this.getCookie('username');
      this.password = this.getCookie('password');
      this.remember = true;
    }
  }
  /*注册事件*/
  addListen() {
    this.nameHTML = document.getElementById('name');
    this.passwordHTML = document.getElementById('password');
    this.nameHTML.onkeyup = (e) => {
      if (e.keyCode === 13) {
        this.Login();
      }
    };
    this.nameHTML.onblur = (e) => {
      if (this.name) {
        this.nameError = '';
        this.passwordError = '';
      }
    };
    this.passwordHTML.onkeyup = (e) => {
      if (e.keyCode === 13) {
        this.Login();
      }
    }
    this.passwordHTML.onblur = (e) => {
      if (this.password) {
        this.passwordError = '';
        this.nameError = '';
      }
    };
  }

  /*检查登录信息*/
  checkLogin() {
    if (!this.name || !this.password) {
      if (!this.name) {
        this.nameError = '请输入用户名';
      }
      if (!this.password) {
        this.passwordError = '请输入密码';
      }
      this.showCloth = false;
      return false;
    } else {
      return true;
    }
  }

  /*登录*/
  Login() {
    this.showCloth = true;
    if (!this.checkLogin()) return;
    this.nameError = '';
    this.passwordError = '';
    const params = {userName: this.name, password: this.password};
    this.login.Login(params).subscribe((res) => {
      if (res.status === 11 || res.status === 9) {
        this.nameError = '';
        this.passwordError = '用户名或密码错误';
        this.showCloth = false;
      } else if (res.status === 10) {
        if(this.remember){
          this.setCookie('username',this.name,7);
          this.setCookie('password',this.password,7);
        }else{
          this.delCookie('username');
          this.delCookie('password');
        }
        debugger;
        sessionStorage.removeItem('active');
        sessionStorage.setItem('name', JSON.stringify({name: this.name}));
        this.router.navigate(['layout/index'])
      }
    })
  }

  //设置cookie
  setCookie(name,value,day){
    const date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = name + '=' + value + ';expires='+ date;
  };
  //获取cookie
  getCookie(name){
    const reg = RegExp(name+'=([^;]+)');
    const arr = document.cookie.match(reg);
    if(arr){
      return arr[1];
    }else{
      return '';
    }
  };
  //删除cookie
  delCookie(name){
    this.setCookie(name,null,-1);
  };

}

