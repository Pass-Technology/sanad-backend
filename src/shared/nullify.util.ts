export function nullify<T extends object>(obj: T): { [K in keyof T]: T[K] extends undefined ? null : T[K] } {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, value ?? null])
    ) as any;
}