<template>
  <section class="mt-4">
    <div class="container">
      <div class="columns">
        <aside class="box column is-3 has-background-white">
          <p class="menu-label">General</p>
          <ul class="menu-list">
            <b-button
              tag="router-link"
              to="/setting/"
              :active="currentRouteName === 'SettingProfile'"
              :type="
                currentRouteName === 'SettingProfile'
                  ? 'is-primary'
                  : 'is-light'
              "
              icon-left="account"
            >
              Profile
            </b-button>
            <b-button
              tag="router-link"
              to="/setting/account"
              :active="currentRouteName === 'SettingAccount'"
              :type="
                currentRouteName === 'SettingAccount'
                  ? 'is-primary'
                  : 'is-light'
              "
              icon-left="email"
            >
              Account
            </b-button>
            <b-button
              tag="router-link"
              to="/setting/security"
              :active="currentRouteName === 'SettingSecurity'"
              :type="
                currentRouteName === 'SettingSecurity'
                  ? 'is-primary'
                  : 'is-light'
              "
              icon-left="lock"
            >
              Security
            </b-button>
          </ul>
        </aside>
        <div class="column box ml-2 is-9 has-background-white">
          <router-view />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },
};
</script>
