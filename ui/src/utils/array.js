/**
 * Split array every n items into one array
 * @param sourceDataList ResourceData
 * @param splitNum       Split every N intoOneArray
 * @returns              After splitArray
 */
export function splitArray(sourceDataList, splitNum) {
    const count = sourceDataList.length % splitNum == 0
        ? sourceDataList.length / splitNum
        : sourceDataList.length / splitNum + 1;
    const arrayList = [];
    for (let i = 0; i < count; i++) {
        let index = i * splitNum;
        const list = [];
        let j = 0;
        while (j < splitNum && index < sourceDataList.length) {
            list.push(sourceDataList[index++]);
            j++;
        }
        arrayList.push(list);
    }
    return arrayList;
}
/*
Tree structure flattened
*/
export function TreeToFlatten(treeData) {
    return treeData.reduce((acc, node) => {
        const { children, ...rest } = node;
        return [...acc, rest, ...(children ? TreeToFlatten(children) : [])];
    }, []);
}
/*
  Filter out corresponding object from specified array
*/
export function relatedObject(list, val, attr) {
    const filterData = list.find((item) => item[attr] === val);
    return filterData || null;
}
// Sort
export function arraySort(list, property, desc) {
    return list.sort((a, b) => {
        return desc ? b[property] - a[property] : a[property] - b[property];
    });
}
// Determine if all properties in object are empty
export function isAllPropertiesEmpty(obj) {
    return Object.values(obj).every((value) => value === null || typeof value === 'undefined' || (typeof value === 'string' && !value));
}
// ArrayObjectA certain attribute inValueSet
export function getAttrsArray(array, attr) {
    return array.map((item) => {
        return item[attr];
    });
}
// Sum
export function getSum(array) {
    return array.reduce((total, item) => total + item, 0);
}
// ObjectArrayDeduplicate
export function uniqueArray(array, key) {
    const map = new Map();
    return array.filter((item) => {
        return !map.has(item[key]) && map.set(item[key], 1);
    });
}
