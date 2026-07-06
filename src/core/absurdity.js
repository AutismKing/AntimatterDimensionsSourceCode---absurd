import * as ADNotations from "adnot-beport-small";

import { AutomatorPanels } from "@/components/tabs/automator/AutomatorDocs";
import { GlyphInfo } from "@/components/modals/options/SelectGlyphInfoDropdown";

import { AUTOMATOR_MODE, AUTOMATOR_TYPE } from "./automator/automator-backend";
import { deepmergeAll } from "@/utility/deepmerge";
import { GlyphTypes } from "./glyph-effects";

export function isAbsurdityAvailable() {
  return player.records.thisAbsurdity.maxRM.exponent >= 1500 && TimeStudy.absurdity.isBought;
  return player.records.thisAbsurdity.maxiM.exponent >= 9 && TimeStudy.absurdity.isBought;
}

function updateAbsurdityRecords() {
  player.records.bestAbsurdity.bestGSmin =
    player.records.bestAbsurdity.bestGSmin.max(player.records.thisAbsurdity.bestGSmin);
  player.records.bestAbsurdity.time = Decimal.min(player.records.thisAbsurdity.time, player.records.bestAbsurdity.time);
  if (player.records.thisAbsurdity.realTime < player.records.bestAbsurdity.realTime) {
    player.records.bestAbsurdity.realTime = player.records.thisAbsurdity.realTime;
  }
  if (gainedGalacticStars().gt(player.records.permanent.maxGS)) player.records.permanent.maxGS = gainedGalacticStars();
}

function giveAbsurdityRewards() {
  Currency.galacticStars.add(gainedGalacticStars());
  updateAbsurdityRecords();
  player.absurdities += absurdityMultiplier;
  addAbsurdityTime(
    player.records.thisAbsurdity.time,
    player.records.thisAbsurdity.realTime,
    gainedGalacticStars(),
    absurdityMultiplier
  );
}

export const Absurdity = {
  hotkeyReset() {
    if (!TimeStudy.absurdity.isBought || player.antimatter.lt(DC.E9E15)) return false;
    this.newAbsurdity();
    return true;
  },
  resetNoReward() {
    GameEnd.creditsClosed = false;
    GameEnd.creditsEverClosed = false;
    player.isGameEnd = false;
    // We set this ASAP so that the AD tab is immediately recreated without END formatting, and any lag which could
    // happen is instead hidden by the overlay from the credits rollback
    player.celestials.pelle.doomed = false;

    // This is where we "confirm" a speedrun as completed and store all its information into the previous run prop
    // before resetting everything.
    const speedrun = player.speedrun;
    if (speedrun.isActive) {
      player.speedrun.previousRuns[player.records.fullGameCompletions + 1] = {
        isSegmented: speedrun.isSegmented,
        usedSTD: speedrun.usedSTD,
        startDate: speedrun.startDate,
        name: speedrun.name,
        offlineTimeUsed: speedrun.offlineTimeUsed,
        records: [...speedrun.records],
        achievementTimes: JSON.parse(JSON.stringify(speedrun.achievementTimes)),
        seedSelection: speedrun.seedSelection,
        initialSeed: speedrun.initialSeed,
      };

      // For the sake of keeping a bounded savefile size, we only keep a queue of the last 100 full runs. The earliest
      // this will feasibly become an issue from nonstop speedruns is around 2030; I guess we can revisit it at that
      // point if we really need to, but I suspect this limit should be high enough
      const prevRunIndices = Object.keys(speedrun.previousRuns).map(k => Number(k));
      if (prevRunIndices.length > 100) player.speedrun.previousRuns[prevRunIndices.min()] = undefined;
    }
    EventHub.dispatch(GAME_EVENT.ENDGAME_RESET_BEFORE);

    // Modify beaten-game quantities before doing a carryover reset
    if (player.endgame.respec) {
      respecEndgameMasteries();
      player.endgame.respec = false;
    }
    if (player.celestials.teresa.disCharge) {
      disChargeAllPerkUpgrades();
      player.celestials.teresa.disCharge = false;
    }
    this.resetStuff();
    EventHub.dispatch(GAME_EVENT.ABSURDITY_RESET_AFTER);

    // The ending animation ends at 12.5, although the value continues to increase after that. We set it to a bit above
    // 12.5 when we start the rollback animation to hide some of the unavoidable lag from all the reset functions
    GameEnd.removeAdditionalEnd = true;
    GameEnd.additionalEnd = 15;
    // Without the delay, this causes the saving (and its notification) to occur during the credits rollback
    setTimeout(() => GameStorage.save(), 10000);
  },
  newEndgame() {
    GameEnd.creditsClosed = false;
    GameEnd.creditsEverClosed = false;
    player.isGameEnd = false;
    // We set this ASAP so that the AD tab is immediately recreated without END formatting, and any lag which could
    // happen is instead hidden by the overlay from the credits rollback
    player.celestials.pelle.doomed = false;

    // This is where we "confirm" a speedrun as completed and store all its information into the previous run prop
    // before resetting everything.
    const speedrun = player.speedrun;
    if (speedrun.isActive) {
      player.speedrun.previousRuns[player.records.fullGameCompletions + 1] = {
        isSegmented: speedrun.isSegmented,
        usedSTD: speedrun.usedSTD,
        startDate: speedrun.startDate,
        name: speedrun.name,
        offlineTimeUsed: speedrun.offlineTimeUsed,
        records: [...speedrun.records],
        achievementTimes: JSON.parse(JSON.stringify(speedrun.achievementTimes)),
        seedSelection: speedrun.seedSelection,
        initialSeed: speedrun.initialSeed,
      };

      // For the sake of keeping a bounded savefile size, we only keep a queue of the last 100 full runs. The earliest
      // this will feasibly become an issue from nonstop speedruns is around 2030; I guess we can revisit it at that
      // point if we really need to, but I suspect this limit should be high enough
      const prevRunIndices = Object.keys(speedrun.previousRuns).map(k => Number(k));
      if (prevRunIndices.length > 100) player.speedrun.previousRuns[prevRunIndices.min()] = undefined;
    }
    EventHub.dispatch(GAME_EVENT.ENDGAME_RESET_BEFORE);

    // Modify beaten-game quantities before doing a carryover reset
    if (player.RM.gte(DC.E9E15)) && (player.iM.gte(DC.E15)); {
      giveEndgameRewards();
      updateEndgameRecords();
      GlyphAppearanceHandler.unlockSet();
    }
    this.resetStuff();
    EventHub.dispatch(GAME_EVENT.ENDGAME_RESET_AFTER);

    // The ending animation ends at 12.5, although the value continues to increase after that. We set it to a bit above
    // 12.5 when we start the rollback animation to hide some of the unavoidable lag from all the reset functions
    GameEnd.removeAdditionalEnd = true;
    GameEnd.additionalEnd = 15;
    // Without the delay, this causes the saving (and its notification) to occur during the credits rollback
    setTimeout(() => GameStorage.save(), 10000);
  },
  // Reset the game, but carry over some post-completion stats. We also call this when starting a speedrun, so make sure
  // any stats which are updated due to completion happen in startNewGame() instead of in here
  resetStuff() {
    let remains = 0;
    if (ImaginaryUpgrade(26).isAvailableForPurchase) remains += 67108864;
    if (ImaginaryUpgrade(27).isAvailableForPurchase) remains += 134217728;
    if (ImaginaryUpgrade(28).isAvailableForPurchase) remains += 268435456;
    if (ImaginaryUpgrade(29).isAvailableForPurchase) remains += 536870912;
    if (ImaginaryUpgrade(30).isAvailableForPurchase) remains += 1073741824;
    let darkremains = 0;
    if (ImaginaryUpgrade(26).isBought) darkremains += 67108864;
    if (ImaginaryUpgrade(27).isBought) darkremains += 134217728;
    if (ImaginaryUpgrade(28).isBought) darkremains += 268435456;
    if (ImaginaryUpgrade(29).isBought) darkremains += 536870912;
    if (ImaginaryUpgrade(30).isBought) darkremains += 1073741824;
    let maxPerkCharges = 0;
    maxPerkCharges = player.celestials.teresa.perkShop[6];
    let charge1 = 0;
    charge1 = player.celestials.teresa.perkShop[0];
    let charge2 = 0;
    charge2 = player.celestials.teresa.perkShop[1];
    let charge3 = 0;
    charge3 = player.celestials.teresa.perkShop[2];
    let charge4 = 0;
    charge4 = player.celestials.teresa.perkShop[3];
    let rowProtect = 0;
    rowProtect = player.reality.glyphs.protectedRows;
    player.isGameEnd = false;
    Tab.dimensions.antimatter.show();
    AchievementTimers.marathon2.reset();
    lockAchievementsOnAbsurdity();
    player.tutorialState = 0;
    player.tutorialActive = true;
    player.options.confirmations.glyphSelection = true;
    ui.view.newUI = player.options.newUI;
    ui.view.news = player.options.news.enabled;
    Themes.find(Theme.currentName()).set();
    Notations.all.find(n => n.name === player.options.notation).setAsCurrent();
    LNotations.find(player.options.lnotation).setAsCurrent(true);
    ADNotations.Settings.exponentCommas.min = 10 ** player.options.notationDigits.comma;
    ADNotations.Settings.exponentCommas.max = 10 ** player.options.notationDigits.notation;
    Currency.realities.reset();
    player.partSimulatedReality = 0;
    Currency.realityMachines.reset();
    player.reality.maxRM = DC.D0;
    player.reality.imaginaryMachines = DC.D0;
    player.reality.iMCap = DC.D0;
    player.reality.glyphs.sac.power = DC.D0;
    player.reality.glyphs.sac.infinity = DC.D0;
    player.reality.glyphs.sac.time = DC.D0;
    player.reality.glyphs.sac.replication = DC.D0;
    player.reality.glyphs.sac.dilation = DC.D0;
    player.reality.glyphs.sac.effarig = DC.D0;
    player.reality.glyphs.sac.reality = DC.D0;
    player.reality.glyphs.undo = [];
    player.reality.glyphs.protectedRows = 0;
    Glyphs.autoClean(0);
    player.reality.glyphs.protectedRows = rowProtect;
    Glyphs.unequipAll();
    player.reality.glyphs.protectedRows = 0;
    Glyphs.autoClean(0);
    player.reality.glyphs.protectedRows = rowProtect;
    player.reality.glyphs.createdRealityGlyph = false;
    player.reality.initialSeed = Math.floor(Date.now() * Math.random() + 1);
    player.reality.seed = 1;
    player.reality.secondGaussian = 1e6;
    player.reality.musicSeed = Math.floor(Date.now() * Math.random() + 0xBCDDECCB);
    player.reality.musicSecondGaussian = 1e6;
    player.reality.rebuyables = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    player.reality.upgradeBits = 0;
    player.reality.upgReqs = 0;
    player.reality.imaginaryUpgReqs = remains;
    player.reality.imaginaryUpgradeBits = darkremains;
    player.reality.imaginaryRebuyables = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
    };
    player.reality.reqLock = {
      reality: 0,
      imaginary: 0,
    };
    player.reality.perks = new Set();
    player.reality.respec = false;
    player.reality.showGlyphSacrifice = false;
    player.reality.showSidebarPanel = GLYPH_SIDEBAR_MODE.INVENTORY_MANAGEMENT;
    player.reality.autoAutoClean = false;
    player.reality.perkPoints = 0;
    player.reality.unlockedEC = 0;
    player.reality.autoEC = true;
    player.reality.lastAutoEC = 0;
    player.reality.partEternitied = DC.D0;
    player.reality.autoAchieve = true;
    player.reality.gainedAutoAchievements = true;
    player.reality.achTimer = DC.D0;
    player.reality.hasCheckedFilter = false;
    player.reality.glyphs.sac.power = DC.D0;
    player.reality.glyphs.sac.infinity = DC.D0;
    player.reality.glyphs.sac.time = DC.D0;
    player.reality.glyphs.sac.replication = DC.D0;
    player.reality.glyphs.sac.dilation = DC.D0;
    player.reality.glyphs.sac.effarig = DC.D0;
    player.reality.glyphs.sac.reality = DC.D0;
    if (ImaginaryUpgrade(22).isBought) ImaginaryUpgrade(22).onPurchased();
    player.blackHole = Array.range(0, 2).map(id => ({
      id,
      intervalUpgrades: EndgameUpgrade(6).isBought ? 40 : 0,
      powerUpgrades: 0,
      durationUpgrades: EndgameUpgrade(6).isBought ? 40 : 0,
      phase: 0,
      active: false,
      unlocked: false,
      activations: 0,
    }));
    player.blackHolePause = false;
    player.blackHoleAutoPauseMode = 0;
    player.blackHolePauseTime = 0;
    player.blackHoleNegative = 1;
    player.celestials.teresa.pouredAmount = DC.D0;
    player.celestials.teresa.quoteBits = 0;
    player.celestials.teresa.unlockBits = 0;
    player.celestials.teresa.run = false;
    player.celestials.teresa.bestRunAM = DC.D1;
    player.celestials.teresa.bestAMSet = [];
    player.celestials.teresa.lastRepeatedMachines = DC.D0;
    player.celestials.teresa.perkShop = Array.repeat(0, 7);
    player.celestials.teresa.perkShop[0] = charge1;
    player.celestials.teresa.perkShop[1] = charge2;
    player.celestials.teresa.perkShop[2] = charge3;
    player.celestials.teresa.perkShop[3] = charge4;
    player.celestials.teresa.perkShop[6] = maxPerkCharges;
    player.celestials.effarig.relicShards = EndgameUpgrade(6).isBought ? DC.E12 : DC.D0;
    player.celestials.effarig.unlockBits = ExpansionPack.effarigPack.isBought ? 15 : 0;
    player.celestials.effarig.run = false;
    player.celestials.effarig.quoteBits = 0;
    player.celestials.effarig.glyphWeights.ep = 25;
    player.celestials.effarig.glyphWeights.repl = 25;
    player.celestials.effarig.glyphWeights.dt = 25;
    player.celestials.effarig.glyphWeights.eternities = 25;
    player.celestials.effarig.autoAdjustGlyphWeights = false;
    player.celestials.enslaved.isStoring = false;
    player.celestials.enslaved.stored = DC.D0;
    player.celestials.enslaved.isStoringReal = false;
    player.celestials.enslaved.storedReal = 0;
    player.celestials.enslaved.autoStoreReal = false; 
    player.celestials.enslaved.isAutoReleasing = false;
    player.celestials.enslaved.quoteBits = 0;
    player.celestials.enslaved.unlocks = [];
    player.celestials.enslaved.run = false;
    player.celestials.enslaved.completed = false;
    player.celestials.enslaved.tesseracts = 0;
    player.celestials.enslaved.hasSecretStudy = false;
    player.celestials.enslaved.feltEternity = false;
    player.celestials.enslaved.progressBits = 0;
    player.celestials.enslaved.hintBits = 0;
    player.celestials.enslaved.hintUnlockProgress = 0;
    player.celestials.enslaved.glyphHintsGiven = 0;
    player.celestials.enslaved.zeroHintTime = 0;
    Enslaved.autoReleaseTick = 0;
    player.celestials.v.unlockBits = ExpansionPack.vPack.isBought ? 1 : 0;
    player.celestials.v.run = false;
    player.celestials.v.quoteBits = 0;
    
    player.celestials.v.runUnlocks = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    player.celestials.v.goalReductionSteps = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    player.celestials.v.STSpent = 0;
    player.celestials.v.runGlyphs = [[], [], [], [], [], [], [], [], []];
    player.celestials.v.runRecords = [DC.E1.neg(), DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0];
    player.celestials.v.wantsFlipped = true;
    V.spaceTheorems = 0;
    player.celestials.v.vTime = 0;
    player.celestials.v.vAuto = 0;
    player.celestials.v.vTotal = 0;
    player.celestials.v.vLayer = 0; 
    player.celestials.ra.pets.teresa.level = 1;
    player.celestials.ra.pets.teresa.memories = 0;
    player.celestials.ra.pets.teresa.memoryChunks = 0;
    player.celestials.ra.pets.teresa.memoryUpgrades = 0;
    player.celestials.ra.pets.teresa.chunkUpgrades = 0;
    player.celestials.ra.pets.effarig.level = 1;
    player.celestials.ra.pets.effarig.memories = 0;
    player.celestials.ra.pets.effarig.memoryChunks = 0;
    player.celestials.ra.pets.effarig.memoryUpgrades = 0;
    player.celestials.ra.pets.effarig.chunkUpgrades = 0;
    player.celestials.ra.pets.enslaved.level = 1;
    player.celestials.ra.pets.enslaved.memories = 0;
    player.celestials.ra.pets.enslaved.memoryChunks = 0;
    player.celestials.ra.pets.enslaved.memoryUpgrades = 0;
    player.celestials.ra.pets.enslaved.chunkUpgrades = 0;
    player.celestials.ra.pets.v.level = 1;
    player.celestials.ra.pets.v.memories = 0;
    player.celestials.ra.pets.v.memoryChunks = 0;
    player.celestials.ra.pets.v.memoryUpgrades = 0;
    player.celestials.ra.pets.v.chunkUpgrades = 0; 
    player.celestials.ra.alchemy = Array.repeat(0, 21)
    .map(() => ({
      amount: 0,
      bestPreDoom: 0,
      reaction: false
    }));
    player.celestials.ra.highestRefinementValue.power = 0;
    player.celestials.ra.highestRefinementValue.infinity = 0;
    player.celestials.ra.highestRefinementValue.time = 0;
    player.celestials.ra.highestRefinementValue.replication = 0;
    player.celestials.ra.highestRefinementValue.dilation = 0;
    player.celestials.ra.highestRefinementValue.effarig = 0;
    if (!Achievement191.isUnlocked) {
      player.celestials.ra.quoteBits = 0;
    }
    player.celestials.ra.momentumTime = 0;
    if (!ExpansionPack.raPack.isBought) {
      player.celestials.ra.unlockBits = 0;
      player.celestials.ra.unlocks = [];
    }
    player.celestials.ra.run = false;
    player.celestials.ra.charged = new Set();
    player.celestials.ra.disCharge = false;
    player.celestials.ra.peakGamespeed = DC.D1;
    player.celestials.ra.petWithRemembrance = "";
    player.celestials.laitela.darkMatter = DC.D0;
    player.celestials.laitela.unnerfedDarkMatter = DC.D0;
    player.celestials.laitela.maxDarkMatter = DC.D0;
    player.celestials.laitela.run = false;
    if (!ExpansionPacks.areUnlocked) {
      player.celestials.laitela.quoteBits = 0;
    }
    player.celestials.laitela.dimensions = Array.range(0, 8).map(() =>
      ({
        amount: DC.D0,
        intervalUpgrades: DC.D0,
        powerDMUpgrades: DC.D0,
        powerDEUpgrades: DC.D0,
        timeSinceLastUpdate: 0,
        ascensionCount: DC.D0
      }));
    if (ImaginaryUpgrade(15).isBought) DarkMatterDimension(1).amount = DC.D1;
    if (ImaginaryUpgrade(16).isBought) DarkMatterDimension(2).amount = DC.D1;
    if (ImaginaryUpgrade(17).isBought) DarkMatterDimension(3).amount = DC.D1;
    if (ImaginaryUpgrade(18).isBought) DarkMatterDimension(4).amount = DC.D1;
    if (ImaginaryUpgrade(26).isBought) DarkMatterDimension(5).amount = DC.D1;
    if (ImaginaryUpgrade(27).isBought) DarkMatterDimension(6).amount = DC.D1;
    if (ImaginaryUpgrade(28).isBought) DarkMatterDimension(7).amount = DC.D1;
    if (ImaginaryUpgrade(29).isBought) DarkMatterDimension(8).amount = DC.D1;
    player.celestials.laitela.entropy = DC.D0;
    player.celestials.laitela.thisCompletion = 3600;
    player.celestials.laitela.fastestCompletion = 3600;
    player.celestials.laitela.difficultyTier = 0;
    player.celestials.laitela.upgrades = {};
    player.celestials.laitela.darkMatterMult = DC.D1;
    player.celestials.laitela.darkEnergy = DC.D0;
    player.celestials.laitela.singularities = ExpansionPack.laitelaPack.isBought ? DC.E1 : DC.D0;
    player.celestials.laitela.singularityCapIncreases = DC.D0;
    player.celestials.laitela.lastCheckedMilestones = DC.D0;
    player.celestials.pelle.doomed = false;
    player.celestials.pelle.upgrades = new Set();
    player.celestials.pelle.remnants = 0;
    player.celestials.pelle.realityShards = DC.D0;
    player.celestials.pelle.records.totalAbsurdityAntimatter = DC.D0;
    player.celestials.pelle.records.totalRealityAntimatter = DC.D0;
    player.celestials.pelle.records.totalEternityAntimatter = DC.D0;
    player.celestials.pelle.records.totalInfinityAntimatter = DC.D0;
    player.celestials.pelle.records.totalInfinityPoints = DC.D0;
    player.celestials.pelle.records.totalEternityPoints = DC.D0;
    player.celestials.pelle.rebuyables.antimatterDimensionMult = 0;
    player.celestials.pelle.rebuyables.timeSpeedMult = 0;      
    player.celestials.pelle.rebuyables.glyphLevels = 0;
    player.celestials.pelle.rebuyables.infConversion = 0;
    player.celestials.pelle.rebuyables.galaxyPower = 0;
    player.celestials.pelle.rebuyables.galaxyGeneratorAdditive = 0;
    player.celestials.pelle.rebuyables.galaxyGeneratorMultiplicative = 0;
    player.celestials.pelle.rebuyables.galaxyGeneratorAntimatterMult = 0;
    player.celestials.pelle.rebuyables.galaxyGeneratorIPMult = 0;
    player.celestials.pelle.rebuyables.galaxyGeneratorEPMult = 0;
    player.celestials.pelle.rebuyables.galaxyGeneratorRSMult = 0;
    player.celestials.pelle.rifts.vacuum.fill = DC.D0;
    player.celestials.pelle.rifts.vacuum.active = false;
    player.celestials.pelle.rifts.vacuum.reducedTo = 1;
    player.celestials.pelle.rifts.decay.fill = DC.D0;
    player.celestials.pelle.rifts.decay.active = false;
    player.celestials.pelle.rifts.decay.percentageSpent = 0;
    player.celestials.pelle.rifts.decay.reducedTo = 1;
    player.celestials.pelle.rifts.chaos.fill = 0;
    player.celestials.pelle.rifts.chaos.active = false;
    player.celestials.pelle.rifts.chaos.reducedTo = 1;
    player.celestials.pelle.rifts.recursion.fill = DC.D0;
    player.celestials.pelle.rifts.recursion.active = false;
    player.celestials.pelle.rifts.recursion.reducedTo = 1;
    player.celestials.pelle.rifts.paradox.fill = DC.D0;
    player.celestials.pelle.rifts.paradox.active = false;
    player.celestials.pelle.rifts.paradox.reducedTo = 1;
    player.celestials.pelle.progressBits = 0;
    player.celestials.pelle.galaxyGenerator.unlocked = false;
    player.celestials.pelle.galaxyGenerator.spentGalaxies = DC.D0;
    player.celestials.pelle.galaxyGenerator.generatedGalaxies = DC.D0;
    player.celestials.pelle.galaxyGenerator.phase = 0;
    player.celestials.pelle.galaxyGenerator.sacrificeActive = false;
    player.celestials.pelle.collapsed.upgrades = false;
    player.celestials.pelle.collapsed.rifts = false;
    player.celestials.pelle.collapsed.galaxies = false;
    player.celestials.pelle.showBought = false;
    player.dilation.studies = [];
    player.dilation.active = false;
    player.dilation.upgrades.clear();
    player.dilation.rebuyables = {
      1: 0,
      2: 0,
      3: 0,
      11: 0,
      12: 0,
      13: 0
    };
    Currency.tachyonParticles.reset();
    player.dilation.nextThreshold = DC.E3;
    player.dilation.baseTachyonGalaxies = DC.D0;
    player.dilation.totalTachyonGalaxies = DC.D0;
    Currency.dilatedTime.reset();
    player.dilation.lastEP = DC.DM1;
    player.shownRuns.Reality = true;
    player.shownRuns.Eternity = true;
    player.shownRuns.Infinity = true;
    player.requirementChecks.infinity.maxAll = false;
    player.requirementChecks.infinity.noSacrifice = true;
    player.requirementChecks.infinity.noAD8 = true;
    player.requirementChecks.eternity.onlyAD1 = true;
    player.requirementChecks.eternity.onlyAD8 = true;
    player.requirementChecks.eternity.noAD1 = true;
    player.requirementChecks.eternity.noRG = true;
    player.requirementChecks.reality.noAM = true;
    player.requirementChecks.reality.noTriads = true;
    player.requirementChecks.reality.noPurchasedTT = true;
    player.requirementChecks.reality.noInfinities = true;
    player.requirementChecks.reality.noEternities = true;
    player.requirementChecks.reality.noContinuum = true;
    player.requirementChecks.reality.maxID1 = DC.D0;
    player.requirementChecks.reality.maxStudies = 0;
    player.requirementChecks.reality.maxGlyphs = 0;
    player.requirementChecks.reality.slowestBH = 1;
    resetChallengeStuff();
    player.eternityChalls = {};
    player.reality.unlockedEC = 0;
    player.reality.lastAutoEC = 0;
    player.challenge.eternity.current = 0;
    player.challenge.eternity.unlocked = 0;
    player.challenge.eternity.requirementBits = 0;
    Lazy.invalidateAll();
    ECTimeStudyState.invalidateCachedRequirements();
    player.IPMultPurchases = 0;
    Currency.infinityPower.reset();
    player.postC4Tier = 0;
    Currency.timeShards.reset();
    Replicanti.reset(true);
    Currency.eternityPoints.reset();
    EternityUpgrade.epMult.reset();
    Currency.eternities.reset();
    player.eternityUpgrades.clear();
    player.totalTickGained = 0;
    player.totalTickBought = 0;
    Currency.timeTheorems.reset();
    resetEternityRuns();
    secondSoftReset(false);
    player.respec = false;
    player.eterc8ids = 50;
    player.eterc8repl = 40;
    player.auto.bigCrunch.mode = 0;
    player.auto.eternity.mode = 0;
    Autobuyers.reset();
    InfinityDimensions.fullReset();
    InfinityDimensions.resetAmount();
    fullResetTimeDimensions();
    resetTimeDimensions();
    player.buyUntil10 = true;
    player.sacrificed = DC.D0;
    playerInfinityUpgradesOnReset();
    Currency.infinityPoints.reset();
    resetInfinityRuns();
    Currency.infinities.reset();
    Currency.infinitiesBanked.reset();
    player.partInfinityPoint = DC.D0;
    player.partInfinitied = 0;
    player.dimensionBoosts = DC.D0;
    player.galaxies = DC.D0;
    if (player.eternities.lte(1)) {
      player.break = false;
    }
    resetTickspeed();
    AntimatterDimensions.reset();
    Currency.antimatter.reset();
    CelestialDimensions.resetAmount();
    initializeChallengeCompletions(true);
    player.records.totalTimePlayed = new Decimal(player.records.realTimePlayed);
    player.records.timePlayedAtBHUnlock = DC.E9E15;
    player.records.realTimeDoomed = 0;
    player.records.totalAbsurdityAntimatter = DC.E1;
    player.records.totalRealityAntimatter = DC.E1;
    player.records.totalEternityAntimatter = DC.E1;
    player.records.totalInfinityAntimatter = DC.E1;
    player.records.recentInfinities = Array.range(0, 10).map(() =>
      [DC.E9E15, Number.MAX_VALUE, DC.D1, DC.D1, ""]);
    player.records.recentEternities = Array.range(0, 10).map(() =>
      [DC.E9E15, Number.MAX_VALUE, DC.D1, DC.D1, "", DC.D0]);
    player.records.recentRealities = Array.range(0, 10).map(() =>
      [DC.E9E15, Number.MAX_VALUE, DC.D1, 1, "", 0, 0]);
    player.records.thisInfinity.time = DC.D0;
    player.records.thisInfinity.realTime = 0;
    player.records.thisInfinity.lastBuyTime = DC.D0;
    player.records.thisInfinity.maxAM = DC.D0;
    player.records.thisInfinity.bestIPmin = DC.D0;
    player.records.thisInfinity.bestIPminVal = DC.D0;
    player.records.bestInfinity.time = DC.E9E15;
    player.records.bestInfinity.realTime = Number.MAX_VALUE;
    player.records.bestInfinity.bestIPminEternity = DC.D0;
    player.records.bestInfinity.bestIPminReality = DC.D0;
    player.records.thisEternity.time = DC.D0;
    player.records.thisEternity.realTime = 0;
    player.records.thisEternity.maxAM = DC.D0;
    player.records.thisEternity.maxIP = DC.D0;
    player.records.thisEternity.bestIPMsWithoutMaxAll = DC.D0;
    player.records.thisEternity.bestEPmin = DC.D0;
    player.records.thisEternity.bestEPminVal = DC.D0;
    player.records.thisEternity.bestInfinitiesPerMs = DC.D0;
    player.records.bestEternity.time = DC.E9E15;
    player.records.bestEternity.realTime = Number.MAX_VALUE;
    player.records.bestEternity.bestEPminReality = DC.D0;
    player.records.thisReality.time = DC.D0;
    player.records.thisReality.realTime = 0;
    player.records.thisReality.maxAM = DC.D0;
    player.records.thisReality.maxIP = DC.D0;
    player.records.thisReality.maxEP = DC.D0;
    player.records.thisReality.bestEternitiesPerMs = DC.D0;
    player.records.thisReality.maxReplicanti = DC.D0;
    player.records.thisReality.maxDT = DC.D0;
    player.records.thisReality.bestRSmin = DC.D0;
    player.records.thisReality.bestRSminVal = DC.D0;
    player.records.bestReality.time = DC.E9E15;
    player.records.bestReality.realTime = Number.MAX_VALUE;
    player.records.bestReality.glyphStrength = 0;
    player.records.bestReality.RM = DC.D0;
    player.records.bestReality.RMSet = [];
    player.records.bestReality.RMmin = DC.D0;
    player.records.bestReality.RMminSet = [];
    player.records.bestReality.glyphLevel = 0;
    player.records.bestReality.glyphLevelSet = [];
    player.records.bestReality.bestEP = DC.D0;
    player.records.bestReality.bestEPSet = [];
    player.records.bestReality.speedSet = [];
    player.records.bestReality.iMCapSet = [];
    player.records.bestReality.laitelaSet = [];
    player.records.thisAbsurdity.time = DC.D0;
    player.records.thisAbsurdity.realTime = 0;
    player.records.thisAbsurdity.peakGameSpeed = DC.D1;
    if (Achievement(165).isUnlocked) {
      player.celestials.effarig.autoAdjustGlyphWeights = true;
    }
  }
};
