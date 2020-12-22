<template>
  <el-row>
    <el-dialog :visible.sync="dialogVisible" width="80%" :append-to-body="true">
      <el-alert
        title="Program Message:"
        :type="'success'"
        :description="compilemsg"
        :closable="false"
        show-icon
        :show-close="false"
      ></el-alert>
      <el-alert title="你的代码：" type="info" :closable="false">
        <el-button
          size="mini"
          v-clipboard:copy="code"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError">Copy
        </el-button>
        <el-button
          size="mini"
          @click="downloadFile(curid,code)">Download
        </el-button>
        <el-tag>内存: {{ memoryCostOfThisCommitResult }} KB</el-tag>
        <el-tag>时间: {{ timeCostOfThisCommitResult }} MS</el-tag>
        <el-tag>状态: {{ stateofThisCommitResult }}</el-tag>
      </el-alert>
      <codemirror v-model="code" :options="cmOptions">1145141919810</codemirror>

      <el-collapse>
        <el-collapse-item :key="index" v-for="(data,index) in dialogdata" v-if="data.casedata!=''">
          <template slot="title">
            <el-alert
              :show-icon="true"
              :type="data.caseresult=='Accepted'?'success':(data.caseresult=='Wrong Answer'?'error':'warning')"
              :closable="false"
              v-show="data.casedata!=''"
            >
              <template slot="title">
                <b>{{ ' ' + data.caseresult + ' on test ' + data.casetitle }}</b>
              </template>
            </el-alert>
          </template>
          <el-alert
            :title="''"
            :type="data.caseresult=='Accepted'?'success':(data.caseresult=='Wrong Answer'?'error':'warning')"
            :closable="false"
            v-show="data.casedata!=''"
          >
            <h5
              style="white-space:pre;margin-left:15px;"
              v-if="data.casedata!=''"
            >{{ 'Time: ' + data.casetime + 'MS' + ' Memory: ' + data.casememory + 'MB' }}</h5>
            <h5 style="white-space:pre;margin-left:15px;" v-if="data.casedata!=''">Test Input:</h5>
            <div

              style="white-space:pre;margin-left:15px;word-wrap:break-word;word-break: normal;"
              v-if="data.casedata!=''"
            >{{ data.casedata + '\n' }}
            </div>

            <h5 style="white-space:pre;margin-left:15px;" v-if="data.casedata!=''">Your Output:</h5>
            <div
              style="white-space:pre;margin-left:15px;word-wrap:break-word;word-break: normal;"
              v-if="data.casedata!=''"
            >{{ data.caseuseroutput + '\n' }}
            </div>

            <h5 style="white-space:pre;margin-left:15px;" v-if="data.casedata!=''">Expected Output:</h5>
            <div
              style="white-space:pre;margin-left:15px;word-wrap:break-word;word-break: normal;"
              v-if="data.casedata!=''"
            >{{ data.caseoutputdata + '\n' }}
            </div>
          </el-alert>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
    <el-table
      :default-sort="{prop: 'id', order: 'descending'}"
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      @row-click="rowClick"
      size="mini"
    >
      <el-table-column prop="id" label="ID" :width="70"></el-table-column>
      <el-table-column prop="result" label="Status" :width="180">
        <template slot-scope="scope">
          <el-tag size="mini" :type="statuetype(scope.row.result)" disable-transitions hit>
            {{ scope.row.result }}
            <i class="el-icon-loading" v-show="statuejudge(scope.row.result)"></i>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="submittime" align="right">
        <template slot="header" slot-scope="scrop">
          <el-button size="mini" @click="reflash" type="primary">刷新</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>


<style scope>
.el-table .warning-row {
  background: #fffed4;
}

.el-table .success-row {
  background: #e6ffdf;
}

.el-table .info-row {
  background: #fffff7;
}

.el-table .judging-row {
  background: #f3ffff;
}

.el-table .danger-row {
  background: #ffe6e6;
}

.el-tag {
  text-align: center;
  font-weight: bold;
}

</style>


<script>
import moment from "moment";
import {codemirror} from "vue-codemirror";

require("codemirror/lib/codemirror.css");
require("codemirror/theme/base16-light.css");
require("codemirror/mode/clike/clike");
const loadshLibiary = require('lodash');

