import v, { type Schema } from '../src'

export const validate = (a: any, b: Schema) => {
    try {
        return v(a, b)
    } catch (err) {
        return err
    }
}
