<template>
  <aside>
    <i class="el-icon-bangzhu logo"></i>

    <div class="menu">
      <el-tooltip effect="dark" content="文档" placement="right">
        <router-link to="/" class="menu__item">
          <i class="el-icon-reading"></i>
        </router-link>
      </el-tooltip>
      <el-tooltip effect="dark" content="历史" placement="right">
        <router-link to="/history" class="menu__item">
          <i class="el-icon-timer"></i>
        </router-link>
      </el-tooltip>
    </div>
  </aside>

  <main class="main">
    <router-view></router-view>
  </main>
</template>

<style lang="scss">
@import '@/assets/scss/theme';

html, body {
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  width: 100vw;
  font-family: alibaba, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  input {
    font-family: alibaba, Avenir, Helvetica, Arial, sans-serif;
  }
}

aside {
  flex: none;
  height: 100vh;
  width: 56px;
  background: #f7fafc;

  i {
    font-size: 24px;
    color: #2c3e50;
  }

  .logo {
    margin-top: 16px;
  }

  .menu {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-top: 24px;

    &__item {
      height: 48px;
      width: calc(100% - 4px);
      cursor: pointer;
      line-height: 56px;
      text-decoration: none;
      border-right: 2px solid transparent;
      border-left: 2px solid transparent;

      &:hover {
        background: #ecf5ff;
      }

      &.router-link-exact-active {
        border-right: 2px solid $primary;

        i {
          color: $primary;
        }
      }
    }
  }
}

main {
  height: 100vh;
  width: 100%;
  background: #f7fafc;
}
</style>
