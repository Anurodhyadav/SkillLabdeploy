import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from '@fortawesome/vue-fontawesome';
import { faSignInAlt, faShareSquare, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';

library.add(faSignInAlt, faShareSquare, faTimes, faUpload);

Vue.component('fa-icon', FontAwesomeIcon);
Vue.component('fa-layer', FontAwesomeLayers);
Vue.component('fa-layer-text', FontAwesomeLayersText);
