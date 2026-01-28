<script>
import ClassicGalacticDimensionTab from "./ClassicGalacticDimensionTab";
import ModernGalacticDimensionTab from "./ModernGalacticDimensionTab";

export default {
  name: "GalacticDimensionsTab",
  components: {
    ClassicGalacticDimensionTab,
    ModernGalacticDimensionTab
  },
  computed: {
    activeComponent() {
      return this.$viewModel.newUI
        ? "ModernGalacticDimensionTab"
        : "ClassicGalacticDimensionTab";
    }
  }
};
</script>

<template>
  <component :is="activeComponent" />
</template>
