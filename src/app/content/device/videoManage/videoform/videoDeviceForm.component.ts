import {Component, OnInit} from "@angular/core";
import {BreadcrumbService} from '../../../../service/breadcrumb.service';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {PublicService} from "../../../../utils/public.service";
import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime, filter, switchMap} from "rxjs/operators";
import {Observable} from "rxjs/Observable";
import {Device} from "../../model/device";
import {VideoDeviceListService} from "../service/videoDeviceList.service";

@Component({
  selector: 'layout-videoDeviceForm',
  templateUrl: './videoDeviceForm.component.html'
})
export class VideoDeviceFormComponent implements OnInit {
  deviceForm: FormGroup;
  formErrors: any;
  validationMessages: any;
  device: Device = {};

  constructor(private breadcrumbService: BreadcrumbService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
              private deviceListService: VideoDeviceListService, private pu: PublicService) {
    this.breadcrumbService.setItems([
      {label: '视频管理'},
      {label: '设备列表', routerLink: ['/layout/videoDevices']},
      {label: '设备新增'}
    ]);
  }

  /*初始项*/
  ngOnInit() {
    /*验证项的错误信息*/
    this.formErrors = {
      sn: ''
    };
    /*验证消息*/
    this.validationMessages = {
      sn: {
        required: '请输入sn'
      }
    };
    /*注册验证*/
    this.deviceForm = this.fb.group({
      'sn': new FormControl(this.device.sn, {
        validators: Validators.required,
      })
    });
    /*绑定方法*/
    this.deviceForm.valueChanges.subscribe(data => this.pu.onValueChanges(this.deviceForm, this.validationMessages, this.formErrors));
    this.addEvent();
  }

  /*添加事件*/
  addEvent() {
    const formEle = document.getElementById('form');
    Observable.fromEvent(formEle, 'submit').pipe(
      filter((ev) => this.deviceForm.valid),
      debounceTime(500),
      switchMap((ev) => this.chooseRequest())
    ).subscribe((rep) => {
      if (!rep.status) window.history.go(-1);;
    })
  }

  /*请求区分*/
  chooseRequest(): Observable<any> {
    this.device = this.deviceForm.value;
    return this.deviceListService.addDevice(this.device);
  }
}
