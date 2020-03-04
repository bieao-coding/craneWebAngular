import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

const preValue = Math.PI / 180; // 计算弧度制专用

const constLabel = {'put': '编辑', 'post': '新增', 'delete': '删除', 'get': '获取数据'};

@Injectable()
export class PublicService {
  labelName = {
    'roles.{roleId}': '角色编辑',
    'roles.{roleId}.authorities': '分配权限',
    'roles.{roleId}.authorityIds': '角色权限',
    'authorities': '所有权限',
    'users.companies': '获取单位',
    'users.projects': '所有工程',
    'users.roles': '所有角色',
    'users.{userId}': '用户编辑',
    'users.{userId}.password': '修改密码',
    'users.{userId}.resetPassword': '重置密码',
    'craneManager.projects': '工程列表',
    'craneManager.{projectId}': '工程操作',
    'craneManager.{projectId}.cranes': '塔机列表',
    'craneManager.{projectId}.cranes.craneFactories': '厂商列表',
    'craneManager.{projectId}.cranes.craneFactories.{craneFactoryId}': '厂商操作',
    'craneManager.{projectId}.cranes.craneFactories.{craneFactoryId}.craneModels': '塔机型号',
    'craneManager.{projectId}.cranes.{craneId}': '塔机操作',
    'craneManager.{projectId}.cranes.{craneId}.personals': '塔机操作员',
    'dataMonitoring.projects': '工程列表',
    'dataMonitoring.{projectId}': '工程操作',
    'dataMonitoring.{projectId}.cranes': '塔机列表',
    'dataMonitoring.{projectId}.cranes.{craneId}': '塔机操作',
    'dataMonitoring.{projectId}.cranes.{craneId}.VODLog': '视频点播',
    'dataMonitoring.{projectId}.cranes.{craneId}.VODPlayerStatus': '视频暂停',
    'dataMonitoring.{projectId}.cranes.{craneId}.VODPullUrl': '视频拉流',
    'dataMonitoring.{projectId}.cranes.{craneId}.checkVideoName': '名称检查',
    'dataMonitoring.{projectId}.cranes.{craneId}.refreshVODLog': '点播刷新',
    'dataMonitoring.{projectId}.cranes.{craneId}.runDataLogs': '运行数据',
    'dataMonitoring.{projectId}.cranes.{craneId}.runTimeLogs': '运行时间',
    'dataMonitoring.{projectId}.cranes.{craneId}.sideRunData': '塔机侧视',
    'dataMonitoring.{projectId}.cranes.{craneId}.videoLivePullUrl': '直播拉流',
    'dataMonitoring.{projectId}.cranes.{craneId}.videoRunTime': '视频运行时间',
    'dataMonitoring.{projectId}.cranes.{craneId}.videoRunTimeLogTotal': '视频运行时长',
    'dataMonitoring.{projectId}.cranes.{craneId}.videoRunTimeLogs': '视频运行时间日志',
    'dataMonitoring.{projectId}.cranes.{craneId}.workDataLogs': '吊重数据',
    'dataMonitoring.{projectId}.cranesDistribution': '塔机分布',
    'dataMonitoring.{projectId}.cranesDistribution.history': '历史数据',
    'dataMonitoring.{projectId}.cranesDistribution.realTime': '实时数据',
    'crane.projects': '工程列表',
    'crane.{projectId}': '关联塔机',
    'crane.{projectId}.cranes': '塔机管理',
    'companies.{companyId}': '单位操作',
    'projects.{projectId}': '工程编辑',
    'projects.buildCompanies': '建设单位',
    'projects.supervisionCompanies': '监理单位',
    'projects.workCompanies': '施工单位',
    'craneFactories.{craneFactoryId}': '厂商编辑',
    'craneFactories.{craneFactoryId}.craneModels': '塔机型号',
    'craneFactories.{craneFactoryId}.craneModels.{craneModelId}': '塔机编辑',
    'personals.{identityCard}':'人员特征',
    'personals.{identityCard}.features':'特征信息',
    'personals.{personalId}':'人员操作',
    'login':'登录',
    'userPageAuth':'用户权限',
    'userPageAuth.platform':'用户资源',
    'userPageAuth.terminal':'人脸采集',
    'index.projectAreas':'项目分布',
    'index.deviceStatistics':'项目统计',
    'index.deviceOfMonth':'月在线量',
    'index.realTimePeccancies':'实时违章',
    'index.topPeccancies':'违章TOP',
    'index.topDevices':'设备拥有量',
    'videoVersions.{versionName}':'版本操作',
    'antiVersions.{softwareId}':'版本操作',
    'menu.{id}':'编辑操作',
    'feature':'人脸录入',
    'feature.addFeature':'录入权限',
    'antiUpgrade.projects':'工程列表',
    'antiUpgrade.versions':'版本列表',
    'antiUpgrade.projects.{projectId}':'塔机操作',
    'antiUpgrade.projects.{projectId}.upgradeRate':'更新数据',
    'antiUpgrade.projects.{projectId}.upgradeSoftwareInfo':'塔机列表'
  };
  constructor() {
  }

