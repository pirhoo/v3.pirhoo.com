<template>
  <section class="introduction section">
    <div class="wrapper">
      <div class="introduction__body section__panel">
        <gradient-on-scroll></gradient-on-scroll>
        <h2 aria-section="Introduction" class="section__panel__lead">
          Hi, I’m <strong>Pierre Romera</strong><br />
          developer &amp; datajournalist
        </h2>
        <p>
          I’m CTO at the <a href="http://icij.org">International Consortium
          of Investigative Journalists (ICIJ)</a> where I build
          interactive stories and tools.
        </p>
        <p>
          I used to be CTO at <a href="http://jplusplus.org">Journalism++</a>,
          an agency that I co-founded after having been lead developer
          at <a href="http://owni.fr">OWNI</a>.
        </p>
        <p>
          Between 2012 and 2019, I was an Associate Professor at Sciences Po,
          where I taught computer science and interactive storytelling. For years I did trainings
          in many journalism schools and for professional journalists as well,
          covering data-journalism, computer security and programming.
        </p>
      </div>
      <div class="introduction__social section__footer">
        <gradient-on-scroll></gradient-on-scroll>
        <div class="container-fluid">
          <div class="row">
            <a class="introduction__social__item section__footer__item col-sm-6 col-md"
              href="https://twitter.com/pirhoo" target="_blank">
              <fa :icon="['fab', 'twitter']"
                class="introduction__social__item__icon section__footer__item__icon" />
              @pirhoo<br class="d-none d-md-inline" />
              on Twitter
            </a>
            <a class="introduction__social__item section__footer__item col-sm-6 col-md"
              href="https://wire.com" target="_blank">
              <fa :icon="['fa', 'unlock-alt']"
                class="introduction__social__item__icon section__footer__item__icon" />
              @pirhoo<br class="d-none d-md-inline" />
              on Wire
            </a>
            <a class="introduction__social__item section__footer__item col-sm-6 col-md"
              href="https://github.com/pirhoo" target="_blank">
              <fa :icon="['fab', 'github']"
                class="introduction__social__item__icon section__footer__item__icon" />
              @pirhoo<br class="d-none d-md-inline" />
              on Github
            </a>
            <a class="introduction__social__item section__footer__item col-sm-6 col-md"
              href="https://keybase.io/pirhoo" target="_blank">
              <fa icon="key"
                class="introduction__social__item__icon section__footer__item__icon" />
              @pirhoo<br class="d-none d-md-inline" />
              on Keybase
            </a>
            <a class="introduction__social__item section__footer__item col-sm-6 col-md"
              href="mailto:hello@pirhoo.com" target="_blank">
              <fa :icon="['far', 'envelope']"
                class="introduction__social__item__icon section__footer__item__icon" />
              Send me<br class="d-none d-md-inline" />
              an email
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import section from '@/mixins/section';
import GradientOnScroll from './GradientOnScroll.vue';

export default {
  name: 'Introduction',
  mixins: [section],
  components: {
    GradientOnScroll,
  },
};
</script>

<style lang="scss">
  @import '../utils/_settings';
</style>
