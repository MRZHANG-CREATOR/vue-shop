<template>
  <div>
    <h3>用户列表</h3>
    <!-- 面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图-->
    <el-card class="box-card">
      <!-- 搜索框-->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            :clearable="true"
            @clear="getUsersList(queryInfo)"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList(queryInfo)"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表-->
      <el-table :data="userList" :border="true" :stripe="true">
        <!--索引列-->
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="状态">
          <!--作用域插槽 会覆盖prop-->
          <template slot-scope="scope">
            <!--当前行数据{{scope.row}}-->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!--修改用户信息-->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row._id)"
            ></el-button>
            <!--删除用户-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row._id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页部分-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--添加用户对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!--内容主体-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮-->
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改用户的对话框-->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配角色弹框-->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
    >
    <p>当前用户名：{{userInfo.username}}</p>
    <p>当前用户角色：{{userInfo.role_name}}</p>
    <p>分配角色列表： <el-select v-model="selectedRoleId" placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  apiGetUsersList,
  apiUserStateChange,
  apiAddUser,
  apiShowUser,
  apiEditUserInfo,
  apiDeleteUser,
  apiGetRolesList
} from '../api'
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法邮箱'))
    } // 校验邮箱规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17921)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法手机号码'))
    } // 校验手机号码规则
    return {
      queryInfo: {
        query: '', // 搜索用户关键字
        pagenum: 1,
        pagesize: 2,
        currentsize: 0
      },
      userList: [],
      total: 0,
      dialogVisible: false, // 控制添加用户对话框的隐藏显示
      addForm: { uaername: '', password: '', email: '', mobile: '' }, // 添加用户表单数据
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', triggle: 'blur' },
          { min: 2, max: 10, message: '长度在2-10个字符之间', triggle: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', triggle: 'blur' },
          { min: 2, max: 10, message: '长度在2-10个字符之间', triggle: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', triggle: 'blur' },
          { validator: checkEmail, triggle: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', triggle: 'blur' },
          { validator: checkMobile }
        ]
      }, // 添加用户表单规则
      editDialogVisible: false, // 修改用户对话框显示隐藏
      setRoleDialogVisible: false, // 分配角色对话框显示隐藏
      editForm: {
        // 查询到的用户信息
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', triggle: 'blur' },
          { validator: checkEmail, triggle: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', triggle: 'blur' },
          { validator: checkMobile, triggle: 'blur' }
        ]
      },
      userInfo: {}, // 角色信息
      rolesList: [], // 角色列表
      selectedRoleId: ''
    }
  },
  created() {
    this.getUsersList(this.queryInfo)
  },
  methods: {
    async getUsersList(queryInfo) {
      const res = await apiGetUsersList(queryInfo)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
      // console.log(this.queryInfo.pagesize)
    },
    handleSizeChange(newPageSize) {
      // 监听总页数改变
      // console.log(newPageSize)
      this.queryInfo.pagesize = newPageSize
      this.getUsersList(this.queryInfo)
    },
    handleCurrentChange(newCurrentPage) {
      // 监听当前页改变
      // console.log(newCurrentPage)
      this.queryInfo.pagenum = newCurrentPage
      this.getUsersList(this.queryInfo)
    },
    async userStateChange(userInfo) {
      // 更新用户状态
      // console.log(userInfo)
      const res = await apiUserStateChange(userInfo)
      console.log(res)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('用户状态更新失败')
      }
      this.$message.success(res.meta.msg)
    },
    addDialogClose() {
      // 监听添加用户对话框关闭事件
      this.$refs.addFormRef.resetFields() // 重置引用
    },
    addUser() {
      // 添加用户确定后校验与请求
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return
        const res = await apiAddUser(this.addForm)
        // console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.dialogVisible = false // 隐藏添加用户对话框
        this.getUsersList(this.queryInfo) // 重新获取用户列表
      })
    },
    async showEditDialog(id) {
      // 获取用户信息
      console.log(id)
      this.editDialogVisible = true
      const { data: res } = await apiShowUser(id)
      console.log(typeof res.data.mobile)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // this.$message.success(res.meta.msg)
      this.editForm = res.data
      this.editForm.mobile = res.data.mobile.toString()
      // console.log(this.editForm)
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        console.log(valid)
        if (!valid) return
        console.log(this.editForm)
        const { data: res } = await apiEditUserInfo(this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.getUsersList(this.queryInfo)
        this.editDialogVisible = false
        this.$message.success(res.meta.msg)
      })
    },
    async removeUserById(id) {
      console.log(this.queryInfo)
      // 弹框
      await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await apiDeleteUser(id)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        if (this.userList.length === 1) {
          // console.log(1)
          this.queryInfo.pagenum = this.queryInfo.pagenum === 1 ? this.queryInfo.pagenum : this.queryInfo.pagenum - 1
        }
        this.getUsersList(this.queryInfo)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async setRole(userInfo) {
      this.userInfo = userInfo
      const { data: res } = await apiGetRolesList()
      this.rolesList = res.data
      console.log(this.rolesList)
      this.setRoleDialogVisible = true
    },
    saveRoleInfo() { // 点击确定按钮分配权限
      console.log(this.selectedRoleId)
      if (!this.selectedRoleId) {
        return this.$message.error('请选择角色后确定')
      }
      // 后端发起请求分配角色
      this.$message.success('角色分配成功')
      this.setRoleDialogVisible = false
      this.selectedRoleId = ''
    }
  }
}
</script>
<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
