import { createJiti } from 'jiti';

async function loadKit(rootDir) {
  const jiti = createJiti(rootDir);
  try {
    const localKit = jiti.esmResolve("@nuxt/kit", { try: true });
    const rootURL = localKit ? rootDir : await tryResolveNuxt(rootDir) || rootDir;
    let kit = await jiti.import("@nuxt/kit", { parentURL: rootURL });
    if (!kit.writeTypes) {
      kit = {
        ...kit,
        writeTypes: () => {
          throw new Error("`writeTypes` is not available in this version of `@nuxt/kit`. Please upgrade to v3.7 or newer.");
        }
      };
    }
    return kit;
  } catch (e) {
    if (e.toString().includes("Cannot find module '@nuxt/kit'")) {
      throw new Error(
        "nuxi requires `@nuxt/kit` to be installed in your project. Try installing `nuxt` v3 or `@nuxt/bridge` first."
      );
    }
    throw e;
  }
}
async function tryResolveNuxt(rootDir) {
  const jiti = createJiti(rootDir);
  for (const pkg of ["nuxt-nightly", "nuxt", "nuxt3", "nuxt-edge"]) {
    const path = jiti.esmResolve(pkg, { try: true });
    if (path) {
      return path;
    }
  }
  return null;
}

export { loadKit as l, tryResolveNuxt as t };
