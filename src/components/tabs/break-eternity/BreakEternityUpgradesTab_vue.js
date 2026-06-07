/* <script>
import BreakEternityButton from "./BreakEternityButton";
import BreakEternityUpgradeButton from "./BreakEternityUpgradeButton";

export default {
  name: "BreakEternityTab",
  components: {
    BreakEternityButton,
    BreakEternityUpgradeButton
  },
  data() {
    return {
      isUnlocked: false,
      galacticStarReq: new Decimal(0)
    };
  },
  computed: {
    grid() {
      return [
        [
          BreakEternityUpgrade.galacticAcknowledgement,
          BreakEternityUpgrade.dementedDarkness,
          BreakEternityUpgrade.eternalAndInfinite,
          BreakEternityUpgrade.galacticInception,
          BreakEternityUpgrade.sacrificalSupplement,
        ],
        [
          BreakEternityUpgrade.realityParticles,
          BreakEternityUpgrade.purposeOfPerks,
          BreakEternityUpgrade.spacialEvolution,
          BreakEternityUpgrade.acclimatedAchievments,
          BreakEternityUpgrade.dilatedSpeed,
        ],
        [
          BreakEternityUpgrade.doubleIPUncap,
          BreakEternityUpgrade.tgThresholdUncap,
          BreakEternityUpgrade.tesseractMultiplier,
          BreakEternityUpgrade.glyphSacrificeUncap,
          BreakEternityUpgrade.glyphSlotImprovement
        ]
      ];
    }
  },
  methods: {
    update() {
      this.isUnlocked = PlayerProgress.absurdityUnlocked();
      this.galacticStarReq = new Decimal(1);
    },
    btnClassObject(column) {
      return {
        "l-break-eternity-upgrade-grid__cell": true,
        "o-break-eternity-upgrade-btn--multiplier": column === 1 || column === 2
      };
    },
    timeDisplayShort(time) {
      return timeDisplayShort(time);
    }
  }
};
</script>

<template>
  <div class="l-break-eternity-tab">
    <div v-if="!isUnlocked">
      Reach {{ format(galacticStarrReq, 2, 1) }} with at least one Absurdity to unlock Break Eternity
    </div>
    <BreakEternityButton class="l-break-eternity-tab__break-btn" />
    <div
      v-if="isUnlocked"
      class="l-break-eternity-upgrade-grid l-break-eternity-tab__grid"
    >
      <div
        v-for="(column, columnId) in grid"
        :key="columnId"
        class="l-break-eternity-upgrade-grid__row"
      >
        <BreakEternityUpgradeButton
          v-for="upgrade in column"
          :key="upgrade.id"
          :upgrade="upgrade"
          :class="btnClassObject(columnId)"
        />
      </div>
    </div>
    <div>
    </div>
  </div>
</template>

<style scoped>

</style> */
