export default class Filtering<T> {
    filter(filterValue: string): Promise<T[]> {
        throw new Error("Method not implemented: " + filterValue);
    }
}