<template>
  <el-row :gutter="15">
    <el-col :span="18">
      <el-row>
        <el-card shadow="always">
          <el-row :gutter="18"
                  id="title">{{ this.proid + " " }}{{ title }}
          </el-row>
          <br>
          <img :src="'data:image/jpeg;base64,'+imgcode"
               class="img-responsive" v-if="imgcode!=''">
          <el-row :gutter="18"
                  id="des">Description
          </el-row>
          <el-row :gutter="18"
                  id="detail">
            <!--            <div style="margin-right:50px;word-break:break-all;white-space:pre-line;"-->
            <!--                 v-html="input"></div>-->
            <div>
              <VueMarkdown :source="detail_markdown"></VueMarkdown>
            </div>

          </el-row>
          <br>
        </el-card>
      </el-row>
      <el-row>
        <el-card shadow="always">
          <el-row :gutter="15">
            <el-col :span="3">
              <div id="des"
                   style="padding: 5px 10px;">Language:
              </div>
            </el-col>
            <el-col :span="2">
              <el-select v-model="language"
                         placeholder="请选择"
                         @change="changetemplate">
                <languageselect></languageselect>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button type="primary"
                         @click="submit"
                         style="font-weight:bold;margin-left:10px;">Submit
              </el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="primary"
                         @click="code = ''"
                         style="font-weight:bold;margin-left:10px;">Reset
              </el-button>
            </el-col>

            <el-col :span="15">
              <el-button round
                         :type="judgetype"
                         :loading="loadingshow"
                         style="font-weight:bold;margin-left:10px;"
                         @click="showdialog">{{ submitbuttontext }}
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <codemirror v-model="code"
                        :options="cmOptions"></codemirror>
          </el-row>
        </el-card>
      </el-row>
    </el-col>

    <el-col :span="6">
      <el-row :gutter="15">
        <el-card shadow="always">
          <el-collapse v-model="activeNames">
            <el-collapse-item name="4"
                              id="des">
              <template slot="title">
                <font color="deepskyblue"
                      size="4">Time:</font>
              </template>
              <div>{{ time }}</div>
            </el-collapse-item>
            <el-collapse-item name="5"
                              id="des">
              <template slot="title">
                <font color="deepskyblue"
                      size="4">Memory:</font>
              </template>
              <div>{{ memory }}</div>
            </el-collapse-item>
            <el-collapse-item name="5"
                              id="des">
              <template slot="title">
                <font color="red"
                      size="14">DDL:</font>
              </template>
              <div>{{ ddl }}</div>
            </el-collapse-item>
            <!--            <el-collapse-item name="6"
                                          id="des">
                          <template slot="title">
                            <font color="deepskyblue"
                                  size="4">Tags:</font>
                          </template>
                          <el-tag id="tag"
                                  v-for="(name,index) in tagnames"
                                  :key="index"
                                  size="medium"
                                  type="info"
                                  disable-transitions
                                  hit>{{ name }}
                          </el-tag>
                        </el-collapse-item>-->
          </el-collapse>
        </el-card>
      </el-row>
      <el-row :gutter="15">
        <prostatistice ref="prosta"></prostatistice>
      </el-row>
      <el-row :gutter="15">
        <el-card>
          <h3>提交记录</h3>
          <statusmini ref="Statusmini"></statusmini>
        </el-card>
      </el-row>
    </el-col>
  </el-row>
</template>

<style scope>
.CodeMirror {
  height: 500px;
}
</style>
<script>
import moment from "moment";
import VueMarkdown from "vue-markdown";
import {codemirror} from "vue-codemirror";
import statusmini from "@/components/utils/statusmini";
import languageselect from "@/components/utils/languageselect";
import prostatistice from "@/components/utils/prostatistice";

require("codemirror/lib/codemirror.css");
require("codemirror/theme/base16-light.css");
require("codemirror/mode/clike/clike");
const loadshLibiary = require('lodash');

export default {
  name: "problemdetail",
  components: {
    codemirror,
    statusmini,
    prostatistice,
    languageselect,
    VueMarkdown
  },
  data() {
    return {
      imgcode: "",
      ip: "",
      userip: "",
      cmOptions: {
        tabSize: 4,
        mode: "text/x-c++src",
        theme: "base16-light",
        lineNumbers: true
      },
      title: "",
      mdfile: "#####TEST Index",
      input: "",
      output: "",
      sinput: ["", ""],
      soutput: ["", ""],
      /* author: "", */
      addtime: "",
      /* oj: "", */
      proid: "",
      /*source: "",*/
      time: "",
      memory: "",
      ddl: "",
      hint: "",
      tagnames: [],
      activeNames: ["1", "2", "3", "4", "5", "6"],
      level: "Easy",
      code: "",
      language: "CHOICE!",
      commitLanguageTypeInt: 0,
      codetemplate: {'MySQL': '', 'SQLite': '', 'PostgreSQL': ''},
      ac: 100,
      mle: 100,
      tle: 100,
      wa: 100,
      re: 100,
      submitbuttontext: "提交后请勿重复刷新/支持将文件拖入代码框",
      judgetype: "primary",
      loadingshow: false,
      submitid: -1,
      detail_markdown: ""
    };
  },
  watch: {
    des: function () {
      console.log('data changed');
      this.$nextTick().then(() => {
        this.reRender();
      });
    }
  },
  created() {

    //var myip = require('ip');
    //this.userip = myip.address();
    this.ID = this.$route.query.problemID;
    console.log(this.ID);
    console.log(typeof this.ID);
    if (!this.ID) {
      this.$message.error("参数错误" + "(" + this.ID + ")");
      return;
    }
    //let auth = 1;


    this.$axios
      .get("/showpic/", {
        params: {
          ProblemId: this.$route.query.problemID
        }
      })
      .then(res => {
        this.imgcode = res.data;
      });
    this.$axios
      .get(
        loadshLibiary.template('/problems/<%= problemId %>')({'problemId': this.ID})
      )
      .then(response => {
          this.title = response.data.name;
          console.log("line 241");
          // auth = response.data.auth;
          // if ((auth == 2 || auth == 3) && (sessionStorage.type == 1 || sessionStorage.type == "")) {
          //   this.title = "非法访问！请在比赛中访问题目！";
          //   this.$message.error("服务器错误！" + "(" + "无权限" + ")");
          //   return;
          // }
          this.proid = this.ID
          //this.mdfile = "#####TEST Index";//
          // this.detail_markdown = "#####TEST Index";
          console.log(response.data.description);
          // this.des = response.data.description;
          this.detail_markdown = response.data.description;
          this.input = response.data.description;
          this.output = response.data.output;
          // this.sinput = response.data.sinput.split("|#)"); //分隔符
          // this.soutput = response.data.soutput.split("|#)");
          // this.author = response.data.author;
          // this.addtime = response.data["addtime"] = moment(
          //   response.data["addtime"]
          // ).format("YYYY-MM-DD HH:mm:ss");

          /* this.oj = response.data.oj; */
          /*this.source = response.data.source;*/
          this.time = "Display After Choice Language MS";
          console.log(response.data["deadline"]);
          this.ddl = moment(response.data["deadline"] * 1000).format("YYYY-MM-DD HH:MM");
          this.memory = "Display After Choice Language MB";
          this.hint = response.data.hint;

          // var li = response.data.template.split("*****")
          // for (var i = 1; i < li.length; i += 2) {
          //   this.codetemplate[li[i]] = li[i + 1]
          // }
          this.code = this.codetemplate[this.language]

          /* if (this.oj != "LPOJ") {
            this.proid = this.source
          } */
          this.$axios
            .get(
              loadshLibiary.template('/persona/<%= username %>/<%= questionId %>')
              ({'questionId': this.ID, 'username': sessionStorage.getItem('username')}),
              {headers: {'token': sessionStorage.getItem("token"),}}
            )
            .then(response => {
              let transferObject = {'ac': 0, 'wa': 0, 'mle': 0, 'tle': 0, 're': 0, 'title': 'Not Any Submission'};
              if (response.data['submission'] !== 0) {
                const tobeDivideNumber = response.data['submission'];
                let parseFloatToNumber = function (inData, divideNumber) {
                  return parseFloat(((inData * 100) / divideNumber).toFixed(2))
                }
                this.ac = parseFloatToNumber(response.data.ac, tobeDivideNumber);
                this.mle = parseFloatToNumber(response.data.mle, tobeDivideNumber);
                this.tle = parseFloatToNumber(response.data.tle, tobeDivideNumber);
                this.wa = parseFloatToNumber(response.data.wa, tobeDivideNumber);
                this.re = parseFloatToNumber(response.data.re, tobeDivideNumber);
                transferObject = {
                  'ac': this.ac,
                  'wa': this.wa,
                  'mle': this.mle,
                  'tle': this.tle,
                  're': this.re,
                  'title': 'Statusmini'
                }
                console.log(this.re);
              }
              // console.log(this.$data);
              // //this.$refs.prosta.setdata(this.$data)
              // console.log(this.$refs["Statusmini"])
              // console.log(this.ID);
              // console.log(sessionStorage.username);
              // response.data["title"] = "Statusmini";
              this.$refs.prosta.setdata(transferObject);
            })
            .catch(error => {
              this.$message.error(loadshLibiary.template('服务器错误！/<%= WrongInfo %>')({'WrongInfo': error.response}));
              this.$message.error('请检查是否登录!!!');
            });
          // this.$axios
          //   .get("/problemdata/" + this.ID + "/")
          //   .then(response => {
          //     if (response.data["tag"] == null) response.data["tag"] = ["无"];
          //     else response.data["tag"] = response.data["tag"].split("|");
          //
          //     if (response.data.submission == 0) {
          //       this.ac = 0;
          //       this.mle = 0;
          //       this.tle = 0;
          //       this.rte = 0;
          //       this.pe = 0;
          //       this.ce = 0;
          //       this.wa = 0;
          //       this.se = 0;
          //     } else {
          //       this.ac = parseFloat(
          //         ((response.data.ac * 100) / response.data.submission).toFixed(2)
          //       );
          //       this.mle = parseFloat(
          //         ((response.data.mle * 100) / response.data.submission).toFixed(
          //           2
          //         )
          //       );
          //       this.tle = parseFloat(
          //         ((response.data.tle * 100) / response.data.submission).toFixed(
          //           2
          //         )
          //       );
          //       this.rte = parseFloat(
          //         ((response.data.rte * 100) / response.data.submission).toFixed(
          //           2
          //         )
          //       );
          //       this.pe = parseFloat(
          //         ((response.data.pe * 100) / response.data.submission).toFixed(2)
          //       );
          //       this.ce = parseFloat(
          //         ((response.data.ce * 100) / response.data.submission).toFixed(2)
          //       );
          //       this.wa = parseFloat(
          //         ((response.data.wa * 100) / response.data.submission).toFixed(2)
          //       );
          //       this.se = parseFloat(
          //         ((response.data.se * 100) / response.data.submission).toFixed(2)
          //       );
          //     }
          //
          //     this.title = response.data.title;
          //     this.tagnames = response.data.tag;
          //     this.$refs.prosta.setdata(this.$data)
          //     console.log(this.$refs["Statusmini"])
          //     this.$refs["Statusmini"].setstatus(this.ID, sessionStorage.username, "");
          //
          //   })
          //   .catch(error => {
          //     this.$message.error("服务器错误！" + "(" + JSON.stringify(error.response.data) + ")");
          //   });
        }
      )
      .catch(error => {
        this.title = "非法访问！请在比赛中访问题目！";
        this.$message.error("服务器错误！" + "(" + JSON.stringify(error.response.data) + ")");
      });
  },
  methods: {
    showdialog() {
      if (this.submitid != -1)
        this.$refs["Statusmini"].showdialog(this.submitid)
    }
    ,
    changetemplate(lang) {
      console.log("changetemplate");
      console.log(lang);
      const StringToIntObject = {'MySQL': 0, 'SQLite': 1, 'PostgreSQL': 2};
      this.commitLanguageTypeInt = StringToIntObject[lang];
      //this.$axios.post("/problems/info/{questionid}/{language}")
      const codetemplateElement = this.codetemplate[lang];
      console.log(codetemplateElement);
      if (codetemplateElement === '') {
        this.$confirm("确定切换语言吗？", "切换后当前代码不会保存！", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.code = this.codetemplate[lang];
        })
      }
      const compiled = loadshLibiary.template('/problems/info/<%= problemId %>/<%= language %>')
      ({'problemId': this.ID, 'language': lang});
      console.log(compiled);
      this.$axios.get(compiled)
        .then(response => {
          this.time = response.data['time'] * 1000 + "MS";
          this.memory = response.data['memory'] / 1000 + "MB";
        })
    }
    ,
    reRender() {
      if (window.MathJax) {
        console.log('rendering mathjax');
        MathJax.Hub.Config({
          tex2jax: {
            inlineMath: [['$', '$'], ["\\(", "\\)"]],
            displayMath: [['$$', '$$'], ["\\[", "\\]"]]
          }
        });
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub], () => console.log('done'));
      }
    }
    ,
    onCopy(e) {
      this.$message.success("复制成功！");
    }
    ,
    // 复制失败
    onError(e) {
      this.$message.error("复制失败：" + e);
    }
    ,
    problemlevel: function (type) {
      if (type === "Easy") return "info";
      if (type === "Medium") return "success";
      if (type === "Hard") return "";
      if (type === "VeryHard") return "warning";
      if (type === "ExtremelyHard") return "danger";
    }
    ,
    submit: function () {
      this.submitbuttontext = 'Judgeing...';
      /*if (this.addtime == "") {
        this.$message.error("非法操作！");
        return;
      }*/
      if (!sessionStorage.username) {
        this.$message.error("请先登录！");
        return;
      }
      if (!this.code) {
        this.$message.error("请输入代码！");
        return;
      }
      if (!this.language) {
        this.$message.error("请选择语言！");
        return;
      }

      if (this.code.length < 20) {
        this.$message.error("代码过短！");
        return;
      }

      this.$confirm("确定提交吗？", "提交", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$message({
          type: "success",
          message: "提交中..."
        });
        //this.$axios.get("/currenttime/").then(response2 => {
        // console.log(this.userip);
        //var curtime = response2.data;
        //this.$axios.get("/")
        this.$axios
          .post("/commit/query/" + this.ID, {
            username: sessionStorage.username,
            /* oj: this.oj, */
            questionId: this.ID,
            language: this.commitLanguageTypeInt,
            commitCode: this.code,
            testOrRun: 0,
            /* message: this.oj == "LPOJ" ? "0" : (this.proid + ""),
            problemtitle: (this.oj == "LPOJ" ? "LPOJ" : "") + (this.oj == "LPOJ" ? ' - ' : "") + (this.oj == "LPOJ" ? this.proid : "") + ' ' + this.title, */
          }, {
            headers: {
              'token': sessionStorage.getItem("token"),
            }
          })
          .then(response => {
            this.$message({
              message: "提交成功！",
              type: "success"
            });
            // clearInterval(this.$store.state.submittimer);
            // this.submitid = response.data.id;
            this.submitbuttontext = response.data.commitLog.state;
            this.judgetype = "";
            // this.loadingshow = true;
            //创建一个全局定时器，定时刷新状态
            // this.$store.state.submittimer = setInterval(this.timer, 3000);
          })
          .catch(error => {
            this.$message.error("服务器错误！" + "(请检查编码（代码需要utf-8编码）或联系管理员)");
            this.submitbuttontext = 'error';
          });
        //});
      });
    }
    ,
    timer: function () {
      if (this.submitbuttontext == "提交后请勿重复刷新/支持将文件拖入代码框") return;
      this.$axios
        .get(
          loadshLibiary.template('/judgestatus/<%= submitid %>/')({'submitid': this.submitid})
        )
        .then(response => {
          this.loadingshow = false;
          var testcase = response.data["testcase"];
          if (response.data["result"] == "-1") {
            response.data["result"] = "Pending";
            this.loadingshow = true;
            this.judgetype = "info";
          }

          if (response.data["result"] == "-2") {
            response.data["result"] = "Judging";
            this.loadingshow = true;
            this.judgetype = "";
          }

          if (response.data["result"] == "-3") {
            response.data["result"] = "Wrong Answer on test " + testcase;
            this.judgetype = "danger";
            clearInterval(this.$store.state.submittimer);
            if (testcase == "?")
              response.data["result"] = "Wrong Answer"
          }

          if (response.data["result"] == "-4") {
            response.data["result"] = "Compile Error";
            this.judgetype = "warning";
            clearInterval(this.$store.state.submittimer);
          }

          if (response.data["result"] == "-5") {
            response.data["result"] = "Presentation Error on test " + testcase;
            this.judgetype = "warning";
            clearInterval(this.$store.state.submittimer);
            if (testcase == "?")
              response.data["result"] = "Presentation Error"
          }

          if (response.data["result"] == "-6") {
            response.data["result"] = "Waiting";
            this.loadingshow = true;
            this.judgetype = "info";
          }

          if (response.data["result"] == "0") {
            response.data["result"] = "Accepted";
            this.judgetype = "success";
            clearInterval(this.$store.state.submittimer);
          }

          if (response.data["result"] == "1") {
            response.data["result"] = "Time Limit Exceeded on test " + testcase;
            this.judgetype = "warning";
            clearInterval(this.$store.state.submittimer);
            if (testcase == "?")
              response.data["result"] = "Time Limit Exceeded"
          }

          if (response.data["result"] == "2") {
            response.data["result"] = "Time Limit Exceeded on test " + testcase;
            this.judgetype = "warning";
            clearInterval(this.$store.state.submittimer);
            if (testcase == "?")
              response.data["result"] = "Time Limit Exceeded"
          }

          if (response.data["result"] == "3") {
            response.data["result"] = "Memory Limit Exceeded on test " + testcase;
            this.judgetype = "warning";
            clearInterval(this.$store.state.submittimer);
            if (testcase == "?")
              response.data["result"] = "Memory Limit Exceeded"
          }

          if (response.data["result"] == "4") {
            response.data["result"] = "Runtime Error on test " + testcase;
            this.judgetype = "warning";
            clearInterval(this.$store.state.submittimer);
            if (testcase == "?")
              response.data["result"] = "Runtime Error"
          }

          if (response.data["result"] == "5") {
            response.data["result"] = "System Error";
            this.judgetype = "danger";
            clearInterval(this.$store.state.submittimer);
          }

          this.submitbuttontext = response.data["result"];
          this.$refs["Statusmini"].reflash(this.ID);
        });
    }
  }
  ,
  destroyed() {
    clearInterval(this.$store.state.submittimer);
  }
}
;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#tag {
  text-align: center;
  font-weight: bold;
  margin-right: 13px;
  margin-bottom: 13px;
}

#title {
  color: dimgrey;
  left: 10px;
  font-size: 20px;
}

#des {
  color: deepskyblue;
  font-weight: bold;
  left: 20px;
  font-size: 20px;
}

#detail {
  left: 30px;
  font-size: 16px;
}

#text {
  font-weight: normal;
  font-size: 15px;
  white-space: pre-wrap;
  margin-right: 40px;
}

#data {
  left: 30px;
  padding: 5px 10px;
  color: dimgray;
  background: #f8f8f9;
  border: 1px dashed #e9eaec;
}

.el-row {
  margin-bottom: 20px;
}

.img-responsive {
  display: inline-block;
  height: auto;
  max-width: 75%;
}
</style>
