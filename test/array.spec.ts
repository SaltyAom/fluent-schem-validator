import S from 'fluent-json-schema'
import { validate } from './setup'

describe('Array Schema', () => {
    it('check type', () => {
        const schema = S.array()

        expect(validate([], schema)).toBe(true)
        expect(validate([1, 2, 3], schema)).toBe(true)
        expect(validate(['a', 1, true], schema)).toBe(true)
        expect(validate('not array', schema)).toBeInstanceOf(Error)
        expect(validate(new Set(), schema)).toBeInstanceOf(Error)
    })

    it('check single item type', () => {
        const schema = S.array().items(S.string())

        expect(validate([], schema)).toBe(true)
        expect(validate(['Hello'], schema)).toBe(true)
        expect(validate([false], schema)).toBeInstanceOf(Error)
        expect(validate(['Hello', false, 'Hello'], schema)).toBeInstanceOf(Error)
    })

    it('check multiple item types', () => {
        const schema = S.array().items([S.string(), S.boolean()])

        expect(validate(['Hello'], schema)).toBe(true)
        expect(validate([false], schema)).toBe(true)
        expect(validate(['Hello', false, 'Hello'], schema)).toBe(true)
        expect(validate([1], schema)).toBeInstanceOf(Error)
        expect(validate(['Hello', false, 1, true], schema)).toBeInstanceOf(
            Error
        )
    })

    it('check item types with logical properties', () => {
        const schema = S.array().items([
            S.string().minLength(4),
            S.number().minimum(10).maximum(20)
        ])

        expect(validate(['Hello'], schema)).toBe(true)
        expect(validate([15], schema)).toBe(true)
        expect(validate(['Hello', 15], schema)).toBe(true)
        expect(validate(['hai'], schema)).toBeInstanceOf(Error)
        expect(validate(['not', 'working'], schema)).toBeInstanceOf(Error)
        expect(validate([15, 8], schema)).toBeInstanceOf(Error)
        expect(validate(['hello', 'world', 15], schema)).toBe(true)
        expect(validate(['oh', 'no', 20], schema)).toBeInstanceOf(Error)
    })

    it('check min items', () => {
        const schema = S.array().minItems(2)

        expect(validate([], schema)).toBeInstanceOf(Error)
        expect(validate([1, 2], schema)).toBe(true)
        expect(validate([1, 2, 3], schema)).toBe(true)
        expect(validate([], schema)).toBeInstanceOf(Error)
    })

    it('check max items', () => {
        const schema = S.array().maxItems(2)

        expect(validate([1, 2], schema)).toBe(true)
        expect(validate([1], schema)).toBe(true)
        expect(validate([3, 2, 1], schema)).toBeInstanceOf(Error)
    })

    it('handle combination', () => {
        const schema = S.array()
            .items([
                S.string().minLength(4),
                S.number().minimum(10).maximum(20)
            ])
            .minItems(2)
            .maxItems(3)

        expect(validate([], schema)).toBeInstanceOf(Error)
        expect(validate(['Hello World', 18], schema)).toBe(true)
        expect(validate(['Hello', 'Pure', 'Imagination'], schema)).toBe(true)
        expect(validate(['GG', 11], schema)).toBeInstanceOf(Error)
        expect(validate(['Not', 18], schema)).toBeInstanceOf(Error)
        expect(
            validate(['Racing', 'into', 'the', 'Night'], schema)
        ).toBeInstanceOf(Error)
        expect(validate(['Casting', 'into', 0], schema)).toBeInstanceOf(Error)
    })
})
