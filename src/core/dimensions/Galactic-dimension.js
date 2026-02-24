import { GameCache } from "../cache";

import { DimensionState } from "./dimension";

export function GalacticDimensionCommonMultiplier() {
    let mult = DC.D1;
    return mult;
}
// getting a constant and saying that that constant is enabled here
export function toggleGalacticPower() {
    const isEnabled = Player.Absurdity.GalacticPowerMultiplier.isActive;
    Player.Absurdity.GalacticPowerMultiplier.isActive = !isEnabled
}

class GalacticDimensionState extends DimensionState {
    constructor(tier) {
        super(() => player.dimensions.Galactic, tier);
        const UNLOCK_REQUIREMENTS = [
            undefined,
            DC.D1,
            DC.E1,
            DC.E6,
            DC.E9,
            DC.E12,
            DC.E15,
            DC.E18,
            DC.E21
        ];
        this._unlockRequirement = UNLOCK_REQUIREMENTS[tier];
        const COST_MULTS = [null, 1e3, 1e4, 1e6, 1e9, 1e12, 1e15, 1e18, 1e21];
        this._costMultiplier = COST_MULTS[tier];
        const POWER_EXPONENTS = [null, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1];
        this._powerExponent = POWER_EXPONENTS[tier];
        const BASE_COSTS = [null, 1, 10, 1e6, 1e9, 1e12, 1e15, 1e18, 1e21]
        this._basecost = new Decimal(BASE_COSTS[tier]);
    }

    /** @returns {Decimal} */
    get cost() { return this.data.cost; }
    /** @param {Decimal} value */
    set cost(value) { this.data.cost = value; }

    get baseAmount() {
        return this.data.baseAmount;
    }

    set baseAmount(value) {
        this.data.baseAmount = value;
    }

    get isUnlocked() {
        return this.data.isUnlocked;
    }

    set isUnlocked(value) {
        this.data.isUnlocked = value;
    }

    get TetPRequirement() {
        return this._unlockRequirement;
    }

    get TetrationPointRequirementReached() {
        return player.Absurdity.TetrationPoints.gte(this.TetPRequirement);
    }

    get canUnlock() {
        return this.TetrationPointRequirementReached;
    }

    get isAvailableForPurchase() {
        return GalacticDimensionState.canbuy() && this.isUnlocked && this.isAffordable && !this.isCapped;
    }

    get isAffordable() {
        return Currency.TetrationPoints.gte(this.cost);
    }

    get rateofChange() {
        const tier = this.tier;
        if (tier ===8) {
            return DC.D0;
        }
        const toGain = GalacticDimension(tier + 1).productionPerSecond;
        const current = Decimal.max(this.amount, 1);
        return toGain.times(10).dividedBy(current);

    }

    get productionPerSecond() {
        let production = this.amount;
        return production.times(this.multiplier);
    }

    get multiplier() {
        const tier = this.tier;
        let mult = GameCache.GalacticDimensionCommonMultiplier.value;
        mult = mult.times(Decimal.pow(this.powerExponent, Math.floor(this.baseAmount)))
        return mult;
    }
    
    get isProducing() {
        const tier = this.tier;
        return this.amount.gt(0);
    }

    get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    const costMult = this._costMultiplier;
    return costMult;
  }

  get powerExponent() {
    return new Decimal(this._powerExponent)
  }

  get purchases() {
    return this.data.baseAmount;
  }

  get purchaseCap() {
    return DC.C2P1024;
  }

  get isCapped() {
    return this.cost.gte(this.purchaseCap);
  }

  get hardcapTetPAmount() {
    return this.purchaseCap;
  }

  resetAmount() {
    this.amount = new Decimal(this.baseAmount);
  }

  fullReset() {
    this.cost = new Decimal(this.baseCost);
    this.amount = DC.D0;
    this.bought = 0;
    this.baseAmount = 0;
    this.isUnlocked = false;
  }

  unlock() {
    if (this.isUnlocked) return true;
    if (!this.canUnlock) return false;
    this.isUnlocked = true;
    EventHub.dispatch(GAME_EVENT.GALACTIC_DIMENSION_UNLOCKED, this.tier);
    if (this.tier === 1) {
      Tab.dimensions.Galactic.show();
    }
    return true;
  }

  // Only ever called from manual actions
  buySingle() {
    if (!this.isUnlocked) return this.unlock();
    if (!this.isAvailableForPurchase) return false;

    Currency.TetrationPoints.purchase(this.cost);
    this.cost = Decimal.round(this.cost.times(this.costMultiplier));
    this.amount = this.amount.plus(1);
    this.baseAmount += 1;

    return true;
  }

  buyMax() {
    if (!this.isAvailableForPurchase) return false;

    let purchasesUntilHardcap = this.purchaseCap.toNumber() - this.purchases;
    
    const costScaling = new LinearCostScaling(
      Currency.TetrationPoints.value,
      this.cost,
      this.costMultiplier,
      purchasesUntilHardcap
    );

    if (costScaling.purchases <= 0) return false;

    Currency.TetrationPoints.purchase(costScaling.totalCost);
    this.cost = this.cost.times(costScaling.totalCostMultiplier);
    this.amount = this.amount.plus(costScaling.purchases);
    this.baseAmount += costScaling.purchases;

    return true;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {GalacticDimensionStateState}
 */
export const GalacticDimension = GalacticDimensionState.createAccessor();

export const GalacticDimensions = {
  /**
   * @type {GalacticDimensionStateState[]}
   */
  all: GalacticDimension.index.compact(),
  HARDCAP_PURCHASES: DC.C2P1024,

  unlockNext() {
    if (GalacticDimension(8).isUnlocked) return;
    this.next().unlock();
  },

  next() {
    if (GalacticDimension(8).isUnlocked)
      throw "All Galactic Dimensions are unlocked";
    return this.all.first(dim => !dim.isUnlocked);
  },

  resetAmount() {
    Currency.unnerfedGalacticPower.reset();
    Currency.GalacticPower.reset();
    for (const dimension of GalacticDimensions.all) {
      dimension.resetAmount();
    }
  },

  fullReset() {
    for (const dimension of GalacticDimensions.all) {
      dimension.fullReset();
    }
  },

  get totalDimCap() {
    return this.HARDCAP_PURCHASES;
  },

  canBuy() {
    return true;
  },

  canAutobuy() {
    return this.canBuy();
  },

  tick(realDiff) {
    for (let tier = 8; tier > 1; tier--) {
      GalacticDimension(tier).produceDimensions(GalacticDimension(tier - 1), realDiff / 10);
      GalacticDimension(1).produceCurrency(Currency.unnerfedGalacticPower, realDiff);
    }
  },

  // Called from "Max All" UI buttons and nowhere else
  buyMax() {
    // Try to unlock dimensions
    const unlockedDimensions = this.all.filter(dimension => dimension.unlock());

    // Try to buy single from the highest affordable new dimensions
    unlockedDimensions.slice().reverse().forEach(dimension => {
      if (dimension.purchases === 0) dimension.buySingle();
    });

    // Try to buy max from the lowest dimension (since lower dimensions have bigger multiplier per purchase)
    unlockedDimensions.forEach(dimension => dimension.buyMax(false));
  },

  //NEED TO CHANGE TO TETRATION LATER
  get conversionExponent() {
    let base = 2;
  }
    

}
