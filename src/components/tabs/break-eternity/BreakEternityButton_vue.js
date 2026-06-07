/* <script>
export default {
  name: "BreakEternityButton",
  data() {
    return {
      isBroken: false,
      isUnlocked: false,
      galacticStarReq: new Decimal(0)
      galacticStarReqIncrement: new Decimal(0)
    };
  },
  computed: {
    classObject() {
      return {
        "o-break-eternity-upgrade-btn": true,
        "o-break-eternity-upgrade-btn--color-2": true,
        "o-break-eternity-upgrade-btn--available": this.isUnlocked,
        "o-break-eternity-upgrade-btn--unavailable": !this.isUnlocked,
        "o-break-eternity-upgrade-btn--unclickable": this.isBroken,
      };
    },
    text() {
      return this.isBroken ? "ETERNITY IS FRACTURED" : "FRACTURE ETERNITY";
    }
  },
  methods: {
    update() {
      this.isBroken = player.break2;
      this.isUnlocked = PlayerProgress.absurdityUnlocked() && player.antimatter.gte(this.galacticStarReq) || this.isBroken;
      this.galacticStarReq = new Decimal("1");
      this.galacticStarReqIncrement = new Decimal("1e15");
    },
    clicked() {
      if (!this.isBroken && this.isUnlocked) Modal.breakEternity.show();
    }
  }
};
</script>

<template>
  <button
    :class="classObject"
    @click="clicked"
  >
    {{ text }}
  </button>
</template>

<style scoped>

</style> */
