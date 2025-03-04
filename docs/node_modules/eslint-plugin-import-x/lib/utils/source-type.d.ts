import type { RuleContext } from '../types';
export default function sourceType(context: RuleContext): "module" | "commonjs" | "script" | undefined;
