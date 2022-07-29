import S from 'fluent-json-schema'
import { validate } from './setup'

describe('String Schema', () => {
    it('check type', () => {
        const schema = S.string()

        expect(validate('Hello World', schema)).toBe(true)
        expect(validate(1, schema)).toBeInstanceOf(Error)
    })

    it('check min length', () => {
        const schema = S.string().minLength(2)

        expect(validate('Hai', schema)).toBe(true)
        expect(validate('a', schema)).toBeInstanceOf(Error)
    })

    it('check max length', () => {
        const schema = S.string().maxLength(2)

        expect(validate('Hai', schema)).toBeInstanceOf(Error)
        expect(validate('a', schema)).toBe(true)
    })

    it('check email', () => {
        const schema = S.string().format('email')

        expect(validate('me@example.com', schema)).toBe(true)
        expect(validate('notemail.com', schema)).toBeInstanceOf(Error)
        expect(validate('ชื่อ@สวัสดี.คอม', schema)).toBe(true)
        expect(validate('contact@はじめよう.みんな', schema)).toBe(true)
    })

    it('check date', () => {
        const schema = S.string().format('date-time')

        expect(validate('26 October 2022', schema)).toBe(true)
        expect(validate('32 April 2001', schema)).toBeInstanceOf(Error)
    })

    it('check hostname', () => {
        const schema = S.string().format('hostname')

        expect(validate('https://api.hifumin.app', schema)).toBe(true)
    })

    it('check pattern', () => {
        const schema = S.string().pattern(/end$/)

        expect(validate('This is not the end', schema)).toBe(true)
        expect(
            validate('This is not the end, or is it?', schema)
        ).toBeInstanceOf(Error)
    })

    it('handle combination', () => {
        const schema = S.string().minLength(2).maxLength(4)

        expect(validate('fine', schema)).toBe(true)
        expect(validate('not fine', schema)).toBeInstanceOf(Error)
    })
})
