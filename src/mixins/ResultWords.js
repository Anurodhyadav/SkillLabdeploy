export default {
  data() {
    return {
      percentile: {
        89: {
          text: 'Amazing work',
          body:
            'Your performance was fantastic, keep up the good work. You are among the top few students who have given the test',
        },
        59: {
          text: 'Great job',
          body: "Your performance was pretty good! However, there's always a room for imporvement",
        },
        1: {
          text: 'Good Job',
          body: "With a little more effort, you'll definitely reach higher!",
        },
        0: {
          text: 'Good work',
          body: 'Thankyou for giving the test.',
        },
      },
    };
  },
  methods: {
    quoteText(jsDiff) {
      if (jsDiff > 89) {
        const percentileObj = this.percentile['89'];
        this.textTop = percentileObj.text;
        this.topBody = percentileObj.body;
      } else if (jsDiff > 59) {
        const percentileObj = this.percentile['59'];
        this.textTop = percentileObj.text;
        this.topBody = percentileObj.body;
      } else if (jsDiff >= 1) {
        const percentileObj = this.percentile['1'];
        this.textTop = percentileObj.text;
        this.topBody = percentileObj.body;
      } else {
        const percentileObj = this.percentile['0'];
        this.textTop = percentileObj.text;
        this.topBody = percentileObj.body;
      }
    },
    findTime() {
      let time = this.timeTaken;
      const totalTime = this.timeSec / 60;
      const min = parseInt(time.substring(0, time.lastIndexOf(':')), 10);
      const sec = parseInt(time.substring(time.lastIndexOf(':') + 1), 10);
      time = min + sec / 60;
      this.ratio = time / totalTime;
      this.ratio = this.ratio.toFixed(2);
    },
  },
};
