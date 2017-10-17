/**
 * Created by dengyuying on 2017/10/12.
 */

require.config({
  paths: {}
})

var formKeyConf = {
  radio: {
    boardLayer: '板子层数',
    boardMaterial: '板材',
    boardAmount: '数量',
    minLineSpace: '最小线宽线距',
    minAperture: '最小孔径',
    holeAmount: '孔数',
    halfHole: '半孔',
    testMethod: '测试方式'
  },
  select: {
    boardThickness: '板厚（mm）',
    aluminumOutThickness: '外层（oz）',
    aluminumInThickness: '内层（oz）',
    surfacing: '表面处理',
    solderMaskcolor: '阻焊颜色',
    charColor: '字符颜色',
    urgent: '加急'
  }
}

// var formRadioRules = _.mapValues(formKeyConf.radio, function (label, key) {
//   return {required: true}
// })

var formValConf = {
  boardLayer: ['单面', '双面', '四层', '六层', '八层'],
  boardMaterial: ['FR4', 'CEM1', 'FR1', '铝基板'],
  boardThickness: ['0.4', '0.6', '0.8', '1.0', '1.2', '1.6', '2.0', '2.5'],
  boardAmount: ['5', '10', '20', '30', '40', '50', '60', '75', '100', '150', '200', '250', '300', '350 400', '450', '500', '550', '600', '650', '700', '800', '900', '1000', '1500', '2000', '2500 3000', '3500', '4000', '4500', '5000', '5500', '6000', '6500', '7000', '7500', '8000', '其他'],
  aluminumOutThickness: ['1', '2'],
  aluminumInThickness: ['0.5'],
  surfacing: ['有铅喷锡', '无铅喷锡', '沉金', 'OSP', '光板'],
  solderMaskcolor: ['绿色', '红色', '蓝色', '白色', '黑色', '哑光黑色', '无'],
  charColor: ['白色', '黄色', '黑色', '无'],
  minLineSpace: ['5/5mil以上'],
  minAperture: ['0.30mm以上'],
  holeAmount: ['10万孔以下/m²', '10-20万孔/m²', '20万孔以上/m²'],
  halfHole: ['无', '一边半孔', '二边半孔', '三边半孔', '四边半孔'],
  testMethod: ['全部飞针测试(样板飞测免费)：光学AOI测试 + 飞针测试，成品直通率100%测试', '抽测免费：成品直通率95%以上测试：全部光学AOI测试 + 飞针测试抽测（如抽测过程中直通率低于95%，此批全部免费飞针测试 ）', '测试架测试：测试免费，测试架工具费为一次性收费，返单免费', '目测：用人工目检，适合单面板及简单的板'],
  urgent: ['正常交期', '加急48小时', '加急24小时', '特快加急12小时', '火箭加急8小时']
}

var formClassConf = {
  // aluminumOutThickness: 'col-sm-10',
  // aluminumInThickness: 'col-sm-10',
  // surfacing: 'col-sm-10',
  minLineSpace: 'col-sm-4',
  minAperture: 'col-sm-4'
}

require(['/static/pcbs/js/tool.js'], function (tool) {
  $(function ($) {
    // init form dom
    _.forEach(formKeyConf, function (obj, key) {
      _.forEach(obj, function (v, k) {
        appendRadio(key, k, v,formClassConf[k])
      })
    })

    bindFormEvents()
  })

  function appendRadio (type, field, label, widthClass) {
    $('#' + field).append(tool.generateFormElem(type, formValConf[field], field, label, widthClass))
  }
})

function bindFormEvents () {
  var pcb = $('#pcb')
  var enquiryForm, pcbFileForm

  pcb.steps({
    headerTag: "h3",
    bodyTag: "fieldset",
    transitionEffect: "slideLeft",
    labels: {
      finish: "提交订单",
      next: "计算价格",
      previous: "返回",
    },
    onInit: function (event, currentIndex) {
      enquiryForm = $("#enquiryForm")
      pcbFileForm = $("#pcbFileForm")

      var validateConf = {
        errorPlacement: function errorPlacement (error, element) {
          element.parentsUntil('.form-group', '[class^="col-sm-"]').append(error)
        }
      }

      enquiryForm.validate(validateConf)
      pcbFileForm.validate(validateConf)
    },
    onStepChanging: function (event, currentIndex, newIndex) {
      var target = $(event.target)
      var validRes = enquiryForm.valid()

      if (currentIndex === 0 &&
        newIndex === 1 &&
        validRes &&
        target.data('needCalc') !== false
      ) {
        // todo: add loading
        $.ajax({
          url: 'calculate',
          type: 'POST',
          dataType: 'json',
          data: enquiryForm.serializeArray(),
          success: function (data) {
            target.data('needCalc', false)
            pcb.steps('next')
          },
          error: function (err) {
            console.log('-------error', err)
          }
        })

        return false
      }

      return validRes
    },
    onStepChanged: function (event, currentIndex, priorIndex) {
      if (currentIndex === 1) {
        $('a[href="#next"]').html('上传PCB文件')
      }

      if (currentIndex === 0 && priorIndex === 1) {
        pcb.data('needCalc', true)
      }

      if (currentIndex === 1 && priorIndex === 0) {
        generateOrder()
      }
    },
    onFinishing: function (event, currentIndex) {
      return pcbFileForm.valid();
    },
    onFinished: function (event, currentIndex) {
      alert("Submitted!");
    }
  })

  $('#pcbFile').fileupload({
    url: 'upload',
    dataType: 'json',
    done: function (e, data) {
      console.log('-------', data)
      $.each(data.result.files, function (index, file) {
        $('<p/>').text(file.name).appendTo(document.body);
      });
    }
  });
}

function generateOrder () {
  var tableTpl = ''
  var $labels = $("#enquiryForm label[for]:not(.error)")
  var tdTpl = _.template('<td><%- label %></td><td <%- tdProps %>><%- field %></td>')

  _.forEach($labels, function (label, idx) {
    var $label = $(label)
    var $field = $label.parent().find('[name]')

    var complieConf = {
      label: $label.html(),
      field: $field.val(),
      tdProps: $field.prop('id') === 'comment' ? 'colspan=3' : ''
    }

    if (idx % 2 === 0) {
      tableTpl += '<tr>' + tdTpl(complieConf)
    } else {
      tableTpl += tdTpl(complieConf) + '</tr>'
    }

    if (idx === $labels.length) {
      tableTpl += '</tr>'
    }
  })

  $('#machiningDetail').html(tableTpl)
}