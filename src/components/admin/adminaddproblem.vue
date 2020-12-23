<template>
  <el-form ref="addproblemform" :model="addproblemform" label-position="right" v-loading="loading">
    <!--<h3><a style="text-decoration: none;color:#67C23A;" target="_blank"
           href="https://docs.lpoj.cn/doc/oj.html#%E7%AE%A1%E7%90%86%E5%91%98%E9%A1%B5%E9%9D%A2%E8%AF%B4%E6%98%8E">具体使用，点我看管理员文档</a>
    </h3>-->
    <el-form-item label="题目标题:"><input v-model="addproblemform.description"></input></el-form-item>
    <el-form-item label="时间（ms）：">
      <el-input-number
        style="width:200px;"
        v-model="addproblemform.time"
        :step="1000"
        :min="100"
        :max="60000"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="内存（MB）：">
      <el-input-number
        style="width:200px;"
        v-model="addproblemform.memory"
        :step="64"
        :min="4"
        :max="1024"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="上传描述文件">
      <el-upload
        style="width:400px;"
        ref="upload"
        :action="desaddress"
        :multiple="true"
        :limit="1"
        :auto-upload="true"
        :http-request="uploaddatafile"
      >
        <el-button @click="">选择文件</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item label="上传数据文件">
      <el-upload
        style="width:400px;"
        ref="upload"
        :action="dataaddress"
        :multiple="true"
        :limit="1"
        :auto-upload="true"
        :http-request="uploaddatafile"
      >
        <el-button @click="">选择文件</el-button>
      </el-upload>
    </el-form-item>
    <el-button type="success" @click="onAddProblemSubmit" style="float:right;">添加题目</el-button>
  </el-form>
</template>

<script>
export default {
  name: "admin",
  data() {
    return {
      problemcount: 0,
      desaddress: "/commit/create",
      dataaddress: "/commit/update",
      fileList: [],
      loading: false,

      addproblemform: {
        description: "",
        time: 1000,
        memory: 64,

      },
    };
  },
  methods: {
    uploaddescriptionfile(f) {//需要修改上传方式
      let param = new FormData(); //创建form对象
      param.append("file", f); //通过append向form对象添加数据
      console.log("des" + f);
      this.$axios.post('/api/up/file',fd).then(function(res){
        alert('成功');
      })

      let config = {
        headers: {"Content-Type": "multipart/form-data"}
      };
    },
    uploaddatafile(f) {//需要修改上传方式
      let param = new FormData(); //创建form对象
      param.append("file", f); //通过append向form对象添加数据
      console.log("data" + f);
      let config = {
        headers: {"Content-Type": "multipart/form-data"}
      };
    },

    handleChange(file, fileList) {
      console.log(file);
      console.log(fileList);

      var name = file.name;
      var li = name.split(".");
      this.fileList = fileList;

    },
    handleError(response, file, fileList) {
      this.$message.error("数据上传失败！" + response);
    },
    handleSuccessNone(response, file, fileList) {
      this.$message.success("上传成功！");
      this.loading = false;
      this.$router.go(0);
    },
    async handleSuccess(response, file, fileList) {
      this.$message({
        message: "提交成功！题目编号为：" + response.data.problem,
        type: "success"
      });
      console.log("aaaaaaaaaaaaaaaaa")
      return true;
    },

    onAddProblemSubmit() {
      if (this.fileList.length <= 0) {
        this.$confirm(
          "确定添加吗？本次添加没有添加任何文件！不可更新题目信息！",
          "添加题目",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(async () => {
          this.loading = true;
          if (await this.handleSuccess(1, 2, 3) == true)
            this.$router.go(0);
        });
        return;
      }

      console.log(this.fileList);
      var name = this.fileList[0].name;
      var li = name.split(".");
      if (
        li[1] != "zip" &&
        li[1] != "jpeg" &&
        li[1] != "jpg" &&
        li[1] != "png" &&
        li[1] != "md"
      ) {
        this.$message.error("数据文件名名不正确！后缀应为zip/jpeg/jpg");
        this.fileList = [];
      }

      this.$confirm("确定添加吗？", "添加题目", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        this.loading = true;
        if (await this.handleSuccess(1, 2, 3) == true) this.$refs.upload.submit();
      });
    }
  },
  created() {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
