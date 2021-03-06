export const pcbEnums = {
  pcbCustomOptions: {
    boardLayer: {
      label: 'Board Layers',
      value: ['Single', '2', '4', '6', '8']
    },
    boardMaterial: {
      label: 'Material',
      value: ['FR4', 'CEM1', 'FR1', '铝基板']
    },
    boardThickness: {
      label: 'Finished Thickness (mm)',
      value: ['0.4', '0.6', '0.8', '1.0', '1.2', '1.6', '2.0', '2.5']
    },
    boardAmount: {
      label: 'Quantity'
      // value: ['5', '10', '20', '30', '40', '50', '60', '75', '100', '150', '200', '250', '300', '350', '400', '450', '500', '550', '600', '650', '700', '800', '900', '1000', '1500', '2000', '2500', '3000', '3500', '4000', '4500', '5000', '5500', '6000', '6500', '7000', '7500', '8000', '其他']
    },
    boardLength: {
      label: 'Board Length (cm)'
    },
    boardWidth: {
      label: 'Board Width (cm)'
    },
    aluminumOutThickness: {
      label: 'Copper Thickness',
      value: ['1', '2']
    },
    // aluminumInThickness: {
    //   label: '内层（oz）',
    //   value: ['0.5']
    // },
    makeupNum: {
      label: 'Panelization Quantity',
      value: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    },
    surfacing: {
      label: 'Surface Finish',
      value: ['HAL', 'HAL(lead-free)', 'Immersion Gold', 'OSP', '光板']
    },
    solderMaskColor: {
      label: 'Solder Mask',
      value: ['Green', 'Red', 'Blue', 'White', 'Black', '哑光黑色', '无']
    },
    charColor: {
      label: 'Silkscreen Color',
      value: ['White', 'Yello', 'Black', '无']
    },
    minLineSpace: {
      label: 'Min Track/Spacing',
      value: ['≥ 3/3mil']
    },
    minAperture: {
      label: 'Min Via Hole Size',
      value: ['≥ 0.20mm']
    },
    holeAmount: {
      label: 'Impedance',
      value: [ 'NO', 'YES' ]
      // value: ['10万孔以下/m²', '10-20万孔/m²', '20万孔以上/m²']
    },
    halfHole: {
      label: 'Blind hole',
      value: [ 'NO', 'YES' ]
      // value: ['无', '一边半孔', '二边半孔', '三边半孔', '四边半孔']
    },
    testMethod: {
      label: 'Test Method',
      value: ['Flying Probe Test (Sample Free)', 'Fixture Test (One-time fees)']
      // value: ['全部飞针测试(样板飞测免费)：光学AOI测试 + 飞针测试，成品直通率100%测试', '抽测免费：成品直通率95%以上测试：全部光学AOI测试 + 飞针测试抽测（如抽测过程中直通率低于95%，此批全部免费飞针测试 ）', '测试架测试：测试免费，测试架工具费为一次性收费，返单免费', '目测：用人工目检，适合单面板及简单的板']
    },
    urgent: {
      label: 'Lead Time',
      value: ['Sample 5-7days Normal', 'Sample 48 hours Urgent', 'Sample 24 hours Urgent', 'Sample 12 hours Urgent', 'Sample 8 hours Urgent']
    },
    // delivery: {
    //   label: '交期'
    // },
    comment: {
      label: 'Remark'
    }
  },
  pcbFee: {
    projectFee: 'Project',
    boardFee: 'Board',
    makeupFee: 'Panelization',
    specialBoardFee: 'Special board',
    filmFee: 'Film',
    surfaceFee: 'Surface',
    testFee: 'Test',
    solderMaskColorFee: 'Solder Mask Color',
    charColorFee: 'Silkscreen Color',
    halfHoleFee: 'Blind hole',
    urgentFee: 'Urgent',
    otherFee: 'Other',
    totalFee: 'Total'
  },
  pcbFeeRule: {
    boardAreaAmount: '下单数量 / ((102 / 板子尺寸宽（CM） + 5) * (102 / 板子尺寸长（CM） + 5))，并向上取整',
    areaAmount: '下单数量 * 板子尺寸宽（CM） * 板子尺寸长（CM） / 10000',
    projectFee: '板子层数对应的价格',
    boardFee: '单层总面积 * 对应的板价格',
    makeupFee: '单层总面积 * 对应的拼版价格',
    specialBoardFee: '0',
    filmFee: '单层总面积 * 对应的菲林价格',
    surfaceFee: '单层总面积 * 对应的表面处理价格',
    testFee: '单层总面积 * 价格',
    solderMaskColorFee: '0',
    charColorFee: '0',
    halfHoleFee: '有半孔的价格',
    // halfHoleFee: '向下取整(半孔 / 2) * 价格',
    urgentFee: '价格 * [加急48小时：1 | 加急24小时：2 | 特快加急12小时：3 | 火箭加急8小时：4]',
    otherFee: '0',
    totalFee: '所有费用总和'
  },
  pcbaFeeQuotie: {
    quotie: [
      {
        label: '点数50万以内',
        formula: '系数1*点数*（1+系数2）*2 + 系数3*dip点数 (1 + 系数4)*2 + （2 + 系数5）*订单 +（工程费）',
        quotieLabel: [
          {
            label: '系数1',
            key: 'quotie1'
          },
          {
            label: '系数2',
            key: 'quotie2'
          },
          {
            label: '系数3',
            key: 'quotie3'
          },
          {
            label: '系数4',
            key: 'quotie4'
          },
          {
            label: '系数5',
            key: 'quotie5'
          },
          {
            label: '工程费(元)',
            key: 'quotie0'
          }
        ],
      },
      {
        label: '点数50万--100万之间',
        formula: '系数1*点数*（1+系数2）*2 + 系数3*dip点数 (1 + 系数4)*2 + （2 + 系数5）*订单',
        quotieLabel: [{
            label: '系数1',
            key: 'quotie6'
          },
          {
            label: '系数2',
            key: 'quotie7'
          },
          {
            label: '系数3',
            key: 'quotie8'
          },
          {
            label: '系数4',
            key: 'quotie9'
          },
          {
            label: '系数5',
            key: 'quotie10'
          }
        ],
      },
      {
        label: '点数100万以上',
        formula: '系数1*点数*（1+系数2）*2 + 系数3*dip点数 (1 + 系数4)*2 + （2 + 系数5）*订单',
        quotieLabel: [{
            label: '系数1',
            key: 'quotie11'
          },
          {
            label: '系数2',
            key: 'quotie12'
          },
          {
            label: '系数3',
            key: 'quotie13'
          },
          {
            label: '系数4',
            key: 'quotie14'
          },
          {
            label: '系数5',
            key: 'quotie15'
          }]
      }
    ]
  }
}
