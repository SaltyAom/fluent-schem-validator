import S from 'fluent-json-schema'
import validate from '../src'

const schema = S.array().items([
    S.string().minLength(4),
    S.number().minimum(10).maximum(20)
])
