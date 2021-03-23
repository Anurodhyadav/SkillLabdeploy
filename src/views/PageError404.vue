<template>
  <div class="error">
    <h1>404 ERROR</h1>
    <p>Page not found</p>
    <vs-button href="/#/">Go back to Home Page</vs-button>
  </div>
</template>
<style scoped>
.error {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
h1 {
  color: aliceblue;
  font-size: 5rem;
}
p {
  color: aliceblue;
  font-size: 2.2rem;
}
</style>
