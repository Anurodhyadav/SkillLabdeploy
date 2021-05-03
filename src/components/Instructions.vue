<template lang="html">
    <div class="centerx">
        <vs-button class="help" @click="popupActivo = true" color="grey">Instructions</vs-button>
        <vs-popup class="holamundo" title="Useful Instructions" :active.sync="popupActivo">
            <div class="boxwidth">
                <vs-tabs alignment="center">
                    <!-- Speaker label -->
                    <vs-tab label="Speaker Labels">
                        <div class="con-tab-ejemplo">
                            <p>
                                Press <b>Ctrl + 1 </b> for <b> speaker 1</b> and
                                <b>Ctrl + 2 </b> for <b>Speaker 2</b> and so on. Please use speaker
                                labels according to the number of speakers. <br /><br />
                                Press <b>ALT + X</b> to to close the last opened text box.
                            </p>
                        </div>
                    </vs-tab>
                    <!-- PLAY / PAUSE -->
                    <vs-tab label="Play/Pause">
                        <div class="con-tab-ejemplo">
                            Please press <b>Ctrl+Space </b>to <b>play and/ or pause</b> the audio.
                        </div>
                    </vs-tab>
                    <!-- Use of [inaudible] -->
                    <vs-tab label="Use of [inaudible]">
                        <div class="con-tab-ejemplo">
                            <p>
                                If any words are inaudible or when you can’t make out what the
                                speaker is saying, please use <b> [inaudible]</b>. <br />
                                <br />
                                <b>Example: </b> I went to [inaudible] yesterday. <br /><br />
                                <b>Example: </b> What was the end of that [inaudible]?
                            </p>
                        </div>
                    </vs-tab>
                    <vs-tab label="Use of [crosstalk]">
                        <div class="con-tab-ejemplo">
                            <p>
                                When two or more speakers speak at the same time, use [crosstalk].
                                <br /><br />
                                Speaker 1: So there was one [crosstalk]- <br />
                                Speaker 2: Hang on one moment. You cut out for a bit.
                            </p>
                        </div>
                    </vs-tab>
                    <vs-tab label="Use of dash">
                        <div class="con-tab-ejemplo">
                            <p>
                                When a speaker changes topic in the middle of the sentence, or when
                                a speaker interrupts another speaker, please use a dash
                                <b>(-)</b> to indicate the transition.
                            </p>
                            <b>Example: </b> That was surely- it was one of the most frustrating
                            moments in my life.<br /><br />
                            <b>Example: </b> And that’s why- that way, everybody can stay safe.
                        </div>
                    </vs-tab>
                    <vs-tab label="Filler Words">
                        <div class="con-tab-ejemplo">
                            <p>
                                You can avoid filler words like <b>“Um”, “Ah”, “Uh”</b>, from the
                                transcript. You can omit <b>“Like”</b> and <b>“You know”</b> if they
                                do not add any value to the transcript.
                            </p>
                        </div>
                    </vs-tab>
                </vs-tabs>
            </div>
        </vs-popup>
    </div>
</template>

<script>
export default {
    data() {
        return {
            popupActivo: false,
        };
    },
};
</script>

<style scoped>
.help {
    position: fixed;
    float: right;
    margin-top: 1%;
    margin-left: 43.5%;
    color: yellow;
    font-size: 15px;
}
.con-tab-ejemplo {
    font-weight: 500;
    font-size: 15px;
}
</style>
