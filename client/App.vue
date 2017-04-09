<template lang="pug">
#app
  app-nav
  .section
    router-view
  app-footer
</template>

<script>
import AppNav from './components/AppNav.vue'
import AppFooter from './components/AppFooter.vue'

export default {
  name: 'app',
  components: {
    AppNav, AppFooter
  }
}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Roboto:900')
@import "~bulma/bulma.sass"

body
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"

.has-text-muted, .fa
  color: #95A5A6
  
.section
  background-color: rgba(27, 27, 27, 0.9)
  color: #ffffff

#top
  background-color: rgba(0, 0, 0, 0.9) !important

h1
  font-size: 3rem
  color: #fff

#nav-logo
  font-family: 'Roboto', sans-serif
  font-weight: 900
  font-size: 2.1rem
  color: #fff

.navbar-brand
  display: block
  line-height: 50px
  height: 50px
  vertical-align: middle
  background-image: url("https://assets.eroshare.com/assets/logo-eroshare-horizontal-0c85b5f0c03a8faaf8e82a383a8c067b.png")
  background-size: 100% auto
  background-position: center center
  width: 146px
  background-repeat: no-repeat

.vid-title
  font-size: 1.2rem
  color: #fff

.video-title:hover
  color: #e7614e
  transition: 1s

.vidInfo
  padding: 5px 10px 0
  background-color: #1b1b1b

.panel-item
  display: inline-block

.columns
  margin-top: 10px
  padding-bottom: 10px

.reddit-date
  margin-left: 3rem

.fa
  margin-right: 3px

img
  max-height: 100%
  display: block

body
  margin: 0
  padding: 0
</style>
