<template>
  <el-card shadow="always" id="card">
    <el-form :model="form">
      <!--<el-row :gutter="10">
        <el-col :span="3">
          <div style="text-align:center;margin:5px;">昵称</div>
        </el-col>
        <el-col :span="12">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3">
          <div style="text-align:center;margin:5px;">介绍</div>
        </el-col>
        <el-col :span="12">
          <el-input v-model="form.des" autocomplete="off"></el-input>
        </el-col>
      </el-row>-->
      <el-row :gutter="10">
        <el-col :span="3">
          <div style="text-align:center;margin:5px;">新密码（不更改，请输入上次密码）</div>
        </el-col>
        <el-col :span="12">
          <el-input type="password" v-model="form.newPassword" autocomplete="off"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3">
          <div style="text-align:center;margin:5px;">确认密码</div>
        </el-col>
        <el-col :span="12">
          <el-input type="password" v-model="form.comfirm" autocomplete="off"></el-input>
        </el-col>
      </el-row>
      <!--<el-row :gutter="10">
        <el-col :span="3">
          <div style="text-align:center;margin:5px;">学校</div>
        </el-col>
        <el-col :span="12">
          <el-input v-model="form.school" autocomplete="off"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3">
          <div style="text-align:center;margin:5px;">专业</div>
        </el-col>
        <el-col :span="12">
          <el-input v-model="form.course" autocomplete="off"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3">
          <div style="text-align:center;margin:5px;">班级</div>
        </el-col>
        <el-col :span="12">
          <el-input v-model="form.classes" autocomplete="off"></el-input>
        </el-col>
      </el-row>-->
      <!--<el-row :gutter="10">
        <el-col :span="3">
          <div style="text-align:center;margin:5px;">学号</div>
        </el-col>
        <el-col :span="12">
          <el-input v-model="form.number" autocomplete="off"></el-input>
        </el-col>
      </el-row>-->
      <el-row :gutter="10">
        <el-col :span="3">
          <div style="text-align:center;margin:5px;">Email</div>
        </el-col>
        <el-col :span="12">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-col>
      </el-row>
    </el-form>

    <el-button type="primary" @click="updateClick">更新</el-button>
  </el-card>
</template>

<script>
export default {
  name: "setting",
  data() {
    return {
      username: "",
      name: "",
      form: {
        username: "",
        newPassword: "",
        comfirm: "",
        name: "",
        number: "",
        email: ""
      },
      userid: -1
    };
  },
  methods: {
    updateClick() {
      console.log(this.username);
      if (!this.username) {
        this.$message.error("非法访问！");
        return;
      }
      if (
        !this.form.email
      ) {
        this.$message.error("字段不能为空！");
        return;
      }
      if (this.form.newPassword != this.form.comfirm) {
        this.$message.error("两次密码不一致！");
        return;
      }

      if (!this.form.newPassword) {
        this.$message.error("请输入密码");
        return;
      }

      if (this.form.newPassword.length < 6) {
        this.$message.error("密码太短！");
        return;
      }

      this.$confirm(
        "确定更新吗?",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {

        this.form.newPassword = this.$md5(this.form.newPassword);
        this.$axios
          .post(
            "/login/reset",
            this.form
          )

          .then(
            response => {
              this.$message({
                message: "更新成功！",
                type: "success"
              });
              sessionStorage.setItem("name", this.form.name);
              this.$router.push({
                name: "user",
                query: {username: this.form.username}
              });
            },
            response => {
              this.$message.error("更新失败（" + response + "）");
            }
          );

      })


    }
  },
  created() {
    this.username = sessionStorage.getItem('username');
    this.form.username = this.username;
    console.log(this.username);
    if (this.username) {
      this.$axios
        .get(
          "/user/?username=" +
          this.username
        )
        .then(response => {
          this.form.number = response.data[0].number;
          this.form.email = response.data[0].email;
          this.userid = this.username;
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#card {
  margin: 200px;
  padding: 200px;
}

.el-table .warning-row {
  background: #fff9f9;
}

.el-table .success-row {
  background: #e6ffdf;
}

.el-table .info-row {
  background: #fffff7;
}

.el-table .judging-row {
  background: #f7ffff;
}

.el-table .danger-row {
  background: #fff9f9;
}

.el-tag {
  text-align: center;
  font-weight: bold;
}
</style>
