<template>
  <section>
    <h1 class="is-size-5">Security Setting</h1>
    <hr class="my-2" />
    <form method="POST" @submit.prevent="updatePassword">
      <b-field
        label="Old Password *"
        :type="errors.oldPassword ? 'is-danger' : ''"
        :message="
          errors.oldPassword ||
          'You will be logged out in all other devices when you change password'
        "
      >
        <b-input
          v-model="form.oldPassword"
          ref="accountSettingOldPassword"
          maxlength="72"
          minlength="8"
          type="password"
          password-reveal
          required
        ></b-input>
      </b-field>
      <b-field
        label="New Password *"
        :type="errors.newPassword ? 'is-danger' : ''"
        :message="errors.newPassword"
      >
        <b-input
          v-model="form.newPassword"
          maxlength="72"
          minlength="8"
          type="password"
          password-reveal
          required
        ></b-input>
      </b-field>

      <b-field label="Repeat Password *">
        <b-input
          v-model="form.newPasswordConfirmation"
          maxlength="72"
          minlength="8"
          type="password"
          password-reveal
          required
        ></b-input>
      </b-field>
      <b-button
        :loading="loading.updatePassword"
        type="is-primary is-fullwidth"
        native-type="submit"
        >Update Account</b-button
      >
    </form>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";
import ValidationException from "@/exceptions/ValidationException";

export default {
  name: "SecuritySettingPage",

  mounted() {
    if (this.$refs.accountSettingOldPassword)
      this.$refs.accountSettingOldPassword.focus();
  },

  data() {
    return {
      errors: {},
      form: {
        oldPassword: "",
        newPassword: "",
        newPasswordConfirmation: "",
      },
    };
  },

  methods: {
    ...mapActions("auth", {
      updatePasswordAction: "updatePassword",
    }),
    async updatePassword() {
      try {
        if (
          `${this.form.newPassword}` !== `${this.form.newPasswordConfirmation}`
        ) {
          return this.$buefy.toast.open({
            message: "Both password's don't match",
            type: "is-danger",
            position: "is-bottom-right",
          });
        }
        await this.updatePasswordAction({
          oldPassword: this.form.oldPassword,
          newPassword: this.form.newPassword,
          newPasswordConfirmation: this.form.newPasswordConfirmation,
        });
        this.$buefy.toast.open({
          message: "Password updated successfully!",
          type: "is-success",
          position: "is-bottom-right",
        });
      } catch (e) {
        let message = "Unable to update password";
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

  computed: {
    ...mapState("auth", {
      loading: (state) => state.loading,
    }),
  },
};
</script>
