import HttpService from "@/services/http.service";
import ValidationException from "@/exceptions/ValidationException";

const resource = "project";
export default {
  namespaced: true,

  state: () => ({
    loading: {
      index: false,
      store: false,
      update: false,
      destroy: false,
      storeAsDraft: false,
      updateDraft: false,
      generateDraft: false,
      storeMultiple: false,
    },
    meta: {},
    items: [],
  }),

  getters: {},

  actions: {
    bootstrap({ state, commit }) {
      for (const key in state.loading) {
        commit("setLoading", { key: key, value: false });
      }
    },

    async index({ commit }, filter) {
      commit("setLoading", { key: "index", value: true });
      try {
        const { data: items, meta } = await HttpService.authGet(
          `/${resource}`,
          filter
        );
        commit("load", { items, meta });
        commit("setLoading", { key: "index", value: false });
      } catch (e) {
        commit("setLoading", { key: "index", value: false });
        console.error(e);
      }
    },

    async store({ commit }, input) {
      commit("setLoading", { key: "store", value: true });
      try {
        const item = await HttpService.authPost(`/${resource}`, input);
        commit("setLoading", { key: "store", value: false });
        commit("add", item);
      } catch (e) {
        commit("setLoading", { key: "store", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },

    async storeAsDraft({ commit }, input) {
      commit("setLoading", { key: "storeAsDraft", value: true });
      try {
        const item = await HttpService.authPost(`/draft/${resource}`, input);
        commit("setLoading", { key: "storeAsDraft", value: false });
        commit("add", item);
      } catch (e) {
        commit("setLoading", { key: "storeAsDraft", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },

    async updateDraft({ commit }, { id, input }) {
      commit("setLoading", { key: "updateDraft", value: true });
      try {
        const item = await HttpService.authPut(
          `/draft/${resource}/${id}`,
          input
        );
        commit("replace", { id, item });
        commit("setLoading", { key: "updateDraft", value: false });
      } catch (e) {
        commit("setLoading", { key: "updateDraft", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },

    async generateDraft({ commit }, { id, input }) {
      commit("setLoading", { key: "generateDraft", value: true });
      try {
        const item = await HttpService.authPost(
          `/draft/${resource}/${id}/generate`,
          input
        );
        commit("replace", { id, item });
        commit("setLoading", { key: "generateDraft", value: false });
      } catch (e) {
        commit("setLoading", { key: "generateDraft", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },

    async storeMultiple({ commit }, input) {
      commit("setLoading", { key: "storeMultiple", value: true });
      try {
        const items = await HttpService.authPost(
          `/${resource}/multiple`,
          input
        );
        commit("setLoading", { key: "storeMultiple", value: false });
        commit("addMultiple", items);
      } catch (e) {
        commit("setLoading", { key: "storeMultiple", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },

    async update({ commit }, { id, input }) {
      commit("setLoading", { key: "update", value: true });
      try {
        const item = await HttpService.authPut(`/${resource}/${id}`, input);
        commit("replace", { id, item });
        commit("setLoading", { key: "update", value: false });
      } catch (e) {
        commit("setLoading", { key: "update", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },

    async destroy({ commit }, id) {
      commit("setLoading", { key: "destroy", value: true });
      try {
        await HttpService.authDelete(`/${resource}/${id}`);
        commit("remove", id);
        commit("setLoading", { key: "destroy", value: false });
      } catch (e) {
        commit("setLoading", { key: "destroy", value: false });
        throw e;
      }
    },

    async generateSignedUrl(_, { id, type }) {
      return HttpService.authGet(`/${resource}/${id}/generate/${type}`);
    },

    async startHosting({ state, commit }, { id }) {
      const hostingResult = await HttpService.authPost(
        `/${resource}/${id}/hosting`
      );
      const item = state.items.find((i) => i.id === id);
      item.isHosted = true;
      commit("replace", { id, item });
      return hostingResult;
    },

    async stopHosting({ state, commit }, { id }) {
      const hostingResult = await HttpService.authDelete(
        `/${resource}/${id}/hosting`
      );
      const item = state.items.find((i) => i.id === id);
      item.isHosted = false;
      commit("replace", { id, item });
      return hostingResult;
    },
  },

  mutations: {
    load(state, { items, meta }) {
      state.meta = meta;
      state.items = items;
    },

    add(state, item) {
      state.items.push(item);
    },

    addMultiple(state, items) {
      state.items.push(...items);
    },

    remove(state, id) {
      const index = state.items.findIndex((t) => t.id === id);
      if (index !== -1) state.items.splice(index, 1);
    },

    replace(state, { id, item }) {
      const index = state.items.findIndex((t) => t.id === id);
      if (index !== -1) state.items.splice(index, 1, item);
    },

    setLoading(state, { key, value }) {
      state.loading[key] = value;
    },
  },
};
