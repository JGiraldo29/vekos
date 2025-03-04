import { JitiOptions } from 'jiti';
import { S as Schema } from '../shared/untyped.kR35CG5k.js';

interface LoaderOptions {
    jiti?: JitiOptions;
    defaults?: Record<string, any>;
    ignoreDefaults?: boolean;
}
declare function loadSchema(entryPath: string, options?: LoaderOptions): Promise<Schema>;

export { type LoaderOptions, loadSchema };
