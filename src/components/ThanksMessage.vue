<template>
  <div>
    <vs-popup
      class="holamundo"
      title="Skill Lab"
      :active.sync="instructionsPop"
      color="white"
      background-color-popup="rgb(19, 25, 45, 1)"
    >
      <div class="thanks">
        <p>
          Thank you for taking the time to apply. We want to make sure we are the right fit for you
          as much as you are the right fit for us!
        </p>
        <p>You'll hear back from us within 3 working days via email.</p>
      </div>
    </vs-popup>
    <!-- <vs-button @click="popIn">start</vs-button> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      popupActivo: true,
      instructionsPop: true,
      myTime: '00:00:00',
      time: 0,
      mins: 0,
      secs: 0,
      millisecs: 0,
      timeTaken: '',
      running: 1,
    };
  },
};
</script>
<style scoped>
p {
  color: aliceblue;
  font-size: 1.5rem;
}
.vs-popup--header {
  color: green;
}
</style>
