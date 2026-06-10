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
      GalacticEssence: new Decimal(0),
      unnerfedGalacticEssence: new Decimal(0),
      dimMultiplier: new Decimal(0),
      EssencePerSecond: new Decimal(0),
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
      this.GalacticEssence.copyFrom(Currency.GalacticEssence);
      this.unnerfedGalacticEssence.copyFrom(Currency.unnerfedGalacticEssence);
      this.conversionExponent = GalacticDimensions.conversionExponent;
      this.dimMultiplier.copyFrom(this.GalacticEssence.pow(this.conversionExponent).max(1));
      this.EssencePerSecond.copyFrom(GalacticDimension(1).productionPerSecond);
      this.incomeType = "Galactic Essence";
      this.totalDimCap.copyFrom(GalacticDimensions.totalDimCap);
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.softcapPow = GalacticDimensions.softcapPow;
      this.softcap.copyFrom(GalacticDimensions.SOFTCAP);
      this.unstable = this.GalacticEssence.gte(this.softcap);
      this.isEffectActive = player.absurdity.GalacticEssenceMultiplier.isActive;
    },
    maxAll() {
      GalacticDimensions.buyMax();
    },
    toggleGalacticEssenceMultiplier() {
      toggleGalacticEssence();
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
        @click="toggleGalacticEssenceMultiplier"
      >
        Toggle Galactic Essence
      </PrimaryButton>
    </div>
    <div>
      <p>
        You have
        <span :class="instabilityClassObject()">{{ format(GalacticEssence, 2, 1) }}</span>
        <span v-if="unstable"> Unstable</span> Galactic Essence,
        <br>
        <span>
          decreased by
          <span :class="instabilityClassObject()">{{ formatPow(conversionExponent, 2, 3) }}</span>
        </span>
        to a
        <span :class="instabilityClassObject()">
          {{ formatX(dimMultiplier, 2, 1) }}<span v-if="!isEffectActive"> (Disabled)</span>
        </span>
        multiplier to
        <span>Galaxy Strength.</span>
        <div v-if="unstable">
          You <i>would</i> have <span :class="instabilityClassObject()">{{ format(unnerfedGalacticEssence, 2, 1) }}</span>
          Galactic Essence, but you don't.
          <br>
          This is because at <span :class="instabilityClassObject()">{{ format(softcap, 2, 1) }}</span> Galactic Essence, your
          Galactic Essence was softcapped.
          <br>
          Currently, Galactic Essence above this amount is being raised to the Power of
          <span :class="instabilityClassObject()">{{ format(1 / softcapPow, 2, 3) }}</span>.
          <br>
          The softcap to Galactic Essence is solely based on your Galactic Essence Softcap Magnitude, which is currently
          <span :class="instabilityClassObject()">{{ format(softcapPow, 2, 3) }}</span>.
        </div>
      </p>
    </div>
    <div>
      All Galactic Dimensions can be purchased until {{ format(totalDimCap, 2, 2) }} Galactic Stars.
    </div>
    <div>You are getting {{ format(EssencePerSecond, 2, 0) }} {{ incomeType }} per second.</div>
    <div class="l-dimensions-container">
      <GalacticDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </div>
    <div v-if="showLockedDimCostNote">
      Hold shift to see the Galactic Star cost for locked Galactic Dimensions.
    </div>
  </div>
</template>
