import type { S, ObjectSchema } from 'fluent-json-schema'

type Formats =
    | 'relative-json-pointer'
    | 'json-pointer'
    | 'uuid'
    | 'regex'
    | 'ipv6'
    | 'ipv4'
    | 'hostname'
    | 'email'
    | 'url'
    | 'uri-template'
    | 'uri-reference'
    | 'uri'
    | 'time'
    | 'date'
    | 'date-time'

interface FluentBaseSchema {
    required?: string[]
    not?: FluentObjectSchema
    anyOf?: FluentObjectSchema[]
    oneOf?: FluentObjectSchema[]
    allOf?: FluentObjectSchema[]
}

interface FluentObjectSchema extends FluentBaseSchema {
    type: 'object'
    properties?: Record<string, FluentObjectSchema>
}

interface FluentStringSchema extends FluentBaseSchema {
    type: 'string'
    minLength?: number
    maxLength?: number
    format?: Formats
    pattern?: RegExp
}

interface FluentNumberSchema extends FluentBaseSchema {
    type: 'number'
    minimum?: number
    exclusiveMinimum?: number
    maximum?: number
    exclusiveMaximum?: number
    multipleOf?: number
}

interface FluentBooleanSchema extends FluentBaseSchema {
    type: 'boolean'
}

interface FluentArraySchema extends FluentBaseSchema {
    type: 'array'
    items?: FluentSchema | Array<FluentSchema>
    additionalItems?: Array<FluentSchema> | boolean
    contains?: FluentSchema | boolean
    uniqueItems?: boolean
    minItems?: number
    maxItems?: number
}

type FluentSchema =
    | FluentObjectSchema
    | FluentStringSchema
    | FluentNumberSchema
    | FluentBooleanSchema
    | FluentArraySchema

const eq = (a: unknown[], b: unknown[]) => {
    if (a.length !== b.length) return false

    for (let i = 0; i < a.length; ++i) if (!a.includes(b[i])) return false

    return true
}

const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

// https://stackoverflow.com/a/9221063
const hostnameRegex =
    /(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?)*\.?/
const ipv4Regex =
    /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/
const ipv6Regex =
    /(([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))/
// ---

// https://stackoverflow.com/a/11528450
const uriRegex =
    /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i

// https://stackoverflow.com/a/13653180
const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const validateString = (v: string, s: FluentStringSchema, label: string) => {
    if (s.minLength && v.length < s.minLength)
        throw new Error(
            `Expected ${label} to have minimum length of ${s.maxLength} found ${v.length}`
        )
    if (s.maxLength && v.length > s.maxLength)
        throw new Error(
            `Expected ${label} to have maximum length of ${s.maxLength} found ${v.length}`
        )

    switch (s.format) {
        case 'date':
        case 'date-time':
        case 'time':
            if (isNaN(Date.parse(v)))
                throw new Error(
                    `Expected ${label} to be ${s.format} found ${v}`
                )
            break

        case 'email':
            if (!emailRegex.test(v))
                throw new Error(
                    `Expected ${label} to be ${s.format} found ${v}`
                )
            break

        case 'hostname':
            if (!hostnameRegex.test(v))
                throw new Error(
                    `Expected ${label} to be ${s.format} found ${v}`
                )
            break

        case 'ipv4':
            if (!ipv4Regex.test(v))
                throw new Error(
                    `Expected ${label} to be ${s.format} found ${v}`
                )
            break

        case 'ipv6':
            if (!ipv6Regex.test(v))
                throw new Error(
                    `Expected ${label} to be ${s.format} found ${v}`
                )
            break

        case 'json-pointer':
        case 'relative-json-pointer':
            try {
                JSON.parse(v)
            } catch (e) {
                throw new Error(
                    `Expected ${label} to be ${s.format} found ${v}`
                )
            }
            break

        case 'regex':
            try {
                new RegExp(v)
            } catch (e) {
                throw new Error(
                    `Expected ${label} to be ${s.format} found ${v}`
                )
            }
            break

        case 'uri':
        case 'uri-reference':
        case 'uri-template':
        case 'url':
            if (!uriRegex.test(v))
                throw new Error(
                    `Expected ${label} to be ${s.format} found ${v}`
                )
            break

        case 'uuid':
            if (!uuidRegex.test(v))
                throw new Error(
                    `Expected ${label} to be ${s.format} found ${v}`
                )
            break

        default:
            break
    }

    if (s.pattern && !RegExp(s.pattern).test(v))
        throw new Error(`Expected ${label} to match ${s.pattern} found ${v}`)

    return true
}

const validateNumber = (v: number, s: FluentNumberSchema, label: string) => {
    if (s.minimum !== undefined && v < s.minimum)
        throw new Error(
            `Expected ${label} to have minimum of ${s.minimum} found ${v}`
        )
    if (s.exclusiveMinimum !== undefined && v <= s.exclusiveMinimum)
        throw new Error(
            `Expected ${label} to have exclusive minimum of ${s.exclusiveMinimum} found ${v}`
        )
    if (s.maximum !== undefined && v > s.maximum)
        throw new Error(
            `Expected ${label} to have maximum of ${s.maximum} found ${v}`
        )

    if (s.exclusiveMaximum !== undefined && v >= s.exclusiveMaximum)
        throw new Error(
            `Expected ${label} to have exclusive maximum of ${s.exclusiveMinimum} found ${v}`
        )

    if (s.multipleOf !== undefined && v % s.multipleOf !== 0)
        throw new Error(
            `Expected ${label} to be multipleOf ${s.exclusiveMinimum} found ${v}`
        )

    return true
}

const formatMultipleError = (
    type: string,
    {
        label,
        schema,
        invalid,
        value
    }: {
        label: string
        schema: Schema
        invalid?: FluentObjectSchema
        value: Object
    }
) =>
    new Error(
        `Expect ${label} to be ${type} \n${JSON.stringify(
            schema,
            null,
            2
        )},\nFound ${label} to be ${JSON.stringify(value, null, 2)}${
            !invalid ? '' : ` instead of ${JSON.stringify(invalid, null, 2)}`
        }`
    )

export type Schema = FluentSchema | ObjectSchema | Object

const validate = (
    value: any,
    s: Schema,
    label: string = 'value'
): boolean => {
    const isFluentSchema = 'isFluentSchema' in s
    if (!isFluentSchema && !('type' in s)) throw new Error('Invalid schema')

    const schema: FluentSchema = isFluentSchema
        ? (s.valueOf() as FluentSchema)
        : s

    if (schema.anyOf) {
        const valid = schema.anyOf.find((s, index) => {
            try {
                return validate(value, s, `${label}[${index}]`)
            } catch (err) {
                return false
            }
        })

        if (!valid)
            throw formatMultipleError('any of', {
                value,
                label,
                schema: schema.anyOf
            })

        return true
    }

    if (schema.oneOf) {
        const valid = schema.oneOf.find((s, index) => {
            try {
                return validate(value, s, `${label}[${index}]`)
            } catch (err) {
                return false
            }
        })

        if (!valid)
            throw formatMultipleError('one of', {
                value,
                label,
                schema: schema.oneOf
            })

        return true
    }

    if (schema.not) return !validate(value, schema.not)
    if (schema.allOf) {
        const invalid = schema.allOf.find((s, index) => {
            try {
                validate(value, s, `${label}[${index}]`)
            } catch (err) {
                return true
            }
        })

        if (invalid)
            throw formatMultipleError('all of', {
                value,
                invalid,
                label,
                schema: schema.allOf
            })

        return true
    }

    const isArray = schema.type === 'array'

    if (!isArray && schema.type !== 'object') {
        const type = typeof value
        if (type === 'object')
            throw new TypeError(
                `Expected ${label} not to be object, please report this bug`
            )

        if (schema.type !== type)
            throw new TypeError(
                `Expected ${label} to be ${schema.type} found ${type}`
            )

        if (schema.type === 'string')
            return validateString(value as string, schema, label)

        if (schema.type === 'number')
            return validateNumber(value as number, schema, label)

        return true
    }

    if (isArray) {
        if (!Array.isArray(value))
            throw new TypeError(
                `Expected ${label} to be array found ${typeof value}`
            )

        const items =
            typeof schema.items === 'undefined'
                ? []
                : !Array.isArray(schema.items)
                ? [schema.items]
                : schema.items

        if (schema.minItems && value.length < schema.minItems)
            throw new Error(
                `Expected ${label} minimum items to be ${schema.minItems} found ${value.length}`
            )
        if (schema.maxItems && value.length > schema.maxItems)
            throw new Error(
                `Expected ${label} maximum items to be ${schema.minItems} found ${value.length}`
            )

        if (schema.uniqueItems && new Set(items).size !== items.length)
            throw new Error(
                `Expected ${label} to be unique found ${Object.keys(items)}`
            )

        if (items.length === 0) return true
        if (value.length === 0) return true

        const valid = value.every((v) =>
            items.some((s, index) => {
                try {
                    return validate(v, s, `${label}[${index}]`)
                } catch (_) {
                    return false
                }
            })
        )

        if (!valid)
            throw formatMultipleError('items', {
                label,
                schema,
                value
            })

        return valid
    }

    if (typeof value !== 'object' || Array.isArray(value))
        throw new TypeError(
            `Expected ${label} not to be array, please report this bug`
        )

    if (!schema?.properties) return true

    const keys = Object.keys(schema.properties)
    const required = schema?.required ?? []
    const optionals = keys.filter((k) => !required.includes(k))

    const keysSchema = [...new Set(Object.keys(value).concat(optionals))]
    if (!eq(keys, keysSchema))
        throw new TypeError(
            `Expected every key of ${label} to be one of [${keys.join(
                ', '
            )}] found [${Object.keys(value).join(', ')}]`
        )

    return keys.every((key) => {
        const s: FluentObjectSchema = schema.properties![key]
        const child = (value as unknown as Record<string, any>)[key]

        const type = typeof child

        if (s.type === 'object') {
            if (type !== 'object')
                throw new TypeError(
                    `Expected ${label} to be object found ${type}`
                )

            return validate(child, s, `${label}.${key}`)
        }

        const isUndefined = type === 'undefined'

        if (key in required && isUndefined)
            throw new Error(`Expected ${label} not to be undefined`)
        if (isUndefined) return true
        if (!isUndefined && type !== s.type)
            throw new TypeError(
                `Expected ${label} to be ${s.type} found ${type}`
            )

        return validate(child, s, `${label}.${key}`)
    })
}

export default validate
