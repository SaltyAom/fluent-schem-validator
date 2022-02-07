module.exports = {
    transform: {
        '^.+\\.(test|spec).(t|j)s$': [
            '@swc/jest',
            {
                module: {
                    type: 'commonjs'
                },
                jsc: {
                    target: 'es2019',
                    externalHelpers: false
                }
            }
        ]
    }
}
