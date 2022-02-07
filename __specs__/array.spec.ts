import S from 'fluent-json-schema'
import validate from '../dist'

describe('Array Schema', () => {
    it('check type', () => {
        const schema = S.array()

        expect(validate([], schema)).toBe(true)
        expect(validate([1, 2, 3], schema)).toBe(true)
        expect(validate(['a', 1, true], schema)).toBe(true)
        expect(validate('not array', schema)).toBe(false)
        expect(validate(new Set(), schema)).toBe(false)
    })

    it('check single item type', () => {
        const schema = S.array().items(S.string())

        expect(validate([], schema)).toBe(true)
        expect(validate(['Hello'], schema)).toBe(true)
        expect(validate([false], schema)).toBe(false)
        expect(validate(['Hello', false, 'Hello'], schema)).toBe(false)
    })

    it('check multiple item types', () => {
        const schema = S.array().items([S.string(), S.boolean()])

        expect(validate([], schema)).toBe(true)
        expect(validate(['Hello'], schema)).toBe(true)
        expect(validate([false], schema)).toBe(true)
        expect(validate(['Hello', false, 'Hello'], schema)).toBe(true)
        expect(validate([1], schema)).toBe(false)
        expect(validate(['Hello', false, 1, true], schema)).toBe(false)
    })

    it('check item types with logical properties', () => {
        const schema = S.array().items([
            S.string().minLength(4),
            S.number().minimum(10).maximum(20)
        ])

        expect(validate(['Hello'], schema)).toBe(true)
        expect(validate([15], schema)).toBe(true)
        expect(validate(['Hello', 15], schema)).toBe(true)
        expect(validate(['hai'], schema)).toBe(false)
        expect(validate(['not', 'working'], schema)).toBe(false)
        expect(validate([15, 8], schema)).toBe(false)
        expect(validate(['hello', 'world', 15], schema)).toBe(true)
        expect(validate(['oh', 'no', 20], schema)).toBe(false)
    })

    it('check min items', () => {
        const schema = S.array().minItems(2)

        expect(validate([], schema)).toBe(false)
        expect(validate([1, 2], schema)).toBe(true)
        expect(validate([1, 2, 3], schema)).toBe(true)
        expect(validate([], schema)).toBe(false)
    })

    it('check max items', () => {
        const schema = S.array().maxItems(2)

        expect(validate([1, 2], schema)).toBe(true)
        expect(validate([1], schema)).toBe(true)
        expect(validate([3, 2, 1], schema)).toBe(false)
    })

    it('handle combination', () => {
        const schema = S.array()
            .items([
                S.string().minLength(4),
                S.number().minimum(10).maximum(20)
            ])
            .minItems(2)
            .maxItems(3)

        expect(validate([], schema)).toBe(false)
        expect(validate(['Hello World', 18], schema)).toBe(true)
        expect(validate(['Hello', 'Pure', 'Imagination'], schema)).toBe(true)
        expect(validate(['GG', 11], schema)).toBe(false)
        expect(validate(['Not', 18], schema)).toBe(false)
        expect(validate(['Racing', 'into', 'the', 'Night'], schema)).toBe(false)
        expect(validate(['Casting', 'into', 0], schema)).toBe(false)
    })
})
