<template>
  <el-row :gutter="15">
    <el-col :span="18">
      <el-card shadow="always">
        <!-- <el-switch style="float: right;"
                   v-model="islpoj"
                   active-text="LPOJ"
                   inactive-text="All"
                   @change="statuechange"></el-switch> -->
        <el-pagination :current-page="currentpage"
                       v-if= 'false'
                       :page-size="pagesize"
                       :page-sizes="[15, 20, 30, 50]"
                       :total="totalproblem"
                       layout="total, sizes, prev, pager, next, jumper"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"></el-pagination>
        <el-table :data="tableData"
                  :row-class-name="tableRowClassName"
                  size="small"
                  @cell-mouse-enter="changestatistices"
                  @cell-click="problemclick">
          <el-table-column :width="170"
                           label="ID"
                           prop="programOrder"></el-table-column>
          <el-table-column :width="400"
                           label="Title"
                           prop="name"></el-table-column>
          <!--          <el-table-column prop="level"-->
          <!--                           label="Level"-->
          <!--                           :width="170">-->
          <!--            <template slot-scope="scope1">-->
          <!--              <el-tag id="leveltag"-->
          <!--                      size="medium"-->
          <!--                      :type="problemlevel(scope1.row.level)"-->
          <!--                      disable-transitions-->
          <!--                      hit>{{ scope1.row.level }}</el-tag>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column prop="rate"-->
          <!--                           label="A/S"-->
          <!--                           :width="200"></el-table-column>-->
          <!-- <el-table-column prop="tag"
                           label="Tag">
            <template slot-scope="scope">
              <el-tag id="protag"
                      v-for="(name,index) in scope.row.tag"
                      :key="index"
                      size="medium"
                      disable-transitions
                      hit>{{ name }}</el-tag>
            </template>
          </el-table-column> -->
          <!--<el-table-column prop="score"
                           label="Score"
                           :width="200"></el-table-column>-->
        </el-table>
        <center>
          <el-pagination :current-page="currentpage"
                         :page-size="pagesize"
                         v-if= 'false'
                         :page-sizes="[15, 20, 30, 50]"
                         :total="totalproblem"
                         layout="total, sizes, prev, pager, next, jumper"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"></el-pagination>
        </center>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-row :gutter="15">
        <el-col>
          <prostatistice ref="prosta"></prostatistice>
        </el-col>
      </el-row>
      <!--      <el-row>-->
      <!--        <el-card shadow="always">-->
      <!--          <el-input placeholder="Search..."-->
      <!--                    v-model="searchtext"-->
      <!--                    @keyup.native.enter="searchtitle">-->
      <!--            <el-button slot="append"-->
      <!--                       icon="el-icon-search"-->
      <!--                       @click="searchtitle"></el-button>-->
      <!--          </el-input>-->
      <!--        </el-card>-->
      <!--      </el-row>-->
      <!-- <el-row :gutter="15">
        <el-col>
          <el-card shadow="always">
            <h4>Tags (Click to filter)</h4>
            <el-button id="tag"
                       v-for="(name,index) in tagnames"
                       :key="index"
                       size="mini"
                       @click="tagclick(name)"
                       :ref="name">{{ name }}</el-button>
          </el-card>
        </el-col>
      </el-row> -->
    </el-col>
  </el-row>
</template>

<script>
prostatistice;
import prostatistice from "@/components/utils/prostatistice";

const loadshLibiary = require('lodash');

