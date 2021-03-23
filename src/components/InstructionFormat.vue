<template>
  <div class="Welcome">
    <div class="container">
      <div class="card">
        <div class="card-header">
          Before you begin, please read the following general test format and instructions
          carefully.
        </div>
        <div class="info">
          <ul>
            <div class="lists">
              <li>
                There are three different audios with three different difficulty levels i.e easy,
                medium, and hard.
              </li>
              <br />
              <li>
                All audio files will be in English and the difficulty order will be randomized.
              </li>
              <br />
              <li>On average, it will take approximately 30 minutes to complete each test.</li>
              <br />
              <li>
                You are advised to complete a single audio within one hour and complete all three
                tasks before you exit the test.
              </li>
              <br />
              <li>It is recommended that you give the test from a computer.</li>
              <br />
              <li>
                In order to complete this test, please ensure that you have a stable internet
                connection. In case you face internet issues, notify us via text or call at
                9817684555.
              </li>
              <br />
              <li>
                For any other questions or concerns, please email us at
                skilllab.careerprep@gmail.com .
              </li>
              <br />
              <li>After consideration, the decision taken by the Skill Lab team will be final.</li>
              <br />
            </div>
          </ul>
        </div>
        <div class="card-footer">
          <b-button type="button" class="sbutton-imp p-2 m-2" @click="takeTest" variant="info">
            <span class="button-header">Take Test</span>
          </b-button>
          <b-button
            type="button"
            class="sbutton-imp p-2 m-2"
            @click="takePracticeTest"
            variant="success"
          >
            <span class="button-header">Take Practice Test</span>
          </b-button>
          <!-- <b-button type="button" class="sbutton-imp p-2 m-2" @click="takeTest" variant="info">
            <span class="button-header">Take Test</span>
          </b-button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    takeTest() {
      this.$store.state.Test.PracticeTest = false;
      this.$router.push({ name: 'Instructions' });
    },
    takePracticeTest() {
      this.$store.state.Test.PracticeTest = true;
      this.$router.push({ name: 'PracticeTest' });
    },
  },
};
</script>
