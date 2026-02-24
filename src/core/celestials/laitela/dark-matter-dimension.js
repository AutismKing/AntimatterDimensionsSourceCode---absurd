import { DimensionState } from "../../dimensions/dimension";

/**
 * Constants for easily adjusting values
 */

const INTERVAL_COST_MULT = DC.D5;
const POWER_DM_COST_MULT = DC.E1;
const POWER_DE_COST_MULTS = [1.65, 1.6, 1.55, 1.5];

const INTERVAL_START_COST = DC.E1;
const POWER_DM_START_COST = DC.E1;
const POWER_DE_START_COST = DC.E1;

const INTERVAL_PER_UPGRADE = 0.92;

// No constant for interval since it's tied to a milestone
export const POWER_DM_PER_ASCENSION = new Decimal(500);
export const POWER_DE_PER_ASCENSION = new Decimal(500);

const COST_MULT_PER_TIER = 1200;

export class DarkMatterDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.celestials.laitela.dimensions, tier);
  }

  // Does not include DM, only DE per second
  get productionPerSecond() { return this.powerDE.mul(DC.E3.div(this.interval)); }

  get unlockUpgrade() {
    // The 15th Imaginary Upgrade unlocked Laitela and the 1st DMD
    return ImaginaryUpgrade(this.tier + 14);
  }

  get isUnlocked() {
    if (this.tier === 1) return true;
    return this.unlockUpgrade.isBought;
  }

  get ascensions() {
    return this.data.ascensionCount;
  }

  get intervalPurchaseCap() {
    return DC.E1;
  }

  get rawInterval() {
    const perUpgrade = INTERVAL_PER_UPGRADE;
    const tierFactor = Decimal.pow(4, this.tier - 1);
    return DC.E3.mul(tierFactor).mul(Decimal.pow(perUpgrade, this.data.intervalUpgrades)).mul(
      Decimal.pow(SingularityMilestone.ascensionIntervalScaling.effectOrDefault(new Decimal(1200))).mul(
      SingularityMilestone.darkDimensionIntervalReduction.effectOrDefault(1)));
  }

  get interval() {
    return Decimal.clampMin(this.intervalPurchaseCap, this.rawInterval);
  }

  get commonDarkMult() {
    return DC.D1.timesEffectsOf(
      SingularityMilestone.darkFromTesseracts,
      SingularityMilestone.darkFromGlyphLevel,
      SingularityMilestone.darkFromTheorems,
      SingularityMilestone.darkFromDM4,
      SingularityMilestone.darkFromGamespeed,
      SingularityMilestone.darkFromDilatedTime,
    );
  }

  get powerDMPerAscension() {
    return SingularityMilestone.improvedAscensionDM.effectOrDefault(DC.D0).add(POWER_DM_PER_ASCENSION);
  }

  get powerDM() {
    if (!this.isUnlocked) return DC.D0;
    return Decimal.pow(1.15, this.data.powerDMUpgrades).mul(2).add(1)
      .times(Laitela.realityReward)
      .times(Laitela.darkMatterMult)
      .times(this.commonDarkMult)
      .times(Decimal.pow(this.powerDMPerAscension, this.ascensions))
      .timesEffectsOf(SingularityMilestone.darkMatterMult, SingularityMilestone.multFromInfinitied)
      .times(ExpansionPack.laitelaPack.isBought ? Decimal.max(Decimal.log10(Decimal.log10(player.antimatter.add(1)).add(1)), Decimal.log10(
        player.reality.imaginaryMachines.add(1))) : 1)
      .dividedBy(Decimal.pow(1e4, Decimal.pow(this.tier - 1, 0.5)));
  }

  get powerDE() {
    if (!this.isUnlocked || (Pelle.isDoomed && !PelleDestructionUpgrade.singularityMilestones.isBought)) return DC.D0;
    const tierFactor = Decimal.pow(15, (this.tier - 1) * supertier[this.tier]);
    const destabilizeBoost = Laitela.realityRewardDE;
    return this.data.powerDEUpgrades.add(1).mult(0.1)
      .mul(Decimal.pow(1.005, this.data.powerDEUpgrades)).mul(tierFactor).div(1000)
      .times(this.commonDarkMult)
      .times(Decimal.pow(POWER_DE_PER_ASCENSION, this.ascensions))
      .timesEffectsOf(
        SingularityMilestone.darkEnergyMult,
        SingularityMilestone.realityDEMultiplier,
        SingularityMilestone.multFromInfinitied,
      ).mul(destabilizeBoost);
  }

  get intervalAfterAscension() {
    const purchases = Decimal.affordGeometricSeries(Currency.darkMatter.value, this.rawIntervalCost,
      this.intervalCostIncrease, 0);
    return Decimal.max(SingularityMilestone.ascensionIntervalScaling.effectOrDefault(new Decimal(1200).sub(intervalReduction))
      .times(this.rawInterval.times(Decimal.pow(INTERVAL_PER_UPGRADE, purchases))), this.intervalPurchaseCap);
  }

  get adjustedStartingCost() {
    const tiers = [null, 0, 2, 5, 13];
    return Decimal.pow(COST_MULT_PER_TIER, tiers[this.tier]).times(10).times(
      SingularityMilestone.darkDimensionCostReduction.effectOrDefault(1));
  }

  get rawIntervalCost() {
    return Decimal.pow(this.intervalCostIncrease, this.data.intervalUpgrades)
      .times(this.adjustedStartingCost).times(INTERVAL_START_COST);
  }

  get intervalCost() {
    return this.rawIntervalCost.floor();
  }

  get intervalCostIncrease() {
    return Decimal.pow(INTERVAL_COST_MULT, SingularityMilestone.intervalCostScalingReduction.effectOrDefault(1));
  }

  get rawPowerDMCost() {
    return Decimal.pow(this.powerDMCostIncrease, this.data.powerDMUpgrades)
      .times(this.adjustedStartingCost).times(POWER_DM_START_COST);
  }

  get powerDMCost() {
    return this.rawPowerDMCost.floor();
  }

  get powerDMCostIncrease() {
    return POWER_DM_COST_MULT;
  }

  get rawPowerDECost() {
    return Decimal.pow(this.powerDECostIncrease, this.data.powerDEUpgrades)
      .times(this.adjustedStartingCost).times(POWER_DE_START_COST);
  }

  get powerDECost() {
    return this.rawPowerDECost.floor();
  }

  get powerDECostIncrease() {
    return new Decimal(POWER_DE_COST_MULTS[this.tier - 1]);
  }

  get timeSinceLastUpdate() {
    return this.data.timeSinceLastUpdate;
  }

  set timeSinceLastUpdate(ms) {
    this.data.timeSinceLastUpdate = ms;
  }

  get canBuyInterval() {
    return Currency.darkMatter.gte(this.intervalCost);
  }

  get canBuyPowerDM() {
    return Currency.darkMatter.gte(this.powerDMCost);
  }

  get canBuyPowerDE() {
    return Currency.darkMatter.gte(this.powerDECost);
  }

  get maxIntervalPurchases() {
    return Decimal.ceil(new Decimal(Decimal.log10(this.intervalPurchaseCap.div(this.interval))).div(new Decimal(Decimal.log10(INTERVAL_PER_UPGRADE))));
    return DC.NUMMAX;
  }

  buyManyInterval(x) {
    const cost = this.rawIntervalCost.times(
      Decimal.pow(this.intervalCostIncrease, x).minus(1)).div(this.intervalCostIncrease.sub(1)).floor();
    if (!Currency.darkMatter.purchase(cost)) return false;
    else {
      this.data.intervalUpgrades = this.data.intervalUpgrades.add(x);
      return true;
    }
  }

  buyManyPowerDM(x) {
    const cost = this.rawPowerDMCost.times(
      Decimal.pow(this.powerDMCostIncrease, x).minus(1)).div(this.powerDMCostIncrease.sub(1)).floor();
    if (!Currency.darkMatter.purchase(cost)) return false;
    else {
      this.data.powerDMUpgrades = this.data.powerDMUpgrades.add(x);
      return true;
    }
  }

  buyManyPowerDE(x) {
    const cost = this.rawPowerDECost.times(
      Decimal.pow(this.powerDECostIncrease, x).minus(1)).div(this.powerDECostIncrease.sub(1)).floor();
    if (!Currency.darkMatter.purchase(cost)) return false;
    else {
      this.data.powerDEUpgrades = this.data.powerDEUpgrades.add(x);
      return true;
    }
  }

  buyInterval() {
    return this.buyManyInterval(1);
  }

  buyPowerDM() {
    return this.buyManyPowerDM(1);
  }

  buyPowerDE() {
    return this.buyManyPowerDE(1);
  }

  ascend() {
    if (this.interval.gt(this.intervalPurchaseCap)) return;
    this.data.ascensionCount = this.data.ascensionCount.add(this.affordableAscensions);
  }

  static get dimensionCount() { return 4; }

  reset() {
    this.data.amount = DC.D1;
    this.data.intervalUpgrades = DC.D0;
    this.data.powerDMUpgrades = DC.D0;
    this.data.powerDEUpgrades = DC.D0;
    this.data.timeSinceLastUpdate = 0;
    this.data.ascensionCount = DC.D0;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {DarkMatterDimensionState}
 */
export const DarkMatterDimension = DarkMatterDimensionState.createAccessor();

export const DarkMatterDimensions = {
  /**
   * @type {DarkMatterDimension[]}
   */
  all: DarkMatterDimension.index.compact(),

  tick(realDiff) {
    if (!Laitela.isUnlocked) return;
    for (let tier = 8; tier >= 1; tier--) {
      const dim = DarkMatterDimension(tier);
      if (!dim.isUnlocked) continue;
      dim.timeSinceLastUpdate += realDiff;
      if (dim.interval.lt(dim.timeSinceLastUpdate)) {
        const ticks = Decimal.floor(new Decimal(dim.timeSinceLastUpdate).div(dim.interval));
        const productionDM = dim.amount.times(ticks).times(dim.powerDM);
        if (tier === 1) {
          Currency.unnerfedDarkMatter.add(productionDM);
        } else {
          DarkMatterDimension(tier - 1).amount = DarkMatterDimension(tier - 1).amount.plus(productionDM);
        }
        Currency.darkEnergy.add(ticks.mul(dim.powerDE));
        dim.timeSinceLastUpdate -= dim.interval.times(ticks).toNumber();
      }
    }
    if (SingularityMilestone.dim4Generation.canBeApplied && Laitela.annihilationUnlocked) {
      DarkMatterDimension(4).amount = DarkMatterDimension(4).amount
        .plus(SingularityMilestone.dim4Generation.effectValue.times(realDiff / 1000));
    }
  },

  reset() {
    for (const dimension of DarkMatterDimensions.all) {
      dimension.reset();
    }
    Currency.darkMatter.reset();
  },
};