export default {
  components: {
    prostatistice
  },
  data() {
    return {
      currentpage: 1,
      pagesize: 15,
      totalproblem: 10,
      tableData: [],
      // tagnames: [],
      ac: 100,
      mle: 100,
      tle: 100,
      wa: 100,
      re: 100,
      title: "Statistics",
      // currenttag: "",
      /* islpoj: true, */
      searchtext: "",
      /* searchoj: "LPOJ" */
      // searchoj: ""
    };
  },
  methods: {
    statuechange(val) {
      /* if (val == true) {
        this.searchoj = "LPOJ"
      } else {
        this.searchoj = ""
      } */
      this.searchtitle()
    },
    searchtitle() {
      this.currentpage = 1;
      this.$axios
        .get(
          "/problems"
          // this.pagesize +
          // "&offset=" +
          // (this.currentpage - 1) * this.pagesize +
          // "&auth=1&search=" +
          // this.searchtext
          /* +"&oj=" + this.searchoj */
          // +"&oj=" + this.searchoj
        )
        .then(response => {
          // for (var i = 0; i < response.data.results.length; i++) {
          //
          //   response.data.results[i]["rate"] =
          //     response.data.results[i]["ac"] +
          //     "/" +
          //     response.data.results[i]["submission"];
          //
          //   if (response.data.results[i]["tag"] == null)
          //     response.data.results[i]["tag"] = ["无"];
          //   else
          //     response.data.results[i]["tag"] = response.data.results[i][
          //       "tag"
          //     ].split("|");
          // }
          this.tableData = response.data.results;
          this.totalproblem = response.data.count;
        });
    },
    // tagclick (name) {
    //   if (this.currenttag.indexOf(name) >= 0) {
    //     this.$refs[name][0].type = "default";
    //     var li = this.currenttag.split("+");
    //     for (var i = 0; i < li.length; i++) {
    //       if (li[i] == name) {
    //         li.splice(i, 1);
    //         break;
    //       }
    //     }
    //     this.currenttag = li.join("+");
    //   } else {
    //     this.$refs[name][0].type = "primary";
    //     var li = this.currenttag.split("+");
    //     li.push(name);
    //     this.currenttag = li.join("+");
    //   }
    //   this.searchtext = this.currenttag;
    //   this.currentpage = 1;
    //   this.$axios
    //     .get(
    //       "/problemdata/?limit=" +
    //       this.pagesize +
    //       "&offset=" +
    //       (this.currentpage - 1) * this.pagesize +
    //       "&auth=1&search=" +
    //       this.searchtext
    //       /* +"&oj=" + this.searchoj */
    //       +"&oj=" + this.searchoj
    //     )
    //     .then(response => {
    //       for (var i = 0; i < response.data.results.length; i++) {
    //         if (response.data.results[i]["level"] == "1")
    //           response.data.results[i]["level"] = "Easy";
    //         if (response.data.results[i]["level"] == "2")
    //           response.data.results[i]["level"] = "Medium";
    //         if (response.data.results[i]["level"] == "3")
    //           response.data.results[i]["level"] = "Hard";
    //         if (response.data.results[i]["level"] == "4")
    //           response.data.results[i]["level"] = "VeryHard";
    //         if (response.data.results[i]["level"] == "5")
    //           response.data.results[i]["level"] = "ExtremelyHard";
    //
    //         response.data.results[i]["rate"] =
    //           response.data.results[i]["ac"] +
    //           "/" +
    //           response.data.results[i]["submission"];
    //
    //         if (response.data.results[i]["tag"] == null)
    //           response.data.results[i]["tag"] = ["无"];
    //         else
    //           response.data.results[i]["tag"] = response.data.results[i][
    //             "tag"
    //           ].split("|");
    //       }
    //       this.tableData = response.data.results;
    //       this.totalproblem = response.data.count;
    //     });
    // },
    // handleSizeChange (val) {
    //   this.pagesize = val;
    //
    //   this.$axios
    //     .get(
    //       "/problemdata/?limit=" +
    //       this.pagesize +
    //       "&offset=" +
    //       (this.currentpage - 1) * this.pagesize +
    //       "&auth=1&search=" +
    //       this.searchtext
    //       /* +"&oj=" + this.searchoj */
    //       // +"&oj=" + this.searchoj
    //     )
    //     .then(response => {
    //       // for (var i = 0; i < response.data.results.length; i++) {
    //       //   if (response.data.results[i]["level"] == "1")
    //       //     response.data.results[i]["level"] = "Easy";
    //       //   if (response.data.results[i]["level"] == "2")
    //       //     response.data.results[i]["level"] = "Medium";
    //       //   if (response.data.results[i]["level"] == "3")
    //       //     response.data.results[i]["level"] = "Hard";
    //       //   if (response.data.results[i]["level"] == "4")
    //       //     response.data.results[i]["level"] = "VeryHard";
    //       //   if (response.data.results[i]["level"] == "5")
    //       //     response.data.results[i]["level"] = "ExtremelyHard";
    //       //
    //       //   response.data.results[i]["rate"] =
    //       //     response.data.results[i]["ac"] +
    //       //     "/" +
    //       //     response.data.results[i]["submission"];
    //       //
    //       //   if (response.data.results[i]["tag"] == null)
    //       //     response.data.results[i]["tag"] = ["无"];
    //       //   else
    //       //     response.data.results[i]["tag"] = response.data.results[i][
    //       //       "tag"
    //       //     ].split("|");
    //       // }
    //       this.tableData = response.data.results;
    //       this.totalproblem = response.data.count;
    //     });
    // },
    // handleCurrentChange (val) {
    //   this.currentpage = val;
    //   this.$axios
    //     .get(
    //       "/problemdata/?limit=" +
    //       this.pagesize +
    //       "&offset=" +
    //       (this.currentpage - 1) * this.pagesize +
    //       "&auth=1&search=" +
    //       this.searchtext/*  +
    //       // "&oj=" + this.searchoj */
    //       // +"&oj=" + this.searchoj
    //     )
    //     .then(response => {
    //       // for (var i = 0; i < response.data.results.length; i++) {
    //       //   if (response.data.results[i]["level"] == "1")
    //       //     response.data.results[i]["level"] = "Easy";
    //       //   if (response.data.results[i]["level"] == "2")
    //       //     response.data.results[i]["level"] = "Medium";
    //       //   if (response.data.results[i]["level"] == "3")
    //       //     response.data.results[i]["level"] = "Hard";
    //       //   if (response.data.results[i]["level"] == "4")
    //       //     response.data.results[i]["level"] = "VeryHard";
    //       //   if (response.data.results[i]["level"] == "5")
    //       //     response.data.results[i]["level"] = "ExtremelyHard";
    //       //
    //       //   response.data.results[i]["rate"] =
    //       //     response.data.results[i]["ac"] +
    //       //     "/" +
    //       //     response.data.results[i]["submission"];
    //       //
    //       //   if (response.data.results[i]["tag"] == null)
    //       //     response.data.results[i]["tag"] = ["无"];
    //       //   else
    //       //     response.data.results[i]["tag"] = response.data.results[i][
    //       //       "tag"
    //       //     ].split("|");
    //       // }
    //       this.tableData = response.data.results;
    //       this.totalproblem = response.data.count;
    //     });
    // },
    tableRowClassName({row, rowIndex}) {
      var acpro = this.$store.state.acpro;
      if (acpro)
        if (acpro.indexOf(row.problem + "") != -1) {
          return "acrow";
        }
      return "";
    },
    // problemlevel: function (type) {
    //   if (type == "Easy") return "info";
    //   if (type == "Medium") return "success";
    //   if (type == "Hard") return "";
    //   if (type == "VeryHard") return "warning";
    //   if (type == "ExtremelyHard") return "danger";
    // },
    changestatistices: function (row, column, cell, event) {
    },
    problemclick: function (row, column, cell, event) {
      console.log("problemclick");
      console.log("what is in row?" + row);
      this.$router.push({
        name: "problemdetail",
        //query: { problemID: row.problem }
        query: {problemID: row.programOrder}
      });
    }
  },
  mounted() {
    this.$axios
      /* .get("/problemdata/?limit=15&offset=0&auth=1&oj=LPOJ") */
      .get("/problems")
      .then(response => {
        console.log(response.data);
        console.log(response.data.result);
        console.log(response.data.count);
        // for (var i = 0; i < response.data.results.length; i++) {
        //   if (response.data.results[i]["level"] == "1")
        //     response.data.results[i]["level"] = "Easy";
        //   if (response.data.results[i]["level"] == "2")
        //     response.data.results[i]["level"] = "Medium";
        //   if (response.data.results[i]["level"] == "3")
        //     response.data.results[i]["level"] = "Hard";
        //   if (response.data.results[i]["level"] == "4")
        //     response.data.results[i]["level"] = "VeryHard";
        //   if (response.data.results[i]["level"] == "5")
        //     response.data.results[i]["level"] = "ExtremelyHard";
        //
        //   response.data.results[i]["rate"] =
        //     response.data.results[i]["ac"] +
        //     "/" +
        //     response.data.results[i]["submission"];
        //
        //   if (response.data.results[i]["tag"] == null)
        //     response.data.results[i]["tag"] = ["无"];
        //   else
        //     response.data.results[i]["tag"] = response.data.results[i][
        //       "tag"
        //     ].split("|");
        // }
        this.tableData = response.data;
        this.totalproblem = 3; // fake number
        // this.totalproblem = response.data.count;
      });
    this.$axios
      .get('/persona/all/all')
      .then(response => {
        console.log(response);
        let transferObject = {'ac': 0, 'wa': 0, 'mle': 0, 'tle': 0, 're': 0, 'title': 'Not Any Submission'};
        if (response.data['submission'] !== 0) {
          const tobeDivideNumber = response.data['submission'];
          const parseFloatToNumber = function (inData, divideNumber) {
            return parseFloat(((inData * 100) / divideNumber).toFixed(2));
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
      });
  }
}
;
</script>


<style scope>
/*#leveltag {*/
/*  text-align: center;*/
/*  font-weight: bold;*/
/*}*/
/*#protag {*/
/*  text-align: center;*/
/*  font-weight: bold;*/
/*  margin-right: 7px;*/
/*  margin-bottom: 7px;*/
/*}*/
/*#tag {*/
/*  text-align: center;*/
/*  font-weight: bold;*/
/*  margin-left: 2px;*/
/*  margin-bottom: 5px;*/
/*}*/
/*.el-row {*/
/*  margin-bottom: 20px;*/
/*}*/
.el-table .acrow {
  background: #c7ffb8;
}
</style>