  /*匹配错误消息*/
  onValueChanges(checkForm: FormGroup, message: any, errors: any) {
    if (!checkForm) {
      return;
    }
    const form = checkForm;
    for (const field in errors) {
      errors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = message[field];
        for (const key in control.errors) {
          if(!!messages[key]){
            errors[field] = messages[key];
            break;
          }

        }
      }
    }
  }

  /*角色转化权限树*/
  transTree(json, data, label?) {
    if(!label){
      Object.assign(this.labelName,this.findMenuName());
    }
    for (const item in json) {
      const obj = {};
      const path = label ? `${label}.${item}` : `${item}`;
      if (/get|put|post|delete/.test(item)) {
        obj['label'] = constLabel[item];
        obj['data'] = json[item];
        obj["icon"] = "fa-file-o";
      } else {
        obj['label'] = this.labelName[path];
        obj['data'] = 0;
        obj['expandedIcon'] = 'fa-folder-open-o';
        obj['collapsedIcon'] = 'fa-folder';
        obj['expanded'] = true;
      }
      data.push(obj);
      if (!!Object.keys(json[item]).length) {
        obj['children'] = [];
        this.transTree(json[item], obj['children'], path);
      }
    }
    return data;
  };
  findMenuName(){
    if(sessionStorage.getItem('menu')){
      return JSON.parse(sessionStorage.getItem('menu')).menu;
    }
  }
  /*children转平行树*/
  transformToArrayFormat(setting, nodes) {
    if (!nodes) return [];
    let r = [];
    if (this.typeof(nodes) === 'Array') {
      for (let i = 0, l = nodes.length; i < l; i++) {
        const node = nodes[i];
        _do(node);
      }
    } else {
      _do(nodes);
    }
    return r;

    function _do(_node) {
      r.push(_node);
      const children = this.nodeChildren(setting, _node);
      if (children) {
        r = r.concat(this.transformToArrayFormat(setting, children));
      }
    }
  }
  /*平行树转children树*/
  transformTozTreeFormat(setting, sNodes) {
    let i, l;
    const key = setting.id;
    const parentKey = setting.pid;
    if (!key || key === "" || !sNodes) return [];
    if (this.typeof(sNodes) === 'Array') {
      const r = [];
      const tmpMap = {};
      for (i = 0, l = sNodes.length; i < l; i++) {
        tmpMap[sNodes[i][key]] = sNodes[i];
      }
      for (i = 0, l = sNodes.length; i < l; i++) {
        sNodes[i].label = sNodes[i].authName;
        sNodes[i].data = sNodes[i].videoTime;
        const p = tmpMap[sNodes[i][parentKey]];
        if (p && sNodes[i][key] !== sNodes[i][parentKey]) {
          let children = this.nodeChildren(setting, p,undefined);
          if (!children) {
            children = this.nodeChildren(setting, p, []);
          }
          if(isNaN(Date.parse(sNodes[i][key]))){
            sNodes[i].icon = "fa fa-file-video-o";
          }else{
            sNodes[i].expandedIcon = 'fa fa-folder-open';
            sNodes[i].collapsedIcon = 'fa fa-folder';
            sNodes[i].expanded = false;
            sNodes[i].selectable = false;
          }
          children.push(sNodes[i]);
        } else {
          sNodes[i].expandedIcon = 'fa fa-folder-open';
          sNodes[i].collapsedIcon = 'fa fa-folder';
          sNodes[i].expanded = false;
          sNodes[i].selectable = false;
          r.push(sNodes[i]);
        }
      }
      return r;
    } else {
      return [sNodes];
    }
  }
  /*treeTable专用*/
  transformTreeTable(setting, sNodes) {
    let i, l;
    const key = setting.id;
    const parentKey = setting.pid;
    if (!key || key === "" || !sNodes) return [];
    if (this.typeof(sNodes) === 'Array') {
      let r = [];
      const tmpMap = {};
      for (i = 0, l = sNodes.length; i < l; i++) {
        tmpMap[sNodes[i][key]] = sNodes[i];
      }
      for (i = 0, l = sNodes.length; i < l; i++) {
        sNodes[i].data = {
          id:sNodes[i].id,
          name:sNodes[i].name,
          parentId:sNodes[i].parentId,
          type:sNodes[i].type,
          root:sNodes[i].root,
          icon:sNodes[i].icon,
          sort:sNodes[i].sort
        };
        const p = tmpMap[sNodes[i][parentKey]];
        if (p && sNodes[i][key] !== sNodes[i][parentKey]) {
          let children = this.nodeChildren(setting, p,undefined);
          if (!children) {
            children = this.nodeChildren(setting, p, []);
          }
          sNodes[i].expanded = true;
          children.push(sNodes[i]);
          children = children.sort(this.compare('sort'))
        } else {
          sNodes[i].expanded = true;
          r.push(sNodes[i]);
          r = r.sort(this.compare('sort'));
        }
      }
      return r;
    } else {
      return [sNodes];
    }
  }
  /*数组对象排序*/
  compare(prop){
    return function (obj1, obj2) {
      const val1 = obj1[prop];
      const val2 = obj2[prop];
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
  }
  /*菜单平时树转化*/
  transformMenuList(setting, sNodes){
    let i, l;
    const key = setting.id;
    const parentKey = setting.pid;
    if (!key || key === "" || !sNodes) return [];
    if (this.typeof(sNodes) === 'Array') {
      let r = [];
      const tmpMap = {};
      for (i = 0, l = sNodes.length; i < l; i++) {
        tmpMap[sNodes[i][key]] = sNodes[i];
      }
      for (i = 0, l = sNodes.length; i < l; i++) {
        const p = tmpMap[sNodes[i][parentKey]];

        if (p && sNodes[i][key] !== sNodes[i][parentKey]) {
          let children = this.nodeChildren(setting, p,undefined);
          if (!children) {
            children = this.nodeChildren(setting, p, []);
          }
          children.push(sNodes[i]);
          children = children.sort(this.compare('sort'))
        } else {
          r.push(sNodes[i]);
          r = r.sort(this.compare('sort'));
        }
      }
      return r;
    } else {
      return [sNodes];
    }
  }

  /*判断children*/
  nodeChildren(setting, node, newChildren) {
    if (!node) {
      return null;
    }
    const key = setting.children;
    if (typeof newChildren !== 'undefined') {
      node[key] = newChildren;
    }
    return node[key];
  }
  /*类型判断（大写）*/
  typeof(obj) {
    const objStr = Object.prototype.toString.call(obj);
    return objStr.replace('[object ', '').replace(']', '');
  }

  /*转化对象为dropdown使用的对象*/
  transDropDown(obj, label, value) {
    if (this.typeof(obj) !== 'Array') return obj;
    const outArr = [];
    for (const item of obj) {
      const newObj = {};
      if (item[value] !== undefined && item[value] !== null) {
        newObj['label'] = item[label];
        newObj['value'] = item[value];
        outArr.push(newObj);
      }
    }
    return outArr;
  }

  /*转化为table分组*/
  transGroup(json, groupNameArray, groupArray) {
    const outArray = [];
    for (const item of json) {
      for (const col of groupArray) {
        const outObj = {};
        for(const arr of groupNameArray){
          outObj[arr] = item[arr];
        }
        for (const i in col) {
          outObj[groupArray[0][i]] = item[col[i]];
        }
        outArray.push(outObj);
      }
    }
    return outArray;
  }

  /*任意坐标转化为笛卡尔坐标*/
  translateDecare(x: number, y: number, a: number, b: number,angle: number) {
    const newX = x * Math.cos(preValue * b) - a * y * Math.sin(preValue * b);
    const newY = x * Math.sin(preValue * b) + a * y * Math.cos(preValue * b);
    const newAngle = angle * a + b;
    return [newX, newY,newAngle];
  }

  /*转化秒为天时分秒*/
  transSecondsToFormat(data){
    let time = '';
    const day = data / (24 * 60 * 60);
    const hour = (data / (60 * 60)) % 24;
    const minute = (data / 60) % 60;
    const second = data % 60;
    if(!!Math.floor(day)) time = Math.floor(day) + '天';
    time =  time + `${Math.floor(hour)}时${Math.floor(minute)}分${Math.floor(second)}秒`;
    return time;
  }


}
