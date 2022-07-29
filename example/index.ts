import S from 'fluent-json-schema'
import validate from '../src'

const schema = S.array()

console.log(validate("a", S.array()))
console.log("Cool")