<script>
export default {
  name: "AbsurdityButton",
  data() {
    return {
      canAbsurdity: false,
      showSpecialEffect: false,
      hasAbsurdityStudy: false,
      starsGained: new Decimal(),
      projectedGS: new Decimal(),
      AbsurdityTime: 0,
      nextStarRM: 0,
      nextStariM: 0,
      };
  }, 
  computed: {
    formatStarsGained() {
      if (this.starsGained.gt(0)) return `Stars gained: ${format(this.starsGained, 2)}`;
      return "No Stars gained";
    },
      if (this.starsGained.gt(0) && this.starsGained.lt(100)) {
        return `(Next at ${format(this.nextMachineRM, 2)} RM)`;
      }
      if (this.starsGained.eq(0)) {
        return `(Projected: ${format(this.projectedGS, 2)} GS)`;
      }
      if (this.starsGained.lt(Number.MAX_VALUE)) {
        return `(${format(this.starsGained.divide(this.realityTime), 2, 2)} GS/min)`;
      }
      return "";   
      classObject() {
      return {
        "c-absurdity-button--unlocked": this.canAbsurdity,
        "c-absurdity-button--locked": !this.canAbsurdity,
        "c-absurdity-button--special": this.showSpecialEffect,
      };
    }
      function RMforGS(gs) {
        const adjusted = Decimal.divide(gs, StarHandler.galacticStarMultiplier);
        let result = Decimal.pow10(4000 * (adjusted.log10() / 3 + 1));
        }
        return result;
      }
        const multiplier = simulatedAbsurdityCount(false) + 1;
      this.projectedGS = StarHandler.gainedGalacticStars.times(multiplier)
      this.StarGained = this.projectedRM.clampMax(MachineHandler.distanceToRMCap);
      this.realityTime = Time.thisRealityRealTime.totalMinutes;
      this.glyphLevel = gainedGlyphLevel().actualLevel;
      this.nextStarRM = RMforGS(this.StarsGained.plus(1));
      this.nextStariM = iMforGS(this.StarsGained.plus(1));
      handleClick() {
      if (this.canAbsurdity) {
        requestManualAbsurdity();
      }
    },
   };
    </script>
    <template>
  <div class="l-absurdity-button">
    <button
      class="c-absurdity-button infotooltip"
      :class="classObject"
      @click="handleClick"
    >
      <div class="l-absurdity-button__contents">
        <template v-if="canAbsurdity">
          <div class="c-absurdity-button__header">
            Make a new Absurdity
          </div>
          <div>{{ formatStarsGained }} {{ formatStarStats }}</div>
        </template>
        <template v-else-if="hasAbsurdityStudy">
          <div>Get {{ format("1e1500") }} Reality Machines and {{ format("1e9") }} imaginary Machines to unlock a new Absurdity</div>
        </template>
        <template v-else>
          <div>Purchase the study in the Eternity tab to unlock a new Absurdity</div>
        </template>
        <div
          v-if="canAbsurdity"
          class="infotooltiptext"
        >
        </div>
        </div>
      </div>
    </button>
  </div>
</template>

<style scoped>

</style>                          
      