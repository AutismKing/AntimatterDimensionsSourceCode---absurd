/*import { Player } from "../../player";

import { const } from "../../globals";



export const breaketernityupgrade = [
    {
      id: 3,
      cost: 100000000,
      description: "Singularities are 500% stronger",
      effect: () => 6
    },
    {
      id: 4,
      cost: 10000,
      description: "All NC, IC and EC times and time sums are always 1e-300ms.",
      effect: 1
    },
    {
      id: 5,
      cost: 10000,
      description: "All infinity, eternity and reality best times are always 1e-300ms.",
      effect: 1
   },
   {
     id: 9,
     cost: 100000,
     description: "All antimatter dimensions gain a power based on your infinity power",
     effect: () => Decimal.pow(Decimal.log10(player.infinityPower), 0.05) 
   },
   {
     id: 10,
     cost: 100000,
     description: "All infinity dimensions gain a power based on your time shards"
     effect: () => Decimal.pow(Decimal.log10(player.timeShards), 0.05)
   },
   {
     id: 11,
     cost: 100000,
     description: "All time dimensions gain a power based on your dark matter",
     effect: () => Decimal.pow(Decimal.log10(player.celestials.laitela.darkMatter), 0.05)
   },
   {
     id: 12,
     cost: 100000,
     description: "All dark matter dimensions gain a power based on your galactic power",
     effect: () => Decimal.pow(Decimal.log10(player.galacticPower), 0.05)
   },
   {
     id: 13,
     cost: 100000,
     description: "All galactic dimensions gain a multiplier based on your antimatter",
     effect: () => Decimal.pow(Decimal.log10(player.antimatter), 0.025)
   },
   {
     id: 14,
     cost: 10000,
     description: "IP is powered based on your replicanti"
     effect: () => Decimal.pow(Decimal.log10(player.replicanti.amount), 0.05)
   },
   {
     id: 15,
     cost: 10000,
     description: "replicanti is powered based on your time theorem"
     effect: () => Decimal.pow(Decimal.log10(player.timeStudy.theorem), 0.05)
   },
   {
     id: 16,
     cost: 10000,
     description: "EP is powered based on your TP"
     effect: () => Decimal.pow(Decimal.log10(player.tachyonparticles.amount), 0.05)
   },
   {
     id: 17,
     cost: 10000,
     description: "Power game speed based on your tesseract amount"
     effect: () => Decimal.pow((player.tesseracts.amount), 0.05)
   },
   {
     id: 18,
     cost: 10000,
     description: "Power glyph sac based on your highest ever glyph level"
     effect: () => Decimal.pow((player.statistics.highest.glyph.level), 0.05)
   },
   {
     id: 19,
     cost: 10000,
     description: "Power singularities based on dim boosts"
     effect: () => Decimal.pow((player.dimensionboosts.amount), 0.05)
   },
   {
     id: 20,
     cost: 10000,
     description: "Power DM annihalation mult based on galactic points"
     effect: () => Decimal.pow((player.GP.amount), 0.05)
]
