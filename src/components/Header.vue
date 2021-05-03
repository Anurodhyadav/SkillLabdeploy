<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-brand href="/#/">
                <img
                    src="../img/logo.png"
                    class="d-inline-block align-top"
                    alt="logo"
                    style="width: 170px; height: 50px"
                />
            </b-navbar-brand>
            <a
                v-if="allowAccess === true || allowSuperAdmin === true"
                class="navbar-brand"
                href="/#/stats"
                >Admin section</a
            >
            <!-- <a class="navbar-brand" href="/#/feedbackform">Feedback</a> -->

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-item right @click="popupAbout">About</b-nav-item>
                    <b-nav-item right @click="popupContact">Contact Us</b-nav-item>
                    <!-- <b-nav-item right>Sign In</b-nav-item> -->
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <vs-popup class="popup" title="About" :active.sync="aboutPop">
            <p>
                SKILL LAB, an initiative to connect industry based knowledge, skills and
                competencies to Academic Institutions in Nepal and also function as Career Pathways
                for the undergraduate students enhancing employability outcomes.
            </p>
        </vs-popup>
        <vs-popup class="popup" title="Contact Us" :active.sync="contactPop">
            <div>
                <span>
                    <b-icon icon="telephone"></b-icon>
                    9817684555
                </span>
            </div>
            <div>
                <span>
                    <b-icon icon="envelope"></b-icon>
                    skilllab.careerprep@gmail.com
                </span>
            </div>
        </vs-popup>
    </div>
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { db } from '../firebase/db';

export default {
    name: 'Header',
    data() {
        return {
            aboutPop: false,
            contactPop: false,
            allowAccess: false,
            allowSuperAdmin: false,
            current_User_email: '',
        };
    },
    methods: {
        popupAbout() {
            this.aboutPop = true;
        },
        popupContact() {
            this.contactPop = true;
        },
    },
    created() {
        const user = firebase.auth().currentUser;
        // below check for admin role
        if (user) {
            this.current_User_email = user.email;
            db.collection('UserData')
                .where('email', '==', this.current_User_email)
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        const Data = {
                            role: doc.data().role,
                            superuser: doc.data().superuser,
                        };
                        this.userRole = Data.role;
                        this.mySuperuser = Data.superuser;
                        if (this.mySuperuser) {
                            this.allowSuperAdmin = true;
                        }
                        if (this.userRole === 'admin') {
                            this.allowAccess = true;
                        } else {
                            this.$router.replace({ name: 'Home' });
                        }
                    });
                });
        }
    },
};
</script>

<style scoped>
.navbar-brand {
    margin-left: 50px;
}
.ml-auto {
    font-size: 20px;
}
</style>
