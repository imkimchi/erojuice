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
</template>

<script>
  import chunk from 'lodash.chunk'
  export default {
      name: 'main',
      
      data: () => ({
        items: [],
        lines: 0,
      }),
      
      async created () {
        this.items = await fetch('/video').then(res => res.json())
        this.lines = Math.ceil(this.items.length/4)
      },

      computed: {
          columns: function() {
              return chunk(this.items, 4)
          }
      }
  }
</script>