<template>
  <section class="introduction section">
    <div class="wrapper">
      <div class="introduction__body section__panel">
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
          I’m also a Associate Professor at Sciences Po, where I teach computer
          science to journalists. I otherwise do many trainings for professional
          journalists, covering data-journalism, computer security and programming.
        </p>
      </div>
      <div class="introduction__social section__footer">
        <div class="container-fluid">
          <div class="row">
            <a class="introduction__social__item section__footer__item col"
              href="https://twitter.com/pirhoo" target="_blank">
              <fa :icon="['fab', 'twitter']"
                class="introduction__social__item__icon section__footer__item__icon" />
              Find me<br />
              on Twitter
            </a>
            <a class="introduction__social__item section__footer__item col"
              href="https://github.com/pirhoo" target="_blank">
              <fa :icon="['fab', 'github']"
                class="introduction__social__item__icon section__footer__item__icon" />
              Find me<br />
              on Github
            </a>
            <a class="introduction__social__item section__footer__item col"
              href="https://keybase.io/pirhoo" target="_blank">
              <fa icon="key"
                class="introduction__social__item__icon section__footer__item__icon" />
              Find me<br />
              on Keybase
            </a>
            <a class="introduction__social__item section__footer__item col"
              href="mailto:hello@pirhoo.com" target="_blank">
              <fa :icon="['far', 'envelope']"
                class="introduction__social__item__icon section__footer__item__icon" />
              Send me<br />
              an email
            </a>
          </div>
        </div>
      </div>
      <a class="introduction__discover" title="Discover more" href="#activity">
        <span class="sr-only">
          Discover more
        </span>
        <i class="fa fa-4x fa-angle-down"></i>
      </a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Introduction',
};
</script>

<style lang="scss">
  @import '../utils/_settings';

  .introduction {
    @include sectionize($introduction-bg, $introduction-color, $introduction-emphasize);
  }
</style>
