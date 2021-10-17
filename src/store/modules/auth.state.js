import HttpService from "../../services/http.service";
import ValidationException from "../../exceptions/ValidationException";

export default {
  namespaced: true,

  state: () => ({
    loading: {
      login: false,
      logout: false,
      register: false,
      getAccount: false,
      verifyEmail: false,
      updateEmail: false,
      updateProfile: false,
      updateAccount: false,
      forgotPasswordVerify: false,
      forgotPasswordUpdate: false,
      forgotPasswordRequest: false,
      resendVerificationEmail: false,
    },
    token: undefined, // Authorization token
    user: undefined, // Logged in user basic profile
  }),

  actions: {
    setUserToken({ commit }, { user, token }) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      commit("setUserToken", { user, token });
    },

    /**
     * Update user keys
     */
    updateUser({ commit }, user) {
      commit("setUser", user);
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

    async forgotPasswordRequest({ commit }, input) {
      commit("setLoading", { key: "forgotPasswordRequest", value: true });
      try {
        const message = await HttpService.post(
          "/password/forget/request",
          input
        );
        commit("setLoading", { key: "forgotPasswordRequest", value: false });
        return message;
      } catch (e) {
        commit("setLoading", { key: "forgotPasswordRequest", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },

    async forgotPasswordVerify({ commit }, input) {
      commit("setLoading", { key: "forgotPasswordVerify", value: true });
      try {
        const message = await HttpService.post(
          "/password/forget/verify",
          input
        );
        commit("setLoading", { key: "forgotPasswordVerify", value: false });
        return message;
      } catch (e) {
        commit("setLoading", { key: "forgotPasswordVerify", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },

    async resendVerificationEmail({ commit }, input) {
      commit("setLoading", { key: "resendVerificationEmail", value: true });
      try {
        const message = await HttpService.authPost("/email/resend", input);
        commit("setLoading", { key: "resendVerificationEmail", value: false });
        return message;
      } catch (e) {
        commit("setLoading", { key: "resendVerificationEmail", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },

    async verifyEmail({ commit }, input) {
      commit("setLoading", { key: "verifyEmail", value: true });
      try {
        const message = await HttpService.post("/email/verify", input);
        commit("setLoading", { key: "verifyEmail", value: false });
        return message;
      } catch (e) {
        commit("setLoading", { key: "verifyEmail", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },

    async updateEmail({ commit }, input) {
      commit("setLoading", { key: "updateEmail", value: true });
      try {
        const message = await HttpService.post("/email/update", input);
        commit("setLoading", { key: "updateEmail", value: false });
        return message;
      } catch (e) {
        commit("setLoading", { key: "updateEmail", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },

    async forgotPasswordUpdate({ commit }, input) {
      commit("setLoading", { key: "forgotPasswordUpdate", value: true });
      try {
        const message = await HttpService.post(
          "/password/forget/update",
          input
        );
        commit("setLoading", { key: "forgotPasswordUpdate", value: false });
        return message;
      } catch (e) {
        commit("setLoading", { key: "forgotPasswordUpdate", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },

    async updateProfile({ commit, dispatch }, input) {
      commit("setLoading", { key: "updateProfile", value: true });
      try {
        const user = await HttpService.authPost("/profile", input);
        dispatch("updateUser", user);
        commit("setLoading", { key: "updateProfile", value: false });
      } catch (e) {
        commit("setLoading", { key: "updateProfile", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },

    /**
     * Get update email request
     */
    async getAccount({ commit }) {
      commit("setLoading", { key: "getAccount", value: true });
      try {
        const emailRequest = await HttpService.authGet("/profile/account");
        commit("setLoading", { key: "getAccount", value: false });
        return emailRequest;
      } catch (e) {
        commit("setLoading", { key: "getAccount", value: false });
        throw e;
      }
    },

    /**
     * Delete update email request
     */
    async deleteAccount({ commit }) {
      commit("setLoading", { key: "deleteAccount", value: true });
      try {
        await HttpService.authDelete("/profile/account");
        commit("setLoading", { key: "deleteAccount", value: false });
      } catch (e) {
        commit("setLoading", { key: "deleteAccount", value: false });
        throw e;
      }
    },

    async updateAccount({ commit }, input) {
      commit("setLoading", { key: "updateAccount", value: true });
      try {
        const message = await HttpService.authPost("/profile/account", input);
        commit("setLoading", { key: "updateAccount", value: false });
        return message;
      } catch (e) {
        commit("setLoading", { key: "updateAccount", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },

    async updatePassword({ commit }, input) {
      commit("setLoading", { key: "updatePassword", value: true });
      try {
        await HttpService.authPost("/profile/password", input);
        commit("setLoading", { key: "updatePassword", value: false });
      } catch (e) {
        commit("setLoading", { key: "updatePassword", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },

    async refreshUser({ dispatch }, input) {
      const user = await HttpService.authGet("/me", input);
      dispatch("updateUser", user);
    },

    async logout({ dispatch }) {
      try {
        await HttpService.authPost("/logout");
      } catch (e) {
        /***/
      }
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
