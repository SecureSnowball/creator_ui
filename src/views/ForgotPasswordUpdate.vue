<template>
  <section v-if="isTokenValid" class="hero is-fullheight-with-navbar is-light">
    <div class="hero-body container">
      <div class="card p-5">
        <form method="POST" @submit.prevent="forgotPasswordUpdate">
          <h1 class="is-size-3 has-text-centered pb-5">
            Forgot Password Request
          </h1>

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

          <b-field
            label="Confirm Password *"
            :type="errors.passwordConfirmation ? 'is-danger' : ''"
            :message="errors.passwordConfirmation"
          >
            <b-input
              v-model="form.passwordConfirmation"
              type="password"
              maxlength="127"
              password-reveal
              required
            ></b-input>
          </b-field>

          <b-button
            :loading="loading.forgotPasswordUpdate"
            type="is-primary is-fullwidth"
            native-type="submit"
            >Update Password</b-button
          >
        </form>
        <b-button
          class="is-fullwidth mt-2"
          tag="router-link"
          to="/login"
          type="is-light"
        >
          Back to Login?
        </b-button>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ValidationException from "@/exceptions/ValidationException";

export default {
  name: "ForgotPasswordUpdate",

  mounted() {
    const params = new URLSearchParams(window.location.search);
    this.form.email = params.get("email");
    this.form.token = params.get("token");
    this.forgotPasswordVerify();
  },

  data() {
    return {
      isTokenValid: false,
      errors: {},
      form: {
        email: "",
        token: "",
        password: "",
        passwordConfirmation: "",
      },
    };
  },

  methods: {
    ...mapActions("auth", {
      forgotPasswordVerifyAction: "forgotPasswordVerify",
      forgotPasswordUpdateAction: "forgotPasswordUpdate",
    }),

    async forgotPasswordVerify() {
      try {
        await this.forgotPasswordVerifyAction({
          token: this.form.token,
          email: this.form.email,
        });
        this.isTokenValid = true;
        if (this.$refs.emailInput) {
          this.$refs.emailInput.focus();
        }
      } catch (e) {
        console.error(e);
        let message = "Reset token not valid";
        if (e instanceof ValidationException) {
          this.errors = e.errors;
          message = "Validation Error";
        }
        this.$buefy.toast.open({
          message,
          type: "is-danger",
          position: "is-bottom-right",
          duration: 10000,
        });
      }
    },

    async forgotPasswordUpdate() {
      try {
        if (`${this.form.password}` !== `${this.form.passwordConfirmation}`) {
          return this.$buefy.toast.open({
            message: "Both password's don't match",
            type: "is-danger",
            position: "is-bottom-right",
          });
        }
        const message = await this.forgotPasswordUpdateAction({
          token: this.form.token,
          email: this.form.email,
          password: this.form.password,
          passwordConfirmation: this.form.passwordConfirmation,
        });
        this.$buefy.toast.open({
          message,
          type: "is-success",
          position: "is-bottom-right",
          duration: 20000,
        });
        this.$router.push("/login");
      } catch (e) {
        let message = "Unable to request password reset mail";
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
