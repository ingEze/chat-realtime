export const {
    PORT = 3000,
    SALT_ROUNDS = 10
} = process.env

export const configMongo = {
    dbUri: 'mongodb://localhost:27017/flopiChat'
}