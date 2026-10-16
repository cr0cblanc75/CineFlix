import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/", name: "home", component: Home },
        { path: "/lists", name: "lists", component: () => import("../views/Lists.vue") },
        { path: "/lists/:id", name: "library", component: () => import("../views/LibraryDetail.vue") },
        { path: "/movie/:slug", name: "movie", component: () => import("../views/MovieDetail.vue") },
        { path: "/:pathMatch(.*)*", redirect: { name: "home" } },
    ],
    scrollBehavior: () => ({ top: 0 }),
});

export default router;
