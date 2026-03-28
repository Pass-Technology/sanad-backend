/**
 * Recursively localizes an object or an array of objects by replacing 
 * fields ending in 'Ar' or 'En' with a base field name based on the language.
 * 
 * @param data The object or array to localize
 * @param lang The language code ('ar' or 'en')
 * @returns The localized data
 */
export function localize(data: any, lang: string = 'en'): any {
    if (!data || typeof data !== 'object' || data instanceof Date) {
        return data;
    }

    if (Array.isArray(data)) {
        return data.map((item) => localize(item, lang));
    }

    const result: any = {};
    const keys = Object.keys(data);

    // Track which base keys have been filled to avoid overriding or missing
    const localizedKeys = new Set<string>();

    for (const key of keys) {
        if (key.length > 2 && (key.endsWith('Ar') || key.endsWith('En'))) {
            const baseKey = key.slice(0, -2);
            const suffix = key.slice(-2).toLowerCase();

            if (suffix === lang.toLowerCase()) {
                result[baseKey] = localize(data[key], lang);
                localizedKeys.add(baseKey);
            }
        } else {
            // Recurse into nested objects/arrays for non-localized fields
            result[key] = localize(data[key], lang);
        }
    }

    return result;
}
