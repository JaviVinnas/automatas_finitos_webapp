export function removeFromArray<T>(array: T[], element: T): T[] {
    const index = array.indexOf(element);
    if (index >= 0) {
        array.splice(index, 1);
    }
    return array;
}

export function addIfNotPresent<T>(array: T[], element: T): T[] {
    if (!array.includes(element)) {
        array.push(element);
    }
    return array;
}