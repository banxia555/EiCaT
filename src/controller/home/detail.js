import Base from './base'

export default class extends Base {
  __before() {
    return super.__before.apply(this, arguments).then(data => {
      this.$locale = _.get(this.getLocale(), '0')
      this.isZh = !(this.$locale === 'en-us')
      return data
    })
  }

  constructor (ctx) {
    super(ctx)
    this.active = ['/services']
  }

  //详情页[核心]
  async indexAction() {
    /* 标识正确性检测*/
    let id = this.get('id') || 0;
    this.assign('goods_id', id);
    //if(!(id && think.isString(id))){
    //    this.fail('文档ID错误！');
    //} //if(!(id && think.isString(id))){
    //    this.fail('文档ID错误！');
    //}
    /* 获取详细信息*/
    let document = this.model('document');
    let info = await document.detail(id);
    if (info.errno == 702) {
      const error = this.controller('common/error');
      return error.noAction(info.errmsg)
    }
    /* 页码检测*/
    //访问控制
    const accessCtrlRes = await this.accessCtrl(info.category_id, false)
    if (!_.isNil(accessCtrlRes)) {
      return
    }

    //不同的设备,压缩不同的图片尺寸
    let str = info.content;
    if (!think.isEmpty(str)) {
      let img;
      if (this.isMobile) {
        //手机端
        img = image_view(str, 640, 4);
      } else {
        //pc端

        img = image_view(str, 847, 0);
      }
      info.content = img
    }
    // console.log('==========info', info);
    //分类信息
    let cate = await this.category(info.category_id);
    cate = think.extend({}, cate);
    //seo
    this.active = [`/${cate && cate.name}`]; //选中的增值分类
    this.meta_title = this.isZh ? info.title : info.title_en; //标题
    this.keywords = info.keyname ? info.keyname : ''; //seo关键词
    this.description = info.description ? info.description : ""; //seo描述
    //keywords
    let keywords;
    if (!think.isEmpty(info.keyname)) {
      keywords = (info.keyname).split(",");
    }
    this.assign("keywords", keywords);
    //访问统计
    await document.where({id: info.id}).increment('view');
    //外链
    if (!think.isEmpty(info.link_id) && info.link_id != 0) {
      return this.redirect(info.link_id);
    }
    //获取面包屑信息
    let breadcrumb = await this.model('category').get_parent_category(cate.id, true);
    this.assign('breadcrumb', breadcrumb);

    // 上一篇
    let previous = await document.where({
      id: ['<', info.id],
      category_id: info.category_id,
      'pid': 0,
      'status': 1
    }).order('id DESC').find();
    this.assign('previous', previous)
    // 下一篇
    let next = await document.where({
      id: ['>', info.id],
      category_id: info.category_id,
      'pid': 0,
      'status': 1
    }).order('id ASC').find();
    this.assign('next', next)

    //获取模板
    let temp;
    let model = await this.model('model').get_model(info.model_id, 'name');

    //详情模版 TODO
    //手机版模版

    this.assign('category', cate);
    //console.log(info);
    //目录/文章/段落
    let pid;
    let pinfo;
    if (info.pid != 0) {
      let i = info.id;
      //
      while (i != 0) {
        let nav = await document.where({id: i}).find();
        if (nav.pid == 0) {
          pinfo = nav;
          pid = nav.id;
        }
        i = nav.pid;

      }

    } else {
      pinfo = info;
      pid = info.id;
    }
    //获取最后更新时间
    let lastinfo = await document.where({topid: pid}).order("update_time DESC").find();
    //console.log(lasttime);
    this.assign("lastinfo", lastinfo);
    //console.log(pid);
    let plist = await document.where({pid: pid}).order("level DESC").select();
    this.assign("pinfo", pinfo);
    this.assign("plist", plist);
    //console.log(plist);
    if (plist[0]) {
      //let lastlevel = plist[0].level;
      //console.log(lastlevel);
      this.assign("lastlevel", plist[0]);
    }
    //console.log(plist);
    //文档无限级目录
    let ptree_ = await document.where({topid: pid}).field('id,title,pid,name,level as sort').select();
    let ptree = get_children(ptree_, pid, 1);
    //console.log(ptree);
    this.assign('topid', pid);
    this.assign("ptree", ptree);

    //如果是目录并且模板为空,模块为视频时，目录id，显示最后更新的主题
    if (info.type == 1 && (think.isEmpty(info.template) || info.template == 0) && info.model_id == 6) {
      if (plist[0]) {
        // console.log(111111);
        let model_id = plist[0].model_id;
        let p_id = plist[0].id;
        let table = await this.model("model").get_table_name(model_id);
        let p_info = await this.model(table).find(p_id);
        info = think.extend(info, p_info);

      }
    }
    this.assign('info', info);
    //判断浏览客户端
    if (this.isMobile) {
      //手机模版
      if (!think.isEmpty(info.template) && info.template != 0) {
        temp = info.template; //todo 已设置详情模板
      } else if (!think.isEmpty(cate.template_m_detail)) {
        temp = cate.template_m_detail; //分类已经设置模板
      } else {
        temp = model;
      }
      //console.log(temp);
      //内容分页
      if (!think.isEmpty(info.content)) {
        info.content = info.content.split("_ueditor_page_break_tag_");
      }
      if (!think.isEmpty(info.content_en)) {
        info.content_en = info.content_en.split("_ueditor_page_break_tag_");
      }
      return this.display(this.mtpl(temp))
    } else {
      if (!think.isEmpty(info.template) && info.template != 0) {
        temp = info.template; //已设置详情模板
      } else if (!think.isEmpty(cate.template_detail)) {
        temp = cate.template_detail; //分类已经设置模板
      } else {
        temp = model;
      }
      // console.log(temp);
      //console.log(info);
      //内容分页
      if (!think.isEmpty(info.content)) {
        info.content = info.content.split("_ueditor_page_break_tag_");
      }
      if (!think.isEmpty(info.content_en)) {
        info.content_en = info.content_en.split("_ueditor_page_break_tag_");
      }
      return this.display(`home/detail_${temp}`);
    }
  }

  /**
   * 下载
   */
  async downloadgetidAction() {
    let id = decodeURI(this.get("id")).split("||");
    let db = this.model('document_download');
    let info = await db.find(id[0]);
    //console.log(info);
    let file_id = info.file_id;
    //console.log(file_id);
    let dlink;
    if (id[1] == 1) {
      let location = await this.model('file').where({id: file_id}).getField("location", true);
      //console.log(location);
      let d = await get_file(file_id);
      if (this.config('setup.IS_QINIU') == 1 && location == 1) {
        //七牛下载
        // dlink = await get_file(file_id,"savename",true);
        let qiniu = think.service("qiniu");
        dlink = await qiniu.download(d.savename);
      } else {
        // 本地下载
        dlink = d.savepath + d.savename + "?attname="
      }
      //console.log(dlink);
      //访问统计
      await db.where({id: info.id}).increment('download');
      //return this.redirect(dlink);
      this.assign("durl", dlink);
      if (this.isMobile) {
        //手机模版
        return this.display(`home/mobile/detail_downloadgetid`)
      } else {
        return this.display();
      }
    } else if (id[1] == 2) {
      dlink = id[2];
      await db.where({id: info.id}).increment('download');
      return this.redirect(dlink);
    } else if (id[1] == 3) {
      //返回网盘提取码
      let pan = info.panurl.split("\r\n");
      for (let v of pan) {
        let varr = v.split("|");
        console.log(varr[1]);
        if (!think.isEmpty(varr[2]) && think._.trim(id[2]) == think._.trim(varr[1])) {
          this.assign({
            title: varr[0],
            durl: varr[1],
            sn: varr[2]
          })
        }
      }
      await db.where({id: info.id}).increment('download');
      if (this.isMobile) {
        //手机模版
        return this.display(`home/mobile/detail_downloadgetid`)
      } else {
        return this.display();
      }
    }

  }
}