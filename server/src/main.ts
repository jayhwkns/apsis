import express, { type Request } from "express";
import cowsay from "cowsay";
import { FeatureFlagAPIManager } from "./utils/feature-flags.ts";

/// Declare and set up express application

const app = express();
const routes = express.Router();
const port = 3000;

const featureFlagManager = new FeatureFlagAPIManager();

// Set up middleware
app.use((_, res, next) => {
  res.setHeader("content-type", "text/plain");
  next();
}, routes);

// Configure root endpoint for GET
app.get('/', async (req, res) => {
  const withCows = await featureFlagManager.getFlagEnabled("with-cows", req)
  if (withCows) {
    res.send(cowsay.say({ text: "Hello World!" }));
  } else {
    res.send('Hello World!');
  }
});

app.get('/api/feature-flags', async (req, res) => {
  const email = req.get("x-email");
  const organization = req.get("x-organization");

  const body = await featureFlagManager.getFeatureFlagsTableForUser(
    email, organization
  );

  res.send(body);
})

app.listen(port, () => {
  console.log(`Apsis server listening on port ${port}`);
});
