<template>
  <div>
    <el-option v-for="item in languagelist" :key="item" :label="item" :value="item"></el-option>
  </div>
</template>

<script>
const loadshLibiary = require('lodash');

export default {
  name: "languageselect",

  data() {
    return {
      languagelist: ["MySQL","SQLite","PostgreSQL"]
    };
  },
  created() {
    const compiled = loadshLibiary.template('/info/<%= problemId %>')
    ({'problemId': this.ID});
    console.log(compiled);
    console.log("languageselect");

    const sb = this.$store.state.sb;
    console.log(sb)
    if( sb === undefined){
      this.$axios
      .get(compiled)
      .then(result => {
        this.$store.state.sb = result.data
      })
      .catch(error => {
        this.$message.error(
          "服务器错误！" + "(" + JSON.stringify(error.response.data) + ")"
        );
      });
    }
    else{
      if (sb.length > 0) {
          this.languagelist = sb[0].openlanguage.split("|");
        }
    }

  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
