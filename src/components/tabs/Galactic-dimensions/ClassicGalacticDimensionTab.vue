<script>
import GalacticDimensionRow from "./ClassicGalacticDimensionRow";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ClassicGalacticDimensionTab",
  components: {
    PrimaryButton,
    GalacticDimensionRow
  },
  data() {
    return {
      GalacticPower: new Decimal(0),
      dimMultiplier: new Decimal(0),
      PowerPerSecond: new Decimal(0),
      incomeType: "",
      conversionExponent: 0,
      nextDimCapIncrease: 0,
      totalDimCap: new Decimal(0),
      creditsClosed: false,
      showLockedDimCostNote: true,
      isEffectActive: false,
    };
  },
  methods: {
    update() {
      this.showLockedDimCostNote = !GalacticDimension(8).isUnlocked;
      this.GalacticPower.copyFrom(Currency.GalacticPower);
      this.conversionExponent = GalacticDimensions.conversionExponent; 
      this.dimMultiplier.copyFrom(this.GalacticPower.pow(this.conversionExponent).max(1));
      this.matterPerSecond.copyFrom(GalacticDimension(1).productionPerRealSecond);
      this.incomeType = "Galactic Power";
      this.totalDimCap.copyFrom(GalacticDimensions.totalDimCap);
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.isEffectActive = player.endgame.GalacticPowerMultiplier.isActive;
    },
    maxAll() {
      GalacticDimensions.buyMax();
    },
    toggleGalacticPowerMultiplier() {
      toggleGalacticPower();
    }
  }
};
</script>

<template>
  <div class="l-Galactic-dim-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Max all
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="toggleGalacticPowerMultiplier"
      >
        Toggle Galactic Power
      </PrimaryButton>
    </div>  
    <div>
      <p>
        You have
        <span class="c-Galactic-dim-description__accent">{{ format(GalacticPower, 2, 1) }}</span>
        Galactic Power <span v-if="!isEffectActive">(Disabled)</span>,
        <br>
        <span>
          increased by
          <span class="c-Galactic-dim-description__accent">{{ formatPow(conversionExponent, 2, 3) }}</span>
        </span>
        to a
        <span class="c-Galactic-dim-description__accent">{{ formatX(dimMultiplier, 2, 1) }}</span>
        multiplier to
        <span>Game Speed.</span>
      </p>
    </div>
    <div>
      All Galactic Dimensions can be purchased until {{ format(totalDimCap, 2, 2) }} Tetration Points.
    </div>
    <div>You are getting {{ format(PowerPerSecond, 2, 0) }} {{ incomeType }} per second.</div>
    <div class="l-dimensions-container">
      <CelestialDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </div>
    <div v-if="showLockedDimCostNote">
      Hold shift to see the Tetration Point cost for locked Galactic Dimensions.
    </div>
  </div>
</template>
