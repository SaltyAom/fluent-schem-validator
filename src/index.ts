import type { ObjectSchema } from 'fluent-json-schema'

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

    for (var i = 0; i < a.length; ++i) if (!a.includes(b[i])) return false

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

const validateString = (v: string, s: FluentStringSchema) => {
    if (s.minLength && v.length < s.minLength) return false
    if (s.maxLength && v.length > s.maxLength) return false

    switch (s.format) {
        case 'date':
        case 'date-time':
        case 'time':
            if (isNaN(Date.parse(v))) return false
            break

        case 'email':
            if (!emailRegex.test(v)) return false
            break

        case 'hostname':
            if (!hostnameRegex.test(v)) return false
            break

        case 'ipv4':
            if (!ipv4Regex.test(v)) return false
            break

        case 'ipv6':
            if (!ipv6Regex.test(v)) return false
            break

        case 'json-pointer':
        case 'relative-json-pointer':
            try {
                JSON.parse(v)
            } catch (e) {
                return false
            }
            break

        case 'regex':
            try {
                new RegExp(v)
            } catch (e) {
                return false
            }
            break

        case 'uri':
        case 'uri-reference':
        case 'uri-template':
        case 'url':
            if (!uriRegex.test(v)) return false
            break

        case 'uuid':
            if (!uuidRegex.test(v)) return false
            break

        default:
            break
    }

    if (s.pattern && !RegExp(s.pattern).test(v)) return false

    return true
}

const validateNumber = (v: number, s: FluentNumberSchema) => {
    if (s.minimum && v < s.minimum) return false
    if (s.exclusiveMinimum && v <= s.exclusiveMinimum) return false
    if (s.maximum && v > s.maximum) return false
    if (s.exclusiveMaximum && v >= s.exclusiveMaximum) return false
    if (s.multipleOf && v % s.multipleOf !== 0) return false

    return true
}

const validate = (
    model: string | number | boolean | Array<any> | Record<string, any>,
    s: FluentSchema | ObjectSchema | Object
): boolean => {
    const isFluentSchema = 'isFluentSchema' in s
    if (!isFluentSchema && !('type' in s)) throw new Error('Invalid schema')

    const schema: FluentSchema = isFluentSchema
        ? (s.valueOf() as FluentSchema)
        : s

    if (schema.anyOf) return schema.anyOf.some((s) => validate(model, s))
    if (schema.oneOf) return schema.oneOf.some((s) => validate(model, s))
    if (schema.not) return !validate(model, schema.not)
    if (schema.allOf) return schema.allOf.every((s) => validate(model, s))

    const isArray = schema.type === 'array'

    if (!isArray && schema.type !== 'object') {
        const type = typeof model
        if (type === 'object') return false
        if (schema.type !== type) return false

        if (schema.type === 'string')
            return validateString(model as string, schema)

        if (schema.type === 'number')
            return validateNumber(model as number, schema)

        return true
    }

    if (isArray) {
        if (!Array.isArray(model)) return false

        const items =
            typeof schema.items === 'undefined'
                ? []
                : !Array.isArray(schema.items)
                ? [schema.items]
                : schema.items

        if (schema.minItems && model.length < schema.minItems) return false
        if (schema.maxItems && model.length > schema.maxItems) return false
        if (schema.uniqueItems && new Set(items).size !== items.length)
            return false

        if (items.length === 0) return true
        if (model.length === 0) return true

        return model.every((v) => items.some((s) => validate(v, s)))
    }

    if (typeof model !== 'object' || Array.isArray(model)) return false
    if (!schema?.properties) return true

    const keys = Object.keys(schema.properties)
    const required = schema?.required ?? []
    const optionals = keys.filter((k) => !required.includes(k))

    if (!eq(keys, [...new Set(Object.keys(model).concat(optionals))]))
        return false

    return keys.every((key) => {
        const s: FluentObjectSchema = schema.properties![key]
        const value = (model as unknown as Record<string, any>)[key]

        const type = typeof value

        if (s.type === 'object') {
            if (type !== 'object') return false

            return validate(value, s)
        }

        const isUndefined = type === 'undefined'

        if (key in required && isUndefined) return false
        if (isUndefined) return true
        if (!isUndefined && type !== s.type) return false

        return validate(value, s)
    })
}

export default validate
