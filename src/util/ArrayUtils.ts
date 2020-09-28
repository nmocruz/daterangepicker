export class ArrayUtils {
    constructor() { }

    static rotateArray(array: Array<any>, offset: number): Array<any> {
        offset = offset % array.length;
        return array.slice(offset).concat(array.slice(0, offset));
    }

    static uniqArray(array: Array<any>): Array<any> {
        var i, l, len, newArray;
        newArray = [];
        for (l = 0, len = array.length; l < len; l++) {
            i = array[l];
            if (newArray.indexOf(i) === -1) {
                newArray.push(i);
            }
        }
        return newArray;
    }
}