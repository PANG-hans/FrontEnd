<template>
  <el-form ref="addproblemform" :model="addproblemform" label-position="right" v-loading="loading">
    <!--<h3><a style="text-decoration: none;color:#67C23A;" target="_blank"
           href="https://docs.lpoj.cn/doc/oj.html#%E7%AE%A1%E7%90%86%E5%91%98%E9%A1%B5%E9%9D%A2%E8%AF%B4%E6%98%8E">具体使用，点我看管理员文档</a>
    </h3>-->

    <el-steps direction="vertical" :active="activeStepPageNo" finish-status="success">
      <el-step title="创建题目">
        <template slot="description" v-if="step1visible">
          <el-form-item label="题目标题:">
            <input v-model="addproblemform.questionTitle">
            </input>
          </el-form-item>
          <el-form-item label="DDL:">
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker
                v-model="ddltimeinsecond"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </div>
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
          <el-button type="success" @click="onAddProblemSubmit" style="float:right;">添加题目</el-button>

        </template>

      </el-step>
      <el-step title="步骤 2">
        <template slot="description" v-if="step2visible">
          <el-form-item label="题目编号:">
            <div>{{ this.problemReceiveID }}</div>

          </el-form-item>
          <el-form-item label="选择语言:">
            <el-select v-model="addProblemDetail.language"
                       placeholder="请选择"
                       @change="">
              <languageselect></languageselect>
            </el-select>
          </el-form-item>
          <el-form-item label="时间（s）：">
            <el-input-number
              style="width:200px;"
              v-model="addProblemDetail.cputime"
              :step="1"
              :min="2"
              :max="60"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="内存（kB）：">
            <el-input-number
              style="width:200px;"
              v-model="addProblemDetail.momory"
              :step="1000"
              :min="1024000"
              :max="10240000"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="上传建表文件">
            <el-upload
              style="width:400px;"
              ref="upload"
              :action="dataaddress"
              :multiple="true"
              :limit="1"
              :auto-upload="true"
              :http-request="uploadBuildDataBasefile"
            >
              <el-button @click="">选择文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="上传测评文件">
            <el-upload
              style="width:400px;"
              ref="upload"
              :action="dataaddress"
              :multiple="true"
              :limit="1"
              :auto-upload="true"
              :http-request="uploadCorrectScriptfile"
            >
              <el-button @click="">选择文件</el-button>
            </el-upload>
          </el-form-item>
          <el-button type="success" @click="onAddProblemDetail" style="float:right;">补充题目</el-button>
        </template>
      </el-step>
    </el-steps>

    <!--
      -->
  </el-form>
</template>

<script>
import Languageselect from "../utils/languageselect";

export default {
  name: "admin",
  components: {Languageselect},
  data() {
    return {
      activeStepPageNo: 0,
      step1visible: true,
      step2visible: false,
      problemcount: 0,
      problemReceiveID: 0,
      desaddress: "/commit/create",
      dataaddress: "/commit/update",
      fileList: [],
      loading: false,
      ddltimeinsecond: '',

      addproblemform: {
        questionTitle: '',
        description: "",
        deadline: 0,
      },
      addProblemDetail: {
        programOrder: 0,
        language: 0,
        group: [],
        correctCommand: '',
        cputime: 3,
        momory: 1024000,
      },
    };
  },
  methods: {

    next() {
      if (this.activeStepPageNo === 0) {
        this.activeStepPageNo++;
        this.step1visible = false;
        this.step2visible = true;

      }
    },

    uploaddatafile(fileFromClick) {//需要修改上传方式
      console.log(fileFromClick.file);
      const readFile = new FileReader();
      readFile.readAsText(fileFromClick.file);
      readFile.onload = (e) => {
        const stringOfCommit = e.target.result;
        this.addproblemform.description = stringOfCommit;
        console.log(this.addproblemform.description);
      }
      let config = {
        headers: {"Content-Type": "multipart/form-data"}
      };
    },
    uploadBuildDataBasefile(fileFromClick) {//需要修改上传方式
      const readFile = new FileReader();
      readFile.readAsText(fileFromClick.file);
      readFile.onload = (e) => {
        const stringOfCommit = e.target.result;
        this.addProblemDetail.group.push(stringOfCommit);
      }
      let config = {
        headers: {"Content-Type": "multipart/form-data"}
      };
    },
    uploadCorrectScriptfile(fileFromClick) {//需要修改上传方式
      const readFile = new FileReader();
      readFile.readAsText(fileFromClick.file);
      readFile.onload = (e) => {
        const stringOfCommit = e.target.result;
        this.addProblemDetail.correctCommand = stringOfCommit;
      }
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
      if (this.addproblemform.questionTitle === '' || this.addproblemform.description === '') {
        this.$notify.error({title: '信息不足!', message: "需要既有标题也有描述.",})
        return;
      }

      this.$confirm("确定添加吗？", "添加题目", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.loading = true;
        this.$axios.post('/commit/create', this.addproblemform, {
          headers: {'token': sessionStorage.getItem("token"),}
        }).then(response => {
          const responseData = response.data;
          this.problemReceiveID = responseData['programOrder'];
          this.next();
          this.loading = false;
          this.addProblemDetail['programOrder'] = responseData['programOrder'];
        }).catch(
          error => {
            this.loading = false;
            this.$notify.error(error);
          }
        )
      }).catch(
        error => {
          this.loading = false;
        }
      );
      this.loading = false;
    },
    languageStringToInt() {
      const StringToIntObject = {'MySQL': 0, 'SQLite': 1, 'PostgreSQL': 2};
      this.addProblemDetail.language = StringToIntObject[this.addProblemDetail.language];
    },
    onAddProblemDetail() {
      if (this.addproblemform.questionTitle === '' || this.addproblemform.description === '') {
        this.$notify.error({title: '信息不足!', message: "需要既有标题也有描述.",})
        return;
      }

      this.$confirm("确定添加补充吗？", "补充题目", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.languageStringToInt();
        this.loading = true;
        this.$axios.post('/commit/update', this.addProblemDetail, {
          headers: {'token': sessionStorage.getItem("token"),}
        }).then(response => {
          this.problemReceiveID = response.data['programOrder'];
          this.next();
          this.loading = false;
          this.$notify.success("题目添加成功");
        }).catch(
          error => {
            this.loading = false;
            this.$notify.error(error);
          }
        )
      }).catch(
        error => {
          this.loading = false;
        }
      );
      this.loading = false;
    }
  },
  created() {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
