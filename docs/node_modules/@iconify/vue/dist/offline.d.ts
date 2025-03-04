import type { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import type { DefineComponent } from 'vue';
import type { IconifyIcon } from '@iconify/types';
import type { IconifyJSON } from '@iconify/types';
import { IconifyTransformations } from '@iconify/types';
import { PublicProps } from 'vue';

/**
 * Add collection to storage, allowing to call icons by name
 *
 * @param data Icon set
 * @param prefix Optional prefix to add to icon names, true (default) if prefix from icon set should be used.
 */
export declare function addCollection(data: IconifyJSON, prefix?: string | boolean): void;

/**
 * Add icon to storage, allowing to call it by name
 *
 * @param name
 * @param data
 */
export declare function addIcon(name: string, data: IconifyIcon): void;

/**
 * Component
 */
export declare const Icon: DefineComponent<IconProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<IconProps> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, any>;

/**
 * Properties for element that are mentioned in render.ts
 */
declare interface IconifyElementProps {
    id?: string;
    style?: unknown;
}

export { IconifyIcon }

/**
 * Icon customisations
 */
export declare type IconifyIconCustomisations = IconifyIconCustomisations_2 & {
    rotate?: string | number;
    inline?: boolean;
};

/**
 * Icon customisations
 */
declare interface IconifyIconCustomisations_2 extends IconifyTransformations, IconifyIconSizeCustomisations {
}

/**
 * Customise callback
 */
declare type IconifyIconCustomiseCallback = (content: string, name: string, prefix: string, provider: string) => string;

/**
 * Callback for when icon has been loaded (only triggered for icons loaded from API)
 */
declare type IconifyIconOnLoad = (name: string) => void;

/**
 * Icon properties
 */
export declare interface IconifyIconProps extends IconifyIconCustomisations {
    icon: IconifyIcon | string;
    mode?: IconifyRenderMode;
    color?: string;
    flip?: string;
}

/**
 * Icon size
 */
export declare type IconifyIconSize = null | string | number;

/**
 * Dimensions
 */
declare interface IconifyIconSizeCustomisations {
    width?: IconifyIconSize;
    height?: IconifyIconSize;
}

export { IconifyJSON }

/**
 * Icon render mode
 *
 * 'style' = 'bg' or 'mask', depending on icon content
 * 'bg' = <span> with style using `background`
 * 'mask' = <span> with style using `mask`
 * 'svg' = <svg>
 */
export declare type IconifyRenderMode = 'style' | 'bg' | 'mask' | 'svg';

/**
 * Mix of icon properties and HTMLElement properties
 */
export declare interface IconProps extends IconifyElementProps, IconifyIconProps {
    /**
     * Try load icon on first render during SSR
     *
     * This is a low-level API for framework integrations, you don't usually need to use it directly.
     * Note this might hydration mismatches if the icon data is not handled correctly, use with caution.
     */
    ssr?: boolean;
    onLoad?: IconifyIconOnLoad;
    customise?: IconifyIconCustomiseCallback;
}

export { }
