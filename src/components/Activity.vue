<template>
  <section class="activity section">
    <div class="wrapper">
      <div class="activity__body section__panel">
        <h2 aria-section="Activity" class="section__panel__lead">
          I’ve been busy,<br>
          <strong>let the data talk</strong>
        </h2>
        <p>
          My time is split between coding, investigating and teaching.
          I’m better with numbers so let the figures below speak for themselves.
        </p>
      </div>
      <div class="activity__figures section__footer">
        <div class="container-fluid">
          <div class="row">
            <div class="activity__figures__item section__footer__item col">
              <fa icon="code"
                class="activity__figures__item__icon section__footer__item__icon" />
              I authored
              <strong>
                {{ commits }}
              </strong>&nbsp;
              <abbr title="A submission of my latest changes of a source code">
                commits
              </abbr>
              <br />
              over
              <strong>
                {{ repositories }}
              </strong>&nbsp;projects
            </div>
            <div class="activity__figures__item section__footer__item col">
              <fa icon="graduation-cap"
                class=" activity__figures__item__icon section__footer__item__icon" />
              I gave ±
              <strong>
                {{ hours }}
              </strong>&nbsp;hours<br />of training in
              <strong>
                {{ countries }}
              </strong>&nbsp;countries
            </div>
            <div class="activity__figures__item section__footer__item col">
              <fa icon="trophy"
                class="activity__figures__item__icon section__footer__item__icon" />
              <strong>
                {{ awards }}
              </strong>&nbsp;prizes awarded<br />for
              <strong>
                {{ projects }}
              </strong>&nbsp;projects I worked on
            </div>
          </div>
        </div>
      </div>
      <div class="activity__chart-wrapper">
        <!--activity commits="commits" ng-if="commits &amp;&amp; projectsInView"></activity-->
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Activity',
  data() {
    return {
      commits: 0,
      repositories: 0,
      awards: 0,
      projects: 0,
      hours: 0,
      countries: 0,
    };
  },
};
</script>

<style lang="scss">
  @import '../utils/_settings';

  .activity {
    @include sectionize($activity-bg, $activity-color, $activity-emphasize);
  }
</style>
