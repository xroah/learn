const express = require("express")
const app = express()

const { graphql, buildSchema } = require('graphql')
const schema = buildSchema(`
  type Query {
    hello: String
  }
`)
const root = { hello: () => 'Hello world!' }

app.use("/graphql", (_, res) => {
    graphql(schema, '{ hello }', root).then(response => {
        res.json(response)
    })
});

app.use((_, res) => {
    res.end("Hello world")
});

app.listen(5000)