export function equals<T>(setA: Set<T>, setB: Set<T> ) : boolean {
    if (setA.size !== setB.size) return false;
    for (var a of setA) if (!setB.has(a)) return false;
    return true;
}