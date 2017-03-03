<template>
    <div id="app">
        <transition enter-active-class="animated fadeInRight" leave-active-class="">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
        </transition>
    </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {

    }
  }
}

</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

</style>
