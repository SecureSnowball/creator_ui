<template>
  <section class="hero is-fullheight-with-navbar is-light">
    <div class="hero-body container">
      <div class="card p-5">
        <form method="POST" @submit.prevent="login">
          <h1 class="is-size-3 has-text-centered pb-5">Login</h1>

          <b-field
            label="Email *"
            :type="errors.email ? 'is-danger' : ''"
            :message="errors.email"
          >
            <b-input
              ref="loginEmail"
              type="email"
              v-model="form.email"
              maxlength="127"
              required
            ></b-input>
          </b-field>

          <b-field
            label="Password *"
            :type="errors.password ? 'is-danger' : ''"
            :message="errors.password"
          >
            <b-input
              v-model="form.password"
              type="password"
              maxlength="127"
              password-reveal
              required
            ></b-input>
          </b-field>

          <b-button
            :loading="loading.login"
            type="is-primary is-fullwidth"
            native-type="submit"
            >Login</b-button
          >
        </form>
        <b-button
          class="is-fullwidth mt-2"
          tag="router-link"
          to="/register"
          type="is-light"
        >
          Create an Account
        </b-button>
        <b-button
          class="is-fullwidth mt-2"
          tag="router-link"
          to="/forgot_password/request"
          type="is-ghost"
        >
          Forgot password?
        </b-button>
      </div>
    </div>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import ValidationException from "@/exceptions/ValidationException";

export default {
  name: "LoginPage",

  mounted() {
    if (this.$refs.loginEmail) this.$refs.loginEmail.focus();
  },

  data() {
    return {
      errors: {},
      form: {
        email: "",
        password: "",
      },
    };
  },

  methods: {
    ...mapActions("auth", {
      loginAction: "login",
    }),

    async login() {
      try {
        await this.loginAction({
          email: this.form.email,
          password: this.form.password,
        });
        this.$buefy.toast.open({
          message: "Login success!",
          type: "is-success",
          position: "is-bottom-right",
        });
        this.$router.push("/project");
      } catch (e) {
        let message = "Login failed";
        if (e instanceof ValidationException) {
          this.errors = e.errors;
          message = "Validation Error";
        }
        this.$buefy.toast.open({
          message,
          type: "is-danger",
          position: "is-bottom-right",
        });
      }
    },
  },

  computed: mapState("auth", {
    user: (state) => state.user,
    loading: (state) => state.loading,
  }),
};
</script>
