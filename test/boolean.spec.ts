import S from 'fluent-json-schema'
import validate from '../src'

describe('Boolean Schema', () => {
    it('check type', () => {
        const schema = S.boolean()

        expect(validate(true, schema)).toBe(true)
        expect(validate('Hello World', schema)).toBeInstanceOf(Error)
    })
})
