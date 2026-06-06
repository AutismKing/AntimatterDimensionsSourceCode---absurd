/* <script>
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
      return "";   */