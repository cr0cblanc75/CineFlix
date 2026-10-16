/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_OMDB_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<object, object, unknown>;
    export default component;
}

declare module "*.svg?component" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent;
    export default component;
}
