/**
 * Allowed slug characters:
 * - lowercase English letters a-z
 * - digits 0-9 and Arabic-Indic digits ٠-٩ (\u0660-\u0669)
 * - any Arabic script character (\p{Script=Arabic})
 * - hyphens
 */
/** OpenAPI/Swagger-safe pattern (no Unicode property escapes). Inline in @ApiProperty. */
export const BLOG_SLUG_PATTERN = '^[a-z0-9\u0660-\u0669\u0600-\u06FF-]+$';

/** Server-side slug validation. */
export const BLOG_SLUG_REGEX = /^[a-z0-9\u0660-\u0669\p{Script=Arabic}-]+$/u;

export interface JSONContent {
    type?: string;
    attrs?: Record<string, any>;
    content?: JSONContent[];
    marks?: { type: string; attrs?: Record<string, any>; [key: string]: any }[];
    text?: string;
    [key: string]: any;
}

export interface LocalePayload {
    pageTitle: string;
    pageDescription: string;
    keywords: string[];
    title: string;
    excerpt: string;
    content: JSONContent;
    featuredImage: string;
}
