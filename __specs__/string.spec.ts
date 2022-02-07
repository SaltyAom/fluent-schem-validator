import S from 'fluent-json-schema'
import validate from '../dist'

describe('String Schema', () => {
    it('check type', () => {
        const schema = S.string()

        expect(validate('Hello World', schema)).toBe(true)
        expect(validate(1, schema)).toBe(false)
    })

    it('check min length', () => {
        const schema = S.string().minLength(2)

        expect(validate('Hai', schema)).toBe(true)
        expect(validate('a', schema)).toBe(false)
    })

    it('check max length', () => {
        const schema = S.string().maxLength(2)

        expect(validate('Hai', schema)).toBe(false)
        expect(validate('a', schema)).toBe(true)
    })

    it('check format', () => {
        const schema = S.string().format('email')

        expect(validate('me@example.com', schema)).toBe(true)
        expect(validate('notemail.com', schema)).toBe(false)
        expect(validate('ชื่อ@สวัสดี.คอม', schema)).toBe(true)
        expect(validate('contact@はじめよう.みんな', schema)).toBe(true)
    })

    it('check format', () => {
        const schema = S.string().format('email')

        expect(validate('me@example.com', schema)).toBe(true)
        expect(validate('notemail.com', schema)).toBe(false)
        expect(validate('ชื่อ@สวัสดี.คอม', schema)).toBe(true)
        expect(validate('contact@はじめよう.みんな', schema)).toBe(true)
    })

    it('check pattern', () => {
        const schema = S.string().pattern(/end$/)

        expect(validate('This is not the end', schema)).toBe(true)
        expect(validate('This is not the end, or is it?', schema)).toBe(false)
    })

    it('handle combination', () => {
        const schema = S.string().minLength(2).maxLength(4)

        expect(validate('fine', schema)).toBe(true)
        expect(validate('not fine', schema)).toBe(false)
    })
})
