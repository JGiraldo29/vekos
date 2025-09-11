import { getCurrentScope, onScopeDispose, ref } from "vue";
import { injectHead } from "@unhead/vue";
import { useNuxtApp } from "#app";
function createRouteAnnouncer(opts = {}) {
  const message = ref("");
  const politeness = ref(opts.politeness || "polite");
  const activeHead = injectHead();
  function set(messageValue = "", politenessSetting = "polite") {
    message.value = messageValue;
    politeness.value = politenessSetting;
  }
  function polite(message2) {
    return set(message2, "polite");
  }
  function assertive(message2) {
    return set(message2, "assertive");
  }
  function _updateMessageWithPageHeading() {
    set(document?.title?.trim(), politeness.value);
  }
  function _cleanup() {
    activeHead?.hooks?.removeHook("dom:rendered", _updateMessageWithPageHeading);
  }
  _updateMessageWithPageHeading();
  activeHead?.hooks?.hook("dom:rendered", () => {
    _updateMessageWithPageHeading();
  });
  return {
    _cleanup,
    message,
    politeness,
    set,
    polite,
    assertive
  };
}
export function useRouteAnnouncer(opts = {}) {
  const nuxtApp = useNuxtApp();
  const announcer = nuxtApp._routeAnnouncer = nuxtApp._routeAnnouncer || createRouteAnnouncer(opts);
  if (opts.politeness !== announcer.politeness.value) {
    announcer.politeness.value = opts.politeness || "polite";
  }
  if (import.meta.client && getCurrentScope()) {
    nuxtApp._routeAnnouncerDeps = nuxtApp._routeAnnouncerDeps || 0;
    nuxtApp._routeAnnouncerDeps++;
    onScopeDispose(() => {
      nuxtApp._routeAnnouncerDeps--;
      if (nuxtApp._routeAnnouncerDeps === 0) {
        announcer._cleanup();
        delete nuxtApp._routeAnnouncer;
      }
    });
  }
  return announcer;
}
