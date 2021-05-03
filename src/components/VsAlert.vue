<template>
    <vs-popup
        :title="title"
        :active.sync="isPopupOpen"
        button-close-hidden
        color="white"
        background-color-popup="rgb(19, 25, 45, 1)"
        class="pop-up"
        align-items="center"
    >
        <slot></slot>
        <vs-button color="primary" type="filled" @click="acceptEvent" v-if="isConfirm">
            Accept
        </vs-button>
        <vs-button color="primary" type="filled" @click="continueEvent">
            {{ type === 'alert' ? 'Continue' : 'Cancel' }}
        </vs-button>
    </vs-popup>
</template>
<script>
export default {
    props: {
        visibility: {
            type: Boolean,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            isPopupOpen: false,
        };
    },
    methods: {
        continueEvent() {
            this.$emit('closing');
        },
        acceptEvent() {
            this.$emit('accept');
        },
    },
    computed: {
        isConfirm() {
            return this.type === 'confirm';
        },
    },
    watch: {
        visibility(value) {
            this.isPopupOpen = value;
        },
    },
    mounted() {
        this.$children[0].$on('close', () => {
            this.isPopupOpen = true;
        });
    },
};
</script>

<style scoped>
.pop-up {
    color: white;
}
</style>
