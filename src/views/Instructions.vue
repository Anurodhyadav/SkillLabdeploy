<template>
    <div class="">
        <div class="card">
            <div class="info">
                <div
                    id="carouselContent"
                    ref="carouselContent"
                    class="carousel slide"
                    data-ride="carousel"
                >
                    <div class="carousel-inner" role="listbox">
                        <div class="carousel-item active text-center p-4">
                            <h2>Speaker Labels (1 of 6)</h2>
                            <hr />
                            <p>
                                Press <b>Ctrl + 1 </b> for <b> speaker 1</b> and
                                <b>Ctrl + 2 </b> for <b>Speaker 2</b> and so on. Please use speaker
                                labels according to the number of <br /><br />
                                Press <b>ALT + X</b> to to close the last opened text box.
                            </p>
                            <br />
                            <div class="next1">
                                <b-button
                                    href="#carouselContent"
                                    data-slide="prev"
                                    type="button"
                                    class="sbutton-imp previous"
                                    variant="info"
                                >
                                    <span class="button-header">Previous</span>
                                </b-button>
                                <b-button
                                    href="#carouselContent"
                                    data-slide="next"
                                    type="button"
                                    class="sbutton-imp next"
                                    variant="info"
                                >
                                    <span class="button-header">Next</span>
                                </b-button>
                            </div>
                        </div>
                        <div class="carousel-item text-center p-4">
                            <h2>Play/Pause (2 of 6)</h2>
                            <hr />
                            <p>
                                Please press <b>Ctrl + Space </b>to <b>play and/ or pause</b> the
                                audio.
                            </p>
                            <br />
                            <div class="next2">
                                <b-button
                                    href="#carouselContent"
                                    data-slide="next"
                                    type="button"
                                    class="sbutton-imp next"
                                    variant="info"
                                >
                                    <span class="button-header">Next</span>
                                </b-button>
                            </div>
                        </div>
                        <div class="carousel-item text-center p-4">
                            <h2>Use of [inaudible] (3 of 6)</h2>
                            <hr />
                            <p>
                                If any words are inaudible or when you can’t make out what the
                                speaker is saying, please use <b> [inaudible]</b>. <br />
                                <br />
                                <b>Example: </b> I went to [inaudible] yesterday. <br /><br />
                                <b>Example: </b> What was the end of that [inaudible]?
                            </p>
                            <br />
                            <div class="next3">
                                <b-button
                                    href="#carouselContent"
                                    data-slide="next"
                                    type="button"
                                    class="sbutton-imp next"
                                    variant="info"
                                >
                                    <span class="button-header">Next</span>
                                </b-button>
                            </div>
                        </div>
                        <div class="carousel-item text-center p-4">
                            <h2>Use of [crosstalk] (4 of 6)</h2>
                            <hr />
                            <p>
                                When two or more speakers speak at the same time, use [crosstalk].
                                <br /><br />
                                <b>Speaker 1:</b> So there was one [crosstalk]- <br />
                                <b>Speaker 2:</b> Hang on one moment. You cut out for a bit.
                            </p>
                            <br />
                            <div class="next4">
                                <b-button
                                    href="#carouselContent"
                                    data-slide="next"
                                    type="button"
                                    class="sbutton-imp next"
                                    variant="info"
                                >
                                    <span class="button-header">Next</span>
                                </b-button>
                            </div>
                        </div>
                        <div class="carousel-item text-center p-4">
                            <h2>Use of dash (5 of 6)</h2>
                            <hr />
                            <p>
                                When a speaker changes topic in the middle of the sentence, or when
                                a speaker interrupts another speaker, please use a dash
                                <b>(-)</b> to indicate the transition.
                            </p>
                            <b>Example: </b> That was surely- it was one of the most frustrating
                            moments in my life.<br /><br />
                            <b>Example: </b> And that’s why- that way, everybody can stay safe.
                            <br />
                            <br />
                            <div class="next5">
                                <b-button
                                    href="#carouselContent"
                                    data-slide="next"
                                    type="button"
                                    class="sbutton-imp next"
                                    variant="info"
                                >
                                    <span class="button-header">Next</span>
                                </b-button>
                            </div>
                        </div>
                        <div class="carousel-item text-center p-4">
                            <h2>Filler Words (6 of 6)</h2>
                            <hr />
                            <p>
                                You can avoid filler words like <b>“Um”, “Ah”, “Uh”</b>, from the
                                transcript. You can omit <b>“Like”</b> and <b>“You know”</b> if they
                                do not add any value to transcript.
                            </p>
                            <br /><br /><br />
                            <div class="next6">
                                <vs-button
                                    color="primary"
                                    class="starttest"
                                    type="gradient"
                                    @click.native="navigateToTest()"
                                    >Start Test</vs-button
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- <p>
        1. <b>Please click on the center of the screen. </b>When you see a
        <b>blinking cursor </b>press <b>Ctrl+Space </b>to play and/ or pause the audio the left left
        left corner of the screen).
      </p>
      <p>
        2. The one you see on the right end of the blinking cursor is the speaker labels. Speaker 1
        is automatically assigned. If there are multiple speakers in the audio you can differentiate
        them by pressing <b>Ctrl+2, Ctrl+3 </b>and so on to change the speaker label. If there are
        only two speakers, you can use <b>Ctrl+Enter</b> to alternate between speakers.
      </p>
      <p><b>**Press ALT + X to remove the last opened textfield**</b></p>
      <p>
        3. If any words are inaudible, <b>type [inaudible] in parenthesis</b> rather than [can’t
        make out] or (inaudible). It’s better to mark something as inaudible rather than making a
        wild guess.<br />
        <b>Example 1</b>: I have been working at <b>[inaudible]</b> since 2015. <br />
        <b>Example 2</b>: Didn't you say that you work at <b>[inaudible]</b>?
      </p>
      <p>
        4. If two people speak at the same time, muffling the audio, use <b>[crosstalk]</b> instead
        of [inaudible].
      </p>
      <p>
        5. <b>Use a hyphen (-) to indicate a sudden change of speaker</b> (as would happen if he or
        were interrupted) or to set off a sentence fragment from a subsequent complete sentence.
        This is an extremely common case in the kind of audio we transcribe, so use the dash
        liberally.
      </p>
      <p>
        <b>Example 1</b>: Here we see the Trumpeter Swan- sorry, wrong slide- performing its ritual
        mating mating dance.<br />
        <b>Example 2</b>: That was surely- it was one of the most frustrating moments in my life.<br />
        <b>Example 3</b>: I love it. Okay, so let me just explain to you again. You know, how I'm-
        let me just get my information, and then we'll just jump right into it, okay?
      </p>
      <p>
        Make sure that there is <b>no space before and a space after the hyphen</b> when it is used
        in these situations.
      </p>
      <p>
        6. Avoid filler words like <b>‘um’</b> and <b>‘ah’</b>. You
        <b>don’t need to write them</b> in the transcript. You also do not need to write
        <b>'like'</b> and <b>'you know'</b> if they do not add any value to the sentence. In these
        cases, use your own judgement to decide when to include it, and when to omit it.
      </p>
      <p>
        7. If a question is asked and the speaker replies by saying ‘mm-hmm,’ write the
        <b>‘mm-hmm.’</b> The ‘mm-hmm’ here represents an answer to a question and
        <b>should therefore be written</b>.
      </p>
      <p><b>Example</b> Speaker 1: Do you live in California? <br />Speaker 2: Mm-hmm.</p>
      <p>
        8. Try to <b>keep paragraphs not more than 3 to 4 lines</b>. You can change paragraphs by
        pressing <b>Enter</b>. Also, try to ensure that the transcript
        <b>follows grammatical rules</b>.
      </p> -->
    <!-- </vs-popup> -->
