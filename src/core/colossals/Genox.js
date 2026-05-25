/* import { BitUpgradeState, RebuyableMechanicState } from "../game-mechanics";
import { GameDatabase } from "../secret-formula/game-database";

import { Col_quotes } from "./col_quotes";

class GenoxUpgradeState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }

  get name() {
      return this.config.name;
    }
  
    get shortDescription() {
      return this.config.shortDescription ? this.config.shortDescription() : "";
    }
  
    get requirement() {
      return typeof this.config.requirement === "function" ? this.config.requirement() : this.config.requirement;
    }
  };

*/