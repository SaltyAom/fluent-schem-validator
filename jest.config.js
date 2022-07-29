module.exports = {
    transform: {
        '^.+\\.(t|j)s$': [
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
