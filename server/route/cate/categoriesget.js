module.exports = async ctx => {
  const { type, sel } = ctx.query
  if (sel === 'many') {
    ctx.body = {
      data: [
        {
          attr_id: 1,
          attr_name: 'cpu ',
          cat_id: 22,
          attr_sel: 'only ',
          attr_write: 'manual ',
          attr_vals: 'ffff 444 444 55 66 66 77 88 9 9 '
        },
        {
          attr_id: 2,
          attr_name: 'cpu2 ',
          cat_id: 23,
          attr_sel: 'only ',
          attr_write: 'manual ',
          attr_vals: 'ffff 444 444 55 66 66 77 88 9 9 '
        },
        {
          attr_id: 3,
          attr_name: 'cpu3 ',
          cat_id: 24,
          attr_sel: 'only ',
          attr_write: 'manual ',
          attr_vals: 'ffff 444 444 55 66 66 77 88 9 9 '
        }
      ],
      meta: {
        msg: '获取成功 ',
        status: 200
      }
    }
  } else if (sel === 'only') {
    ctx.body = {
      data: [
        {
          attr_id: 1,
          attr_name: '颜色 ',
          cat_id: 22,
          attr_sel: 'only ',
          attr_write: 'manual ',
          attr_vals: '赤 橙 黄 绿 青 蓝 紫 '
        },
        {
          attr_id: 2,
          attr_name: '屏幕 ',
          cat_id: 23,
          attr_sel: 'only ',
          attr_write: 'manual ',
          attr_vals: '曲面 平面 '
        },
        {
          attr_id: 3,
          attr_name: '尺寸 ',
          cat_id: 24,
          attr_sel: 'only ',
          attr_write: 'manual ',
          attr_vals: '100 200 300 400 '
        }
      ],
      meta: {
        msg: '获取成功 ',
        status: 200
      }
    }
  }

  if (type && !sel) {
    if (type === '3') {
      ctx.body =
      {
        data: {
          pagenum: 0,
          pagesize: 5,
          result: [{
            cat_id: 1,
            cat_name: '大家电',
            cat_pid: 0,
            cat_level: 0,
            cat_deleted: false,
            children: [
              {
                cat_id: 3,
                cat_name: '电视',
                cat_pid: 1,
                cat_level: 1,
                cat_deleted: false,
                children: [
                  {
                    cat_id: 6,
                    cat_name: '曲面电视',
                    cat_pid: 3,
                    cat_level: 2,
                    cat_deleted: false
                  },
                  {
                    cat_id: 7,
                    cat_name: '海信',
                    cat_pid: 3,
                    cat_level: 2,
                    cat_deleted: false
                  }
                ]
              }
            ]
          }, {
            cat_name: '热门推荐'
          }, {
            cat_name: '海外购'
          }, {
            cat_name: '苏宁房产'
          }, {
            cat_name: '手机相机'
          }],
          total: 100
        },
        meta: {
          msg: 'roles获取失败',
          status: 200
        }
      }
    } else if (type === '2') {
      ctx.body =
      {
        data:
          [{
            cat_id: 1,
            cat_name: '大家电',
            cat_pid: 0,
            cat_level: 0,
            cat_deleted: false,
            children: [
              {
                cat_id: 3,
                cat_name: '电视',
                cat_pid: 1,
                cat_level: 1,
                cat_deleted: false
              }
            ]
          }, {
            cat_name: '热门推荐'
          }, {
            cat_name: '海外购'
          }, {
            cat_name: '苏宁房产'
          }, {
            cat_name: '手机相机'
          }],
        meta: {
          msg: 'roles获取失败',
          status: 200
        }
      }
    }
  }
}
