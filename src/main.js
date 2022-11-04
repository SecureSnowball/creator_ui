import Vue from "vue";
import Buefy from "buefy";
import App from "@/App.vue";
import store from "./store";
// import { StripePlugin } from "@vue-stripe/vue-stripe";
import "buefy/dist/buefy.css";
import router from "./router";
import "./registerServiceWorker";

Vue.use(Buefy);

Vue.config.productionTip = false;

// const options = {
//   pk: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
//   apiVersion: import.meta.env.VITE_API_VERSION,
// };

// Vue.use(StripePlugin, options);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
