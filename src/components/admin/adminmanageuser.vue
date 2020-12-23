<template>
  <el-form :model="form">
    <!--
        <el-input placeholder="搜索..."
                  v-model="searchuser"
                  @keyup.native.enter="searchuserdata"
                  style="float:right;width:200px;">
          <el-button slot="append"
                     icon="el-icon-search"
                     @click="searchuserdata"></el-button>
        </el-input>
        <el-pagination @current-change="handleUserCurrentChange"
                       :current-page="usercurrentpage"
                       :page-size="10"
                       layout="total, prev, pager, next, jumper"
                       :total="totaluser"></el-pagination>
    -->
    <el-table :data="tableData"
              size="small">
      <el-table-column prop="id"
                       label="ID"></el-table-column>
      <el-table-column prop="username"
                       label="用户名"></el-table-column>
      <!--      <el-table-column prop="number"
                             label="学号"></el-table-column>-->
      <el-table-column prop="email"
                       label="邮箱"></el-table-column>
      <!--      <el-table-column prop="type"
                             label="权限"
                             width="50"></el-table-column>
            <el-table-column prop="regtime"
                             label="注册时间"></el-table-column>-->
      <!--      <el-table-column fixed="right"
                             label="操作"
                             width="160">
              <template slot-scope="scope">
                <el-button @click="userclick(scope.row)"
                           type="primary"
                           size="small">编辑
                </el-button>
                <el-button @click="gouser(scope.row)"
                           type="primary"
                           size="small">查看
                </el-button>
              </template>
            </el-table-column>-->
    </el-table>

    <!--    <el-dialog title="登录记录"
                   :visible.sync="dialogDataVisible"
                   width="75%">
          <el-input placeholder="搜索用户名或IP..."
                    v-model="searchlogin"
                    @keyup.native.enter="searchdata"
                    style="float:right;width:200px;">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="searchdata"></el-button>
          </el-input>
          <el-pagination @current-change="handleDataCurrentChange"
                         :current-page="datacurrentpage"
                         :page-size="50"
                         layout="total, prev, pager, next, jumper"
                         :total="totaldata"></el-pagination>

          <el-table :data="tableData2"
                    size="mini">
            <el-table-column prop="username"
                             label="用户名"></el-table-column>
            <el-table-column prop="ip"
                             label="登录IP"></el-table-column>
            <el-table-column prop="logintime"
                             label="登录时间"></el-table-column>
            <el-table-column prop="msg"
                             label="其他信息"></el-table-column>
          </el-table>
        </el-dialog>-->
    <!--
        <el-dialog title="修改用户信息"
                   :visible.sync="dialogDataVisible2"
                   width="85%">
          <el-row :gutter="10"
                  style="margin-top:30px;">
            <el-col :span="3">
              <div style="text-align:center;margin:5px;">用户名</div>
            </el-col>
            <el-col :span="12">
              <el-input v-model="form.username"
                        autocomplete="off"
                        @keyup.native.enter="usernamechange"
                        @change="usernamechange"></el-input>
            </el-col>
            <el-button type="success"
                       @click="checklogin"
                       style="margin-left:20px;">查询登录记录
            </el-button>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="3">
              <div style="text-align:center;margin:5px;">密码</div>
            </el-col>
            <el-col :span="12">
              <el-input type="password"
                        v-model="password"
                        autocomplete="off"
                        placeholder="不修改密码则留空"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="3">
              <div style="text-align:center;margin:5px;">确认密码</div>
            </el-col>
            <el-col :span="12">
              <el-input type="password"
                        v-model="comfirm"
                        autocomplete="off"
                        placeholder="不修改密码则留空"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="3">
              <div style="text-align:center;margin:5px;">学号</div>
            </el-col>
            <el-col :span="12">
              <el-input v-model="form.number"
                        autocomplete="off"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="3">
              <div style="text-align:center;margin:5px;">Email</div>
            </el-col>
            <el-col :span="12">
              <el-input v-model="form.email"
                        autocomplete="off"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="3">
              <div style="text-align:center;margin:5px;">权限</div>
            </el-col>
            <el-col :span="12">
              <el-select v-model="form.type"
                         placeholder="选择权限...">
                <el-option key="普通"
                           label="普通"
                           :value="1"></el-option>
                <el-option key="管理员"
                           label="管理员"
                           :value="2"></el-option>
                <el-option key="超级管理员"
                           label="超级管理员"
                           :value="3"></el-option>
              </el-select>
            </el-col>
            <el-button type="success"
                       @click="updateClick"
                       style="float:right;margin-right:10px;">更新
            </el-button>
          </el-row>
        </el-dialog>-->
  </el-form>
</template>

<script>

export default {
  name: "adminmanageuser",
  data() {
    return {
      tableData: [],
      /* Useless parameter*/
      dialogDataVisible: false,
      dialogDataVisible2: false,
      tableData2: [],
      datacurrentpage: 1,
      totaldata: 0,
      searchlogin: "",

      usercurrentpage: 1,
      totaluser: 0,
      searchuser: "",

      form: {
        username: "",
        number: "",
        email: "",
        type: 1
      },
      userid: -1,
      password: "",
      comfirm: ""
    };
  },
  methods: {},
  mounted() {
    console.log("created in AdminManageuer");
    this.$axios
      .get("/userList", {
        headers: {'token': sessionStorage.getItem("token"),}
      })
      .then(response => {
        console.log(response);
        this.tableData = response.data;
        this.totaluser = response.data.length;
      }).catch(error => {
      console.log(error);
    });
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
