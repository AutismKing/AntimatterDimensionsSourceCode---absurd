<script>
import AbsurdityMilestoneButton from "./AbsurdityMilestoneButton";

export default {
  name: "AbsurdityMilestonesTab",
  components: {
    AbsurdityMilestoneButton
  },
  data() {
    return {
      absurdityCount: new Decimal(),
    };
  },
  computed: {
    milestones() {
      return Object.values(GameDatabase.absurdity.milestones)
        .sort((a, b) => a.absurdities - b.absurdities)
        .map(config => new AbsurdityMilestoneState(config));
    },
    rows() {
      return Math.ceil(this.milestones.length / 3);
    }
  },
  methods: {
    update() {
      this.absurdityCount.copyFrom(Currency.absurdities.value.floor());
    },
    getMilestone(row, column) {
      return () => this.milestones[(row - 1) * 3 + column - 1];
    }
  }
};
</script>

<template>
  <div class="l-absurdity-milestone-grid">
    <div>You have {{ quantify("Absurdity", absurdityCount, 3) }}.</div>
    <div>
    </div>
    <div
      v-for="row in rows"
      :key="row"
      class="l-absurdity-milestone-grid__row"
    >
      <AbsurdityMilestoneButton
        v-for="column in 3"
        :key="row * 3 + column"
        :get-milestone="getMilestone(row, column)"
        class="l-absurdity-milestone-grid__cell"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
