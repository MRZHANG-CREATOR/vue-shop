module.exports = ctx => {
    ctx.body = {
        data: {
            options: {
                title: {
                  text: '用户来源'
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'cross',
                    label: {
                      backgroundColor: '#E9EEF3'
                    }
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: [
                  {
                    boundaryGap: false
                  }
                ],
                yAxis: [
                  {
                    type: 'value'
                  }
                ]
              }
        },
        meta: {
            status: 200,
            msg: '获取成功'
        }
    }
}
