import {Component, OnInit} from "@angular/core";
import {BreadcrumbService} from '../../../../service/breadcrumb.service';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {PublicService} from "../../../../utils/public.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AntiVersionManageService} from "../service/antiversionmanage.service";
import {DeviceVersion} from "../../model/deviceVersion";
declare var $:any;
@Component({
  selector: 'layout-antiVersionForm',
  templateUrl: './antiversionForm.component.html'
})
export class AntiVersionFormComponent implements OnInit {
  versionForm: FormGroup;
  formErrors: any;
  validationMessages: any;
  version: DeviceVersion = {};
  file:any;
  constructor(private breadcrumbService: BreadcrumbService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
              private versionService: AntiVersionManageService, private pu: PublicService) {
    this.breadcrumbService.setItems([
      {label: '版本列表', routerLink: ['/layout/antiVersions']},
      {label: '版本新增'}
    ]);
  }

  /*初始项*/
  ngOnInit() {
    /*验证项的错误信息*/
    this.formErrors = {
      file:''
    };
    /*验证消息*/
    this.validationMessages = {
      file: {
        required: '请上传后缀为.bin结尾的文件'
      }
    };
    /*注册验证*/
    this.versionForm = this.fb.group({
      'file': new FormControl(this.version.file, {
        validators: Validators.required,
      }),
      'softwareName': new FormControl(this.version.softwareName),
    });
    /*绑定方法*/
    this.versionForm.valueChanges.subscribe(data => this.pu.onValueChanges(this.versionForm, this.validationMessages, this.formErrors));
  }
  /*提交*/
  submit(){
    const formData = new FormData();
    formData.append('softwareName',this.versionForm.value.softwareName);
    formData.append('file',this.file);
    this.versionService.addAntiVersion(formData).subscribe((rep) => {
      if (!rep.status) window.history.go(-1);
    })
  }
  /*请求区分*/
  /*点击按钮启动file*/
  chooseFile(){
    $('.el-upload_input').click();
  }
  changeFile(e){
    this.file = e.target.files[0];
    if(!!this.file && this.file.name.substring(this.file.name.lastIndexOf('.') + 1) === 'bin'){
      this.versionForm.patchValue({softwareName:this.file.name.substring(0,this.file.name.lastIndexOf('.'))})
    }else{
      this.versionForm.patchValue({file:'',softwareName:''});
    }
  }
}
