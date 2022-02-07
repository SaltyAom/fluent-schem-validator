import S from 'fluent-json-schema'
import validate from '../dist'

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
        expect(validate('Ok', schema)).toBe(false)
        expect(validate(false, schema)).toBe(false)
        expect(validate([], schema)).toBe(false)
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
        ).toBe(false)

        expect(
            validate(
                {
                    name: '',
                    age: 0,
                    'not-exist': 'not ok'
                },
                schema
            )
        ).toBe(false)
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
        ).toBe(false)
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
        ).toBe(false)

        // Sub schema is required
        expect(
            validate(
                {
                    name: 'hi',
                    age: 0
                },
                schema
            )
        ).toBe(false)
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
        const schema = S.anyOf(logic)
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
                schema
            )
        ).toBe(true)

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
                    name: 'hi',
                    age: 0,
                    address: {
                        road: ''
                    }
                },
                schema
            )
        ).toBe(false)

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
        ).toBe(false)
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
        ).toBe(false)

        expect(
            validate(
                {
                    username: 'saltyaom',
                    'not-in-field': ''
                },
                schema
            )
        ).toBe(false)
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
        ).toBe(false)

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
        ).toBe(false)

        expect(
            validate(
                {
                    username: 'saltyaom',
                    password: '12345678'
                },
                schema
            )
        ).toBe(false)

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
        ).toBe(false)

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
        ).toBe(false)

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
        ).toBe(false)
    })
})