</template>

<script>
import store from '../store';

export default {
    data() {
        return {
            isPracticeTest: store.state.Test.PracticeTest,
        };
    },
    methods: {
        navigateToTest() {
            if (this.isPracticeTest) {
                this.$router.push({ name: 'PracticeTest', params: { mode: 'practicetest' } });
            } else {
                this.$router.push({ name: 'Test', params: { mode: 'test' } });
            }
        },
    },
};
</script>
<style scoped>
.testbtn {
    background-color: rgba(8, 8, 243, 0.61);
    color: #000;
    border-radius: 10px;
}
.starttest {
    width: 32%;
    justify-content: center;
}
.span1 {
    font-size: 17px;
    background-color: rgb(105, 102, 102);
    color: greenyellow;
}
.con-tab-ejemplo {
    font-weight: 500;
    font-size: 16px;
}
.sbutton-imp {
    width: 17%;
}
.next {
    padding: 10;
}
.previous {
    display: none;
}
.card {
    margin-top: 6%;
}
.sbutton-imp {
    width: 200px;
}
.info {
    height: 60vh;
}
.next1 {
    /* background-color: aliceblue; */
    margin-top: 14%;
}
.next2 {
    margin-top: 22%;
}
.next3 {
    margin-top: 10%;
}
.next4 {
    margin-top: 10%;
}
.next5 {
    margin-top: 4%;
}
.next6 {
    margin-top: 13%;
}
</style>
