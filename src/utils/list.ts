export const asyncForEach = async (array: any[], callback: (arg0: any) => void) => {
    for (let i = 0; i < array.length; i++ ) {
        await callback(array[i]);
    }
};

export const filterMapValues = <K, V>(map: Map<K, V>, callback: (value: V) => boolean): V[] => {
    const filteredValues: V[] = [];
    map.forEach((value: V) => {
        if (callback(value)) {
            filteredValues.push(value);
        }
    })
    return filteredValues;
};

export const anyMapValues = <K, V>(map: Map<K, V>, callback: (value: V) => boolean): boolean => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [key, value] of map) {
        if (callback(value)) {
            return true;
        }
    }
    return false;
};