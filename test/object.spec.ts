import S from 'fluent-json-schema'
import { validate } from './setup'

describe('Object Schema', () => {
    it('check type', () => {
        const schema = S.object()

        expect(validate({}, schema)).toBe(true)
        expect(
            validate(
                {
                    hi: 'Hello'
                },
                schema
            )
        ).toBe(true)
        expect(validate('Ok', schema)).toBeInstanceOf(Error)
        expect(validate(false, schema)).toBeInstanceOf(Error)
        expect(validate([], schema)).toBeInstanceOf(Error)
        // Set is an object
        expect(validate(new Set(), schema)).toBe(true)
    })

    it('check properties', () => {
        const schema = S.object()
            .prop('name', S.string())
            .prop('age', S.number())

        expect(
            validate(
                {
                    name: '',
                    age: 0
                },
                schema
            )
        ).toBe(true)

        // Partial is fine because it's not required
        expect(
            validate(
                {
                    name: ''
                },
                schema
            )
        ).toBe(true)

        expect(
            validate(
                {
                    name: '',
                    age: ''
                },
                schema
            )
        ).toBeInstanceOf(Error)

        expect(
            validate(
                {
                    name: '',
                    age: 0,
                    'not-exist': 'not ok'
                },
                schema
            )
        ).toBeInstanceOf(Error)
    })

    it('check required property', () => {
        const schema = S.object()
            .prop('name', S.string().required())
            .prop('age', S.number())

        expect(
            validate(
                {
                    name: 'hi',
                    age: 0
                },
                schema
            )
        ).toBe(true)

        expect(
            validate(
                {
                    age: 0
                },
                schema
            )
        ).toBeInstanceOf(Error)
    })

    it('check nested object property', () => {
        const schema = S.object()
            .prop('name', S.string().required())
            .prop('age', S.number())
            .prop(
                'address',
                S.object()
                    .prop('city', S.string().required())
                    .prop('road', S.string())
            )

        expect(
            validate(
                {
                    name: 'hi',
                    age: 0,
                    address: {
                        city: ''
                    }
                },
                schema
            )
        ).toBe(true)

        expect(
            validate(
                {
                    name: 'hi',
                    age: 0,
                    address: {
                        road: ''
                    }
                },
                schema
            )
        ).toBeInstanceOf(Error)

        // Sub schema is required
        expect(
            validate(
                {
                    name: 'hi',
                    age: 0
                },
                schema
            )
        ).toBeInstanceOf(Error)
    })

    it('handle oneOf/anyOf', () => {
        const logic = [
            S.object()
                .prop('name', S.string().required())
                .prop('age', S.number()),
            S.object()
                .prop('name', S.string().required())
                .prop('age', S.number())
                .prop(
                    'address',
                    S.object()
                        .prop('city', S.string().required())
                        .prop('road', S.string())
                )
        ]
        const anyOfSchema = S.anyOf(logic)
        const oneOfSchema = S.oneOf(logic)

        expect(
            validate(
                {
                    name: 'hi',
                    age: 0,
                    address: {
                        city: ''
                    }
                },
                anyOfSchema
            )
        ).toBe(true)

        expect(
            validate(
                {
                    name: 'hi',
                    age: 0
                },
                anyOfSchema
            )
        ).toBe(true)

        expect(
            validate(
                {
                    name: 'hi',
                    age: 0,
                    address: {
                        road: ''
                    }
                },
                anyOfSchema
            )
        ).toBeInstanceOf(Error)

        expect(
            validate(
                {
                    name: 'hi',
                    age: 0,
                    address: {
                        road: ''
                    }
                },
                oneOfSchema
            )
        ).toBeInstanceOf(Error)
    })

    it('handle allOf', () => {
        const schema = S.allOf([
            S.object()
                .prop('username', S.string().required())
                .prop('password', S.string())
                .prop('email', S.string()),
            S.object()
                .prop('username', S.string())
                .prop('password', S.string().required())
                .prop('email', S.string())
        ])

        expect(
            validate(
                {
                    username: 'saltyaom',
                    password: '12345678',
                    email: 'me@example.com'
                },
                schema
            )
        ).toBe(true)

        expect(
            validate(
                {
                    username: 'saltyaom',
                    password: '12345678'
                },
                schema
            )
        ).toBe(true)

        expect(
            validate(
                {
                    username: 'saltyaom'
                },
                schema
            )
        ).toBeInstanceOf(Error)

        expect(
            validate(
                {
                    username: 'saltyaom',
                    'not-in-field': ''
                },
                schema
            )
        ).toBeInstanceOf(Error)
    })

    it('handle combination', () => {
        const schema = S.object()
            .prop('username', S.string().required().minLength(3).maxLength(25))
            .prop('password', S.string().required().minLength(8).maxLength(96))
            .prop(
                'profile',
                S.object()
                    .prop(
                        'name',
                        S.string().required().minLength(3).maxLength(50)
                    )
                    .prop(
                        'email',
                        S.string().required().format('email').maxLength(128)
                    )
                    .prop('bio', S.string().maxLength(180))
            )

        expect(
            validate(
                {
                    username: 'saltyaom',
                    password: '12345678',
                    profile: {
                        name: 'Salty Aom',
                        email: 'contact@saltyaom.com',
                        bio: 'I like train'
                    }
                },
                schema
            )
        ).toBe(true)

        expect(
            validate(
                {
                    username: 'saltyaom',
                    password: '12345678',
                    profile: {
                        name: 'Salty Aom',
                        email: 'contact@saltyaom.com'
                    }
                },
                schema
            )
        ).toBe(true)

        expect(
            validate(
                {
                    username: 'saltyaom',
                    password: '12345678'
                },
                schema
            )
        ).toBeInstanceOf(Error)

        expect(
            validate(
                {
                    username: 'saltyaom',
                    password: '12345678',
                    profile: {
                        name: 'Salty Aom',
                        bio: 'I like train'
                    }
                },
                schema
            )
        ).toBeInstanceOf(Error)

        expect(
            validate(
                {
                    username: 'saltyaom',
                    password: '12345678'
                },
                schema
            )
        ).toBeInstanceOf(Error)

        expect(
            validate(
                {
                    username: 'saltyaom',
                    profile: {
                        name: 'Salty Aom',
                        bio: 'I like train'
                    }
                },
                schema
            )
        ).toBeInstanceOf(Error)

        expect(
            validate(
                {
                    username: 'saltyaom',
                    password: '12345678',
                    profile: {
                        name: 'Salty Aom',
                        bio: 1
                    }
                },
                schema
            )
        ).toBeInstanceOf(Error)

        expect(
            validate(
                {
                    username: 'saltyaom',
                    password: '12345678',
                    profile: {
                        name: 'Salty Aom',
                        bio: 1,
                        'not-existed': true
                    }
                },
                schema
            )
        ).toBeInstanceOf(Error)
    })
})
