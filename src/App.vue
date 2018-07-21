<template>
  <div class="app">
    <introduction></introduction>
    <activity></activity>
    <projects></projects>
  </div>
</template>

<script>
import Introduction from '@/components/Introduction.vue';
import Activity from '@/components/Activity.vue';
import Projects from '@/components/Projects.vue';

export default {
  name: 'app',
  components: {
    Introduction,
    Activity,
    Projects,
  },
};
</script>

<style lang="scss">
  @import './utils/_settings.scss';
  @import 'node_modules/bootstrap/scss/bootstrap';

  .section {
    display:block;
    margin:0;
    background: center center;
    background-size: cover;
    position: relative;
    clear:both;
    min-height: 90vh;

    .wrapper {
      padding-top:5vh;
      padding-bottom:1px;
    }

    strong {
      color:theme-color('dark');
    }

    &__panel {
      background:rgba(white, .15);
      position:relative;
      margin:40px auto;
      padding:30px;
      padding-top:60px;
      max-width: 800px;

      &:after {
        position: absolute;
        top:5px;
        bottom:5px;
        left:5px;
        right:5px;
        content:"";
        z-index:-1;
        background:white;
      }

      &:before {
        position: absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        content:"";
        z-index:-1;
        background:theme-color('dark');
      }

      @include media-breakpoint-down('sm') {
        margin:20px;
      }

      @include media-breakpoint-up('lg') {
        padding-left:170px;
        padding-right:100px;
        padding-top:200px;
      }

      &__lead {

        &:before {
          content:attr(aria-section);
          position:absolute;
          top:22px;
          left:30px;
          margin-left:40px;
          color:theme-color('dark');
          font-family:$font-family-serif;
          font-weight:bold;
          font-size:.9rem;
        }

        &:after {
          position:absolute;
          top:calc(20px + 0.6rem);
          left:30px;
          height:0px;
          border-top:1px solid theme-color('dark');
          width:30px;
          content:"";
        }

        @include media-breakpoint-up('lg') {
          &:before, &:after {
            left:170px;
          }
        }
      }
    }

    &__footer {
      display: block;
      min-height: 61px;
      margin:20px auto;
      max-width: 800px;
      background: theme-color('dark');
      color: theme-color('light');

      strong {
        color: theme-color('light');
      }

      @include media-breakpoint-down('sm') {
        margin:20px 20px 40px;
      }

      &__item {
        display: inline-block;
        width:100%/4%;
        margin:0;
        float:left;
        padding:10px 0;
        text-decoration: none;
        color: inherit;

        @include media-breakpoint-down('sm') {
          width:100%;
        }

        &__icon {
          float:left;
          margin:0 10px;
          margin-top:0.5em;
          font-size:1.5em;
        }
      }
    }
  }
</style>
