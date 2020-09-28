export { daterangepicker } from './PluginDefinition';
export { ArrayUtils } from "./ArrayUtils"
export { DayjsIterator } from "./DayjsIterator"
export { DayjsUtil } from "./DayjsUtil"
export const getProperty = <T, K extends keyof T>(obj: T, key: K): T[K] => {
    return obj[key];
}

import "./knockout";