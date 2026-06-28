import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';

const MEANINGFUL_LEAF_TYPES = new Set([
    'image',
    'horizontalRule',
    'codeBlock',
    'blockquote',
    'table',
    'bulletList',
    'orderedList',
    'taskList',
]);

interface JSONNode {
    type?: string;
    text?: string;
    content?: unknown[];
}

function hasMeaningfulContent(node: unknown): boolean {
    if (!node || typeof node !== 'object') {
        return false;
    }

    const n = node as JSONNode;

    if (typeof n.text === 'string' && n.text.trim().length > 0) {
        return true;
    }

    if (typeof n.type === 'string' && MEANINGFUL_LEAF_TYPES.has(n.type)) {
        return true;
    }

    if (Array.isArray(n.content)) {
        return n.content.some(hasMeaningfulContent);
    }

    return false;
}

export function IsTipTapContent(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isTipTapContent',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: unknown) {
                    if (!value || typeof value !== 'object' || Array.isArray(value)) {
                        return false;
                    }

                    const doc = value as JSONNode;

                    if (doc.type !== 'doc') {
                        return false;
                    }

                    if (!Array.isArray(doc.content) || doc.content.length === 0) {
                        return false;
                    }

                    return doc.content.some(hasMeaningfulContent);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a non-empty TipTap document (type "doc" with real content)`;
                },
            },
        });
    };
}
