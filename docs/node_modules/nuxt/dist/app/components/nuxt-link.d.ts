import type { DefineComponent } from 'vue';
import type { RouteLocationRaw, RouterLinkProps } from 'vue-router';
/**
 * `<NuxtLink>` is a drop-in replacement for both Vue Router's `<RouterLink>` component and HTML's `<a>` tag.
 * @see https://nuxt.com/docs/api/components/nuxt-link
 */
export interface NuxtLinkProps extends Omit<RouterLinkProps, 'to'> {
    /**
     * Route Location the link should navigate to when clicked on.
     */
    to?: RouteLocationRaw;
    /**
     * An alias for `to`. If used with `to`, `href` will be ignored
     */
    href?: NuxtLinkProps['to'];
    /**
     * Forces the link to be considered as external (true) or internal (false). This is helpful to handle edge-cases
     */
    external?: boolean;
    /**
     * Where to display the linked URL, as the name for a browsing context.
     */
    target?: '_blank' | '_parent' | '_self' | '_top' | (string & {}) | null;
    /**
     * A rel attribute value to apply on the link. Defaults to "noopener noreferrer" for external links.
     */
    rel?: 'noopener' | 'noreferrer' | 'nofollow' | 'sponsored' | 'ugc' | (string & {}) | null;
    /**
     * If set to true, no rel attribute will be added to the link
     */
    noRel?: boolean;
    /**
     * A class to apply to links that have been prefetched.
     */
    prefetchedClass?: string;
    /**
     * When enabled will prefetch middleware, layouts and payloads of links in the viewport.
     */
    prefetch?: boolean;
    /**
     * Allows controlling when to prefetch links. By default, prefetch is triggered only on visibility.
     */
    prefetchOn?: 'visibility' | 'interaction' | Partial<{
        visibility: boolean;
        interaction: boolean;
    }>;
    /**
     * Escape hatch to disable `prefetch` attribute.
     */
    noPrefetch?: boolean;
}
/**
 * Create a NuxtLink component with given options as defaults.
 * @see https://nuxt.com/docs/api/components/nuxt-link
 */
export interface NuxtLinkOptions extends Partial<Pick<RouterLinkProps, 'activeClass' | 'exactActiveClass'>>, Partial<Pick<NuxtLinkProps, 'prefetch' | 'prefetchedClass'>> {
    /**
     * The name of the component.
     * @default "NuxtLink"
     */
    componentName?: string;
    /**
     * A default `rel` attribute value applied on external links. Defaults to `"noopener noreferrer"`. Set it to `""` to disable.
     */
    externalRelAttribute?: string | null;
    /**
     * An option to either add or remove trailing slashes in the `href`.
     * If unset or not matching the valid values `append` or `remove`, it will be ignored.
     */
    trailingSlash?: 'append' | 'remove';
    /**
     * Allows controlling default setting for when to prefetch links. By default, prefetch is triggered only on visibility.
     */
    prefetchOn?: Exclude<NuxtLinkProps['prefetchOn'], string>;
}
export declare function defineNuxtLink(options: NuxtLinkOptions): DefineComponent<NuxtLinkProps>;
declare const _default: DefineComponent<NuxtLinkProps>;
export default _default;
