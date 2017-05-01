<template lang="pug">
.container
  .columns(v-for='column in list')
    .column.is-3.vid(v-for='item in column')
        .panel
          p.is-marginless
           a(:href="'//eroshare.com/'+item.videoId")
             img(:src='item.thumbnail' @error="isExist")
          .panel.vidInfol
            .columns.hax-text-centered
              .column
                .panel-item.reddit-ups
                  span {{ item.score }}
                  i.fa.fa-reddit-alien.fa-2x
                .panel-item.reddit-date
                  i.fa.fa-calendar.fa-2x
  infinite-loading(:on-infinite='onInfinite', ref='myRefName')
</template>

<script>
  import chunk from 'lodash.chunk'
  import InfiniteLoading from 'vue-infinite-loading'
  let len = 0;

  export default {
      name: 'main',
      
      data: () => ({
        items: [],
        list: []
      }),
      
      async created () {
        this.items = await fetch('/videos').then(res => res.json())
      },

      computed: {
          columns: function() {
              return chunk(this.items, 4)
          }
      },
    
      methods: {
        onInfinite() {
          setTimeout(() => {
            const temp = []
            for (let i = len; i <= len + 4; i++) {
              temp.push(this.columns[i])
            }

            this.list = this.list.concat(temp)
            this.$refs.myRefName.$emit('$InfiniteLoading:loaded')
            len += 5

          }, 700)
        },
        isExist() {
          this.src = '/broken-img.png'
        }
      },
      components: {
        InfiniteLoading
      }
   }
</script>

function is