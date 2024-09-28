// import { ref } from "vue";
import { defineStore } from "pinia";

// export const useAccountStore = defineStore("account", () => {
//   const account = ref(JSON.parse(window.localStorage.getItem("user")));
//   function setAccount(account) {
//     account.value = { ...account };
//     localStorage.setItem("user", JSON.stringify(account));
//   }
//   function clear() {
//     account.value = null;
//     localStorage.removeItem("user");
//   }

//   return { account, setAccount, clear };
// });

export const useAccountStore = defineStore("account", {
  state: () => ({ _account: JSON.parse(window.localStorage.getItem("user")) }),
  getters: { account: (state) => state._account },
  actions: {
    setAccount(account) {
      this._account = { ...account };
      localStorage.setItem("user", JSON.stringify(account));
    },
    clear() {
      this._account = null;
      localStorage.removeItem("user");
    },
  },
});
