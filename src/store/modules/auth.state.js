import HttpService from "../../services/http.service";
import ValidationException from "../../exceptions/ValidationException";

export default {
  namespaced: true,

  state: () => ({
    loading: {
      login: false,
      register: false,
      logout: false,
    },
    token: undefined, // Authorization token
    user: undefined, // Logged in user basic profile
  }),

  actions: {
    // Initialize state from localStorage
    bootstrap({ commit }) {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const user = JSON.parse(localStorage.getItem("user"));
          commit("setTokens", { token, user });
        }
      } catch (e) {
        console.error(e);
      }
    },

    setUserToken({ commit }, { user, token }) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      commit("setUserToken", { user, token });
    },

    unsetTokens({ commit }) {
      localStorage.clear();
      commit("unsetTokens");
    },

    async login({ dispatch, commit }, input) {
      try {
        commit("setLoading", { key: "login", value: true });
        const { user, token } = await HttpService.post("/login", input);
        dispatch("setUserToken", { token, user });
        commit("setLoading", { key: "login", value: false });
      } catch (e) {
        commit("setLoading", { key: "login", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },

    async register({ commit, dispatch }, input) {
      commit("setLoading", { key: "register", value: true });
      try {
        const { user, token } = await HttpService.post("/register", input);
        dispatch("setUserToken", { token, user });
        commit("setLoading", { key: "register", value: false });
      } catch (e) {
        commit("setLoading", { key: "register", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },

    async logout({ dispatch }) {
      await HttpService.post("/logout");
      dispatch("unsetTokens");
    },
  },

  mutations: {
    setUserToken(state, { token, user }) {
      state.token = token;
      state.user = user;
    },

    unsetTokens(state) {
      state.token = null;
      state.user = null;
    },

    setUser(state, user) {
      state.user = user;
    },

    setTokens(state, { user, token }) {
      state.token = token;
      state.user = user;
    },

    setLoading(state, { key, value }) {
      state.loading[key] = value;
    },
  },
};
