<template>
  <div class="empty">
    <i class="el-icon-files"></i>
    <p>暂无数据</p>
  </div>
</template>

<script>
export default {
  name: 'None'
}
</script>

<style scoped lang="scss">
.empty {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;

  i {
    font-size: 56px;
  }
}
</style>
