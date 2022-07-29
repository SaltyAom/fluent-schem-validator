import S from 'fluent-json-schema'
import validate from '../src'

describe('Number Schema', () => {
    it('check type', () => {
        const schema = S.number()

        expect(validate(1, schema)).toBe(true)
        expect(validate('Hello World', schema)).toBeInstanceOf(Error)
    })

    it('check minimum value', () => {
        const schema = S.number().minimum(2)

        expect(validate(3, schema)).toBe(true)
        expect(validate(1, schema)).toBeInstanceOf(Error)
    })

    it('check exclusive minimum value', () => {
        const schema = S.number().exclusiveMinimum(2)

        expect(validate(3, schema)).toBe(true)
        expect(validate(2, schema)).toBeInstanceOf(Error)
    })

    it('check maximum value', () => {
        const schema = S.number().maximum(2)

        expect(validate(2, schema)).toBe(true)
        expect(validate(3, schema)).toBeInstanceOf(Error)
    })

    it('check exclusive maximum value', () => {
        const schema = S.number().exclusiveMaximum(2)

        expect(validate(1, schema)).toBe(true)
        expect(validate(2, schema)).toBeInstanceOf(Error)
    })

    it('check multiple of', () => {
        const schema = S.number().multipleOf(5)

        expect(validate(25, schema)).toBe(true)
        expect(validate(24, schema)).toBeInstanceOf(Error)
    })

    it('handle falsey value', () => {
        const schema = S.number().minimum(0)

        expect(validate(0, schema)).toBe(true)
        expect(validate(-2, schema)).toBeInstanceOf(Error)
    })

    it('handle combination', () => {
        const schema = S.number().minimum(5).maximum(8)

        expect(validate(1, schema)).toBeInstanceOf(Error)
        expect(validate(6, schema)).toBe(true)
        expect(validate(9, schema)).toBeInstanceOf(Error)
    })
})
