import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/forgot_password/request",
    name: "Forgot Password Request",
    component: () => import("../views/ForgotPasswordRequest.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/forgot_password/verify",
    name: "Forgot Password Verify",
    component: () => import("../views/ForgotPasswordUpdate.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/project",
    name: "ProjectIndex",
    component: () => import("../views/ProjectIndex.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/project/create",
    name: "ProjectCreate",
    component: () => import("../views/ProjectCreate.vue"),
    meta: {
      auth: true,
    },
  },
];
// RoutesEnd

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta) {
    return next();
  }

  const { meta } = to;
  if (meta.guest) {
    if (store.state.auth.token) {
      return next({
        name: "Dashboard",
      });
    }
  }

  // if (meta.auth) {
  //   if (!store.state.auth.token) {
  //     return next({
  //       name: 'Login',
  //     });
  //   }
  // }

  return next();
});

export default router;
