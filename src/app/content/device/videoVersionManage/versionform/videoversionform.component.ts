import {Component, OnInit} from "@angular/core";
import {BreadcrumbService} from '../../../../service/breadcrumb.service';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {PublicService} from "../../../../utils/public.service";
import {ActivatedRoute, Router} from "@angular/router";
import {VideoVersionManageService} from "../service/videoversionmanage.service";
import {VideoVersion} from "../../model/videoVersion";
declare var $:any;
@Component({
  selector: 'layout-videoVersionForm',
  templateUrl: './videoversionform.component.html'
})
export class VideoVersionFormComponent implements OnInit {
  versionForm: FormGroup;
  formErrors: any;
  validationMessages: any;
  version: VideoVersion = {};
  file:any;//上传文件
  checkFile:any;//校验文件
  constructor(private breadcrumbService: BreadcrumbService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
              private versionService: VideoVersionManageService, private pu: PublicService) {
    this.breadcrumbService.setItems([
      {label: '版本列表', routerLink: ['/layout/videoVersions']},
      {label: '版本新增'}
    ]);
  }

  /*初始项*/
  ngOnInit() {
    /*验证项的错误信息*/
    this.formErrors = {
      file:'',
      checkFile:''
    };
    /*验证消息*/
    this.validationMessages = {
      file: {
        required: '请上传后缀为.tgz结尾的文件'
      },
      checkFile: {
        required: '请上传后缀为.MD5结尾的文件'
      }
    };
    /*注册验证*/
    this.versionForm = this.fb.group({
      'file': new FormControl(this.version.file, {
        validators: Validators.required,
      }),
      'checkFile': new FormControl(this.version.checkFile, {
        validators: Validators.required,
      }),
      'versionName': new FormControl(this.version.versionName),
    });
    /*绑定方法*/
    this.versionForm.valueChanges.subscribe(data => this.pu.onValueChanges(this.versionForm, this.validationMessages, this.formErrors));
  }
  /*提交*/
  submit(){
    const formData = new FormData();
    formData.append('versionName',this.versionForm.value.versionName);
    formData.append('file',this.file);
    formData.append('checkFile',this.checkFile);
    this.versionService.addVideoVersion(formData).subscribe((rep) => {
      if (!rep.status) window.history.go(-1);
    })
  }
  /*请求区分*/
  /*点击按钮启动file*/
  chooseFile(mark){
    if(mark === 'file'){
      $('.el-upload_input')[0].click();
    }else{
      $('.el-upload_input')[1].click();
    }
  }
  changeFile(e,mark){
    if(mark === 'file'){
      this.file = e.target.files[0];
      if(this.file && this.file.name.substring(this.file.name.lastIndexOf('.') + 1) === 'tgz'){
        this.versionForm.patchValue({versionName:this.file.name.substring(0,this.file.name.lastIndexOf('.'))})
      }else{
        this.versionForm.patchValue({versionName:'',file:''})
      }
    }else{
      this.checkFile = e.target.files[0];
      if(this.checkFile && this.checkFile.name.substring(this.checkFile.name.lastIndexOf('.') + 1) !== 'MD5'){
        this.versionForm.patchValue({checkFile:''})
      }
    }
  }
}
