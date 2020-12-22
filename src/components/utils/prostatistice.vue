<template>
  <el-card shadow="always">
    <h3>{{ title }}</h3>
    <el-row :gutter="10">
      <el-col :span="3">
        <b>AC:</b>
      </el-col>
      <el-col :span="21">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="ac" status="success"></el-progress>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="3">
        <b>WA:</b>
      </el-col>
      <el-col :span="21">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="wa" status="exception"></el-progress>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">
        <b>TLE:</b>
      </el-col>
      <el-col :span="21">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="tle" color="#FF9800"></el-progress>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">
        <b>MLE:</b>
      </el-col>
      <el-col :span="21">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="mle" color="#795548"></el-progress>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="3">
        <b>RE:</b>
      </el-col>
      <el-col :span="21">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="re" status="exception"></el-progress>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "prostatistice",
  data() {
    return {
      ac: 100,
      mle: 100,
      tle: 100,
      wa: 100,
      re: 100,
      title: "Statistics",
    };
  },
  created() {
  },
  methods: {
    setdata(d) {
      console.log(d);
      console.log("setdata d");
      this.ac = d.ac
      this.wa = d.wa
      this.mle = d.mle
      this.tle = d.tle
      this.re = d.re
      this.title = d.title
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#leveltag {
  text-align: center;
  font-weight: bold;
}

.el-row {
  margin-bottom: 20px;
}
</style>
