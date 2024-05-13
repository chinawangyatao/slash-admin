import { chain } from 'ramda';

/**
 * 展平包含树结构的数组
 * @param {T[]} trees -包含树结构的数组
 * @returns {T[]} - 扁平阵列
 */
export function flattenTrees<T extends { children?: T[] }>(trees: T[] = []): T[] {
  return chain((node) => {
    const children = node.children || [];
    return [node, ...flattenTrees(children)];
  }, trees);
}
