import "./assets/main.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";

import PrimeVue from "primevue/config";
import "primevue/resources/themes/aura-light-blue/theme.css";
import "/node_modules/primeflex/primeflex.css";
import "primeicons/primeicons.css";
import ConfirmationService from "primevue/confirmationservice";

import App from "./App.vue";

const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue);
app.use(ConfirmationService);

app.mount("#app");
