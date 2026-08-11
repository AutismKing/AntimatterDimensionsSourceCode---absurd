<script>
export default {
  name: "AbsurdityMilestoneButton",
  props: {
    getMilestone: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      isReached: false,
      isLocked: false,
    };
  },
  computed: {
    milestone() {
      return this.getMilestone();
    },
    config() {
      return this.milestone.config;
    },
    eternities() {
      return this.config.absurdities;
    },
    reward() {
      const reward = this.config.reward;
      return typeof reward === "function" ? reward() : reward;
    },
    rewardClassObject() {
      return {
        "o-absurdity-milestone__reward": true,
        "o-absurdity-milestone__reward--locked": !this.isReached,
        "o-absurdity-milestone__reward--reached": this.isReached,
        "o-absurdity-milestone__reward--small-font": this.reward.length > 80
      };
    },
    activeCondition() {
      return this.config.activeCondition ? this.config.activeCondition() : null;
    },
  }
};
    </span>
    </button>
  </div>
</template>

<style scoped>

</style>