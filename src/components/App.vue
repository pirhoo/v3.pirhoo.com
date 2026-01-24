<template>
  <div class="app">
    <introduction />
    <investigations />
    <activity />
    <projects />
  </div>
</template>

<script setup>
import Introduction from './Introduction.vue'
import Activity from './Activity.vue'
import Investigations from './Investigations.vue'
import Projects from './Projects.vue'
</script>

<style lang="scss">
  @import '@/utils/_settings.scss';
  @import 'bootstrap/scss/bootstrap';

  .section {
    display:block;
    margin:0;
    position: relative;
    clear:both;
    min-height: 85vh;

    --section-primary: black;
    --section-primary-contrast: white;
    --section-secondary:  black;
    --section-text:  $body-color;

    .btn-outline-section {
      color: var(--section-primary);
      border-color: var(--section-primary);
      background: transparent;
    }

    .btn-link-section {
      color: var(--section-primary);
      background: transparent;
    }

    .wrapper {
      padding-top:5vh;
      padding-bottom:1px;
    }

    &__panel {
      position:relative;
      margin:40px auto;
      padding:30px;
      padding-top:60px;
      max-width: 800px;
      color: var(--section-text);
      transition: color $color-transition-duration;

      @media (max-width: 800px) {
        margin:40px 20px;
      }

      &:after {
        position: absolute;
        top:.3rem;
        bottom:.3rem;
        left:.3rem;
        right:.3rem;
        content:"";
        z-index:-1;
        background:white;
        border-radius: $border-radius-sm;
      }

      html body & strong {
        color: var(--section-secondary);
        transition: color $color-transition-duration;
      }

      html body & a {
        color: var(--section-primary);
        transition: color $color-transition-duration;
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
          color: var(--bs-dark);
          font-family:$font-family-serif;
          font-weight:bold;
          font-size:.9rem;
        }

        &:after {
          position:absolute;
          top:calc(20px + 0.6rem);
          left:30px;
          height:0;
          border-top:1px solid  var(--bs-dark);
          width:30px;
          content:"";
        }

        &:before, &:after {
          color: var(--section-secondary);
          border-color: var(--section-secondary);
          transition:$color-transition-duration;
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
      position: relative;
      color: var(--section-primary-contrast);
      transition: color $color-transition-duration;
      border-radius: $border-radius-lg;
      overflow: hidden;

      strong {
        color: inherit;
      }

      @include media-breakpoint-down('sm') {
        margin:20px 20px 40px;
      }

      &__item {
        display: inline-block;
        width:100%/4%;
        margin:0;
        padding-top:10px;
        padding-bottom:10px;
        text-decoration: none;
        color: inherit;

        &:hover, &:focus {
          color: inherit;
        }

        &__icon {
          float:left;
          margin-right: 0.5em;
          margin-top: 0.5em;
          font-size: 1.5em;

          @include media-breakpoint-down('sm') {
            margin-top: 0.25em;
            font-size: 1em;
          }

        }
      }
    }
  }
</style>
