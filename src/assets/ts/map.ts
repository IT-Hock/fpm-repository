export class Map<K, V> {
    private keys: K[] = [];
    private values: V[] = [];

    public length(): number {
        return this.keys.length;
    }

    public set(key: K, value: V): void {
        let index = this.keys.indexOf(key);
        if (index === -1) {
            this.keys.push(key);
            this.values.push(value);
        } else {
            this.values[index] = value;
        }
    }

    public get(key: K): V | null {
        let index = this.keys.indexOf(key);
        if (index === -1) {
            return null;
        } else {
            return this.values[index];
        }
    }

    public has(key: K): boolean {
        return this.keys.indexOf(key) !== -1;
    }

    public remove(key: K): void {
        let index = this.keys.indexOf(key);
        if (index !== -1) {
            this.keys.splice(index, 1);
            this.values.splice(index, 1);
        }
    }

    public clear(): void {
        this.keys = [];
        this.values = [];
    }

    public size(): number {
        return this.keys.length;
    }

    public forEach(callback: (key: K, value: V) => void): void {
        for (let i = 0; i < this.keys.length; i++) {
            callback(this.keys[i], this.values[i]);
        }
    }

    public slice(start: number, end: number): Map<K, V> {
        let map = new Map<K, V>();
        for (let i = start; i < end; i++) {
            map.set(this.keys[i], this.values[i]);
        }
        return map;
    }

    public sort(callback: (a: V, b: V) => number): void {
        let sorted = this.values.sort(callback);
        this.values = [];
        this.keys = [];
    }
}