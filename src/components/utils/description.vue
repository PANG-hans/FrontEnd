<template>
  <div>

    <center>
      <h2 style="color:#409EFF;">欢迎来到本OJ</h2>

      <h3>这是一个基于Vue.js和SpringBoot的轻量级在线评测系统</h3>
      <!--      <h3><a style="text-decoration: none;color:#409EFF;" target="_blank" href="https://www.lpoj.cn">-->
      <!--        欢迎访问公网版本 www.lpoj.cn-->
      <!--      </a></h3>-->
      <!--      <h3><a style="text-decoration: none;color:#67C23A;" target="_blank"-->
      <!--             href="https://docs.lpoj.cn/doc/oj.html#status%E8%AF%B4%E6%98%8E">使用文档-->
      <!--      </a></h3>-->

    </center>
    <el-divider></el-divider>
    <h2>FAQ：</h2>
    <h4>判题机使用Docker系统</h4>
    <h4>MySql: Docker消耗较大,可能出现延迟状况</h4>
    <h4>Sqlite: 启动较快,延迟较低</h4>
    <h4>PostGreSQL: Docker小消耗比较大,可能出现延迟</h4>
    <el-divider></el-divider>
    <br>

  </div>
</template>

<script>
export default {
  name: "description",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
</style>
