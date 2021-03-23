import Vue from 'vue';
import VueRouter from 'vue-router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Home from '../views/Home.vue';
import Transcriptions from '../views/Transcriptions.vue';
import Files from '../views/Files.vue';
import Register from '../views/Register.vue';
import SignIn from '../views/SignIn.vue';
import Test from '../views/Test.vue';
import Result from '../views/Result.vue';
import PracticeResult from '../views/PracticeResult.vue';
import AdminRegister from '../views/AdminRegister.vue';
import TempAdmin from '../views/TempAdmin.vue';
import UserData from '../views/UserData.vue';
import EditAudio from '../views/EditAudio.vue';
import Upload from '../views/Upload.vue';
import Instructions from '../views/Instructions.vue';
import PageError404 from '../views/PageError404.vue';
import FeedbackForm from '../views/FeedbackForm.vue';
import FeedbackRecords from '../views/FeedbackRecords.vue';
import ManageUser from '../views/ManageUser.vue';
import PracticeTest from '../views/PracticeTest.vue';
import AcceptedTestlist from '../views/AcceptedTestlist.vue';
import uploadFile from '../views/uploadFile.vue';
import InstructionFormat from '../components/InstructionFormat.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    props: true,
  },
  {
    path: '/sign_in',
    name: 'sign_in',
    component: SignIn,
    props: true,
  },
  {
    path: '/transcriptions',
    name: 'Transcriptions',
    component: Transcriptions,
    meta: { requiresAuth: true },
  },
  {
    path: '/uploadFile',
    name: 'uploadFile',
    component: uploadFile,
    meta: { requiresAuth: true },
  },
  {
    path: '/acceptedtestlist',
    name: 'AcceptedTestlist',
    component: AcceptedTestlist,
    meta: { requiresAuth: true },
  },
  {
    path: '/userdata',
    name: 'UserData',
    component: UserData,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/upload',
    name: 'Upload',
    component: Upload,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/adminregister',
    name: 'AdminRegister',
    component: AdminRegister,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/files',
    name: 'Files',
    component: Files,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/EditAudio',
    name: 'EditAudio',
    component: EditAudio,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/stats',
    name: 'TempAdmin',
    component: TempAdmin,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/practicetest',
    name: 'PracticeTest',
    component: PracticeTest,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/instructions',
    name: 'Instructions',
    component: Instructions,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/result',
    name: 'Result',
    component: Result,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/practiceresult',
    name: 'PracticeResult',
    component: PracticeResult,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/feedbackform',
    name: 'feedbackform',
    component: FeedbackForm,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/feedbackrecords',
    name: 'feedbackrecords',
    component: FeedbackRecords,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/manageuser',
    name: 'ManageUser',
    component: ManageUser,
    meta: { requiresAuth: true },
  },
  {
    path: '*',
    name: 'pageError',
    component: PageError404,
    props: true,
  },
  {
    path: '/InstructionFormat',
    name: 'InstructionFormat',
    component: InstructionFormat,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  // mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = firebase.auth().currentUser;
  if (requiresAuth && !isAuthenticated) {
    next('/sign_in');
  } else {
    next();
  }
});

export default router;