export default {
  name: "statuemini",

  components: {
    codemirror
  },
  methods: {
    onCopy(e) {
      this.$message.success("复制成功！");
    },
    // 复制失败
    onError(e) {
      this.$message.error("复制失败：" + e);
    },
    showdialog(id, result) {
      //this.dialogdata = [];
      this.code = '';
      this.stateofThisCommitResult = result;
      const compiled = loadshLibiary.template('/commit/judgestatuscode/<%= commitLogId %>')
      ({'commitLogId': id});
      console.log("statusmini showidalog");
      this.$axios
        .post(compiled,
          {'username': sessionStorage.getItem('username'), 'handInId': 114514},
          {
            headers: {'token': sessionStorage.getItem("token"),}
          }
        )
        .then(response => {
          const responseData = response.data;
          this.memoryCostOfThisCommitResult = responseData['ramsize'];
          this.timeCostOfThisCommitResult = responseData['cputime'];
          this.code = responseData['code'];
          console.log(compiled);
          console.log(responseData);
        })
        .catch(error => {
          this.code = "出现错误!!" + error;
        });
      this.dialogVisible = true;
    },

    rowClick(row, col, e) {
      console.log(row);
      console.log("rowClick");
      this.showdialog(row.id, row.result)
    },

    tableRowClassName({row, rowIndex}) {
      if (row.result == "Pending") return "info-row";
      if (row.result == "Judging") return "judging-row";
      if (row.result == "Wrong Answer") return "danger-row";
      if (row.result == "Compile Error") return "warning-row";
      if (row.result == "Presentation Error") return "warning-row";
      if (row.result == "Waiting") return "info-row";
      if (row.result == "Accepted") return "success-row";
      if (row.result == "Time Limit Exceeded") return "warning-row";
      if (row.result == "Time Limit Exceeded") return "warning-row";
      if (row.result == "Memory Limit Exceeded") return "warning-row";
      if (row.result == "Runtime Error") return "warning-row";
      if (row.result == "System Error") return "warning-row";
      return "";
    },
    statuetype: function (type) {
      if (type == "Pending") return "info";
      if (type == "Judging") return "";
      if (type == "Wrong Answer") return "danger";
      if (type == "Compile Error") return "warning";
      if (type == "Presentation Error") return "warning";
      if (type == "Waiting") return "info";
      if (type == "Accepted") return "success";
      if (type == "Time Limit Exceeded") return "warning";
      if (type == "Time Limit Exceeded") return "warning";
      if (type == "Memory Limit Exceeded") return "warning";
      if (type == "Runtime Error") return "warning";
      if (type == "System Error") return "danger";

      return "danger";
    },
    statuejudge: function (type) {
      if (type == "Pending") return true;
      if (type == "Judging") return true;
      if (type == "Wrong Answer") return false;
      if (type == "Compile Error") return false;
      if (type == "Presentation Error") return false;
      if (type == "Waiting") return true;
      if (type == "Accepted") return false;
      if (type == "Time Limit Exceeded") return false;
      if (type == "Time Limit Exceeded") return false;
      if (type == "Memory Limit Exceeded") return false;
      if (type == "Runtime Error") return false;
      if (type == "System Error") return false;
      return false;
    },

    setstatus(problem, username, contest) {
      console.log("this setstatus");
      this.tableData = [];
      this.problemId = this.$route.query.problemID;
      this.problem = problem;
      this.username = username;
      this.contest = contest;
      this.reflash()
    },

    reflash() {
      console.log("enter reflash of statusmini");
      this.$axios
        .post(
          loadshLibiary.template('/commit/history/<%= questionId %>')({'questionId': this.problemId}),
          {'username': sessionStorage.getItem('username')},
          {
            headers: {'token': sessionStorage.getItem("token"),}
          })
        .then(response => {
          console.log(response);
          let will_setToTableData = [];
          for (let i = 0; i < response.data.length; i++) {
            const responseElement = response.data[i];
            const tableDataOneElement = {
              'id': responseElement['commitLogId'],
              'result': responseElement['state'],
              'submittime': moment(responseElement["seconds"] * 1000).format('YYYY-MM-DD HH:MM'),
            };
            will_setToTableData.push(tableDataOneElement);
          }
          this.tableData = will_setToTableData;
        });
    },
    downloadFile(codeid, content) {
      const tempDate = new Date();
      const timeStrOfNow = moment(tempDate.getTime()).format("YYYY-MM-DD_HH:mm:ss");
      const aLink = document.createElement("a");
      const blob = new Blob([content], {type: "data:text/plain"});
      const downloadElement = document.createElement("a");
      const href = window.URL.createObjectURL(blob); //创建下载的链接
      downloadElement.href = href;
      downloadElement.download = loadshLibiary.template('<%= name %>.sql')({'name': timeStrOfNow});
      document.body.appendChild(downloadElement);
      downloadElement.click(); //点击下载
      document.body.removeChild(downloadElement); //下载完成移除元素
      window.URL.revokeObjectURL(href); //释放掉blob对象
    }

  },
  data() {
    return {
      cmOptions: {
        tabSize: 4,
        mode: "text/x-c++src",
        theme: "base16-light",
        lineNumbers: true,
        readOnly: true,
        viewportMargin: Infinity,
        lineWrapping: true,
      },
      tableData: [],

      problem: -1,
      username: "",
      contest: "",
      curid: 0,
      curlang: 'sql',
      dialogVisible: false,
      code: "",
      compilemsg: "Commit History",
      dialogdata: [],
      memoryCostOfThisCommitResult: 0,
      timeCostOfThisCommitResult: 0,
      stateofThisCommitResult: 'AC'
    };
  },
  created() {
    if (this.$route.params.contestID) return;
    this.setstatus(false);
  }
};
</script>

