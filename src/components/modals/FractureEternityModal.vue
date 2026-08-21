<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "FractureEternityModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    message() {
      const eternity = formatPostFracture(Decimal.MAX_VALUE, 2);
      return `Fracturing Eternity will ^10 the antimatter hardcap.
      Currently the AM hardcap is: ${eternity}$
      After fracturing it will be: ${eternity}$
      After you fracture eternity 10 times eternity will become broken and there will no longer be an AM hardcap. 
      The cost increase for each eternity fracture is 1e15.}
    },
  },
  methods: {
    handleYesClick() {
      fractureEternity();
    }
  };
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="false"
    @confirm="handleYesClick"
  >
    <template #header>
      You are Fracturing Eternity
    </template>
    <div class="c-modal-message__text">
      <span
        v-for="(line, index) in message"
        :key="index"
      >
        {{ line }} <br>
      </span>
    </div>
    <template #confirm-text>
      Break
    </template>
  </ModalWrapperChoice>
</template>
