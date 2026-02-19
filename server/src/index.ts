import express from "express";

/// Declare and set up express application

const app = express()
const port = 3000

// Configure root endpoint for GET
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Apsis server listening on port ${port}`)
})
