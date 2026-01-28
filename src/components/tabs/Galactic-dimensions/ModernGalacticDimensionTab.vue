<script>
import GalacticDimensionRow from "./ModernGalacticDimensionRow";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ModernGalacticDimensionTab",
  components: {
    PrimaryButton,
    GalacticDimensionRow
  },
  data() {
    return {
      GalacticPower: new Decimal(0),
      unnerfedGalacticPower: new Decimal(0),
      dimMultiplier: new Decimal(0),
      PowerPerSecond: new Decimal(0),
      incomeType: "",
      conversionExponent: 0,
      nextDimCapIncrease: 0,
      totalDimCap: new Decimal(0),
      creditsClosed: false,
      showLockedDimCostNote: true,
      softcapPow: 0,
      softcap: new Decimal(0),
      unstable: false,
      isEffectActive: false,
    };
  },
  methods: {
    update() {
      this.showLockedDimCostNote = !GalacticDimension(8).isUnlocked;
      this.GalacticPower.copyFrom(Currency.GalacticPower);
      this.unnerfedGalacticPower.copyFrom(Currency.unnerfedGalacticPower);
      this.conversionExponent = GalacticDimensions.conversionExponent;
      this.dimMultiplier.copyFrom(this.GalacticPower.pow(this.conversionExponent).max(1));
      this.PowerPerSecond.copyFrom(GalacticDimension(1).productionPerSecond);
      this.incomeType = "Galactic Power";
      this.totalDimCap.copyFrom(GalacticDimensions.totalDimCap);
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.softcapPow = GalacticDimensions.softcapPow;
      this.softcap.copyFrom(GalacticDimensions.SOFTCAP);
      this.unstable = this.GalacticPower.gte(this.softcap);
      this.isEffectActive = player.absurdity.GalacticPowerMultiplier.isActive;
    },
    maxAll() {
      GalacticDimensions.buyMax();
    },
    toggleGalacticPowerMultiplier() {
      toggleGalacticPower();
    },
    instabilityClassObject() {
      return {
        "c-Galactic-dim-description__accent": !this.unstable,
        "c-Galactic-dim-description__accent-unstable": this.unstable,
      };
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
        <span :class="instabilityClassObject()">{{ format(GalacticPower, 2, 1) }}</span>
        <span v-if="unstable"> Unstable</span> Galactic Power,
        <br>
        <span>
          increased by
          <span :class="instabilityClassObject()">{{ formatPow(conversionExponent, 2, 3) }}</span>
        </span>
        to a
        <span :class="instabilityClassObject()">
          {{ formatX(dimMultiplier, 2, 1) }}<span v-if="!isEffectActive"> (Disabled)</span>
        </span>
        multiplier to
        <span>Game Speed.</span>
        <div v-if="unstable">
          You <i>would</i> have <span :class="instabilityClassObject()">{{ format(unnerfedGalacticPower, 2, 1) }}</span>
          Galactic Power, but you don't.
          <br>
          This is because at <span :class="instabilityClassObject()">{{ format(softcap, 2, 1) }}</span> Galactic Power, your
          Galactic Power was softcapped.
          <br>
          Currently, Galactic Power above this amount is being raised to the power of
          <span :class="instabilityClassObject()">{{ format(1 / softcapPow, 2, 3) }}</span>.
          <br>
          The softcap to Galactic Power is solely based on your Galactic Power Softcap Magnitude, which is currently
          <span :class="instabilityClassObject()">{{ format(softcapPow, 2, 3) }}</span>.
        </div>
      </p>
    </div>
    <div>
      All Galactic Dimensions can be purchased until {{ format(totalDimCap, 2, 2) }} Tetration Points.
    </div>
    <div>You are getting {{ format(PowerPerSecond, 2, 0) }} {{ incomeType }} per second.</div>
    <div class="l-dimensions-container">
      <GalacticDimensionRow
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
