<template lang="pug">
.container
  .columns(v-for='column in columns')
    .column.is-3.vid(v-for='item in column')
        .panel
          p.is-marginless
           a(:href='item.videoId')
             img(:src='item.thumbnail')
          .panel.vidInfo
            .columns.hax-text-centered
              .column
                .panel-item.reddit-ups
                  span {{ item.score }}
                  i.fa.fa-reddit-alien.fa-2x
                .panel-item.reddit-date
                  i.fa.fa-calendar.fa-2x
  infinite-loading(:on-infinite='onInfinite', ref='infiniteLoading')
</template>

<script>
  import chunk from 'lodash.chunk'
  import InfiniteLoading from 'vue-infinite-loading'

  export default {
      name: 'main',
      
      data: () => ({
        items: [],
        lines: 0,
      }),
      
      async created () {
        this.items = await fetch('/videos').then(res => res.json())
        this.lines = Math.ceil(this.items.length/4)
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
            for(let i = this.columns; i <= this.list.length + 20; i++) {
              temp.push(i)
            }
            this.list = this.this.list.concat(temp)
            this.$refs = infiniteLoading.$emit('$InfiniteLoading:loaded')

          }, 700)
        },
      },
      
      components: {
        InfiniteLoading,
      },
   }
</script>