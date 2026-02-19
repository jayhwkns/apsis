import express from "express";
import cowsay from "cowsay";
import { OpenFeature, InMemoryProvider, type EvaluationContext } from "@openfeature/server-sdk";

/// Declare and set up express application

const app = express();
const routes = express.Router();
const port = 3000;

// Set up middleware
app.use((_, res, next) => {
  res.setHeader("content-type", "text/plain");
  next();
}, routes);

const featureFlags = OpenFeature.getClient();

// Set up an alias so we can easily identify request contexts
type RequestContext = any;

const FLAG_CONFIGURATION = {
  'with-cows': {
    variants: {
      on: true,
      off: false
    },
    disabled: false,
    defaultVariant: "on",
    contextEvaluator: (context: EvaluationContext) => {
      if (context.cow === "Bessie") {
        return "on";
      }
      return "off";
    }
  }
};

const featureFlagProvider = new InMemoryProvider(FLAG_CONFIGURATION);

OpenFeature.setProvider(featureFlagProvider);

// Configure root endpoint for GET
app.get('/', async (req, res) => {
  const context: EvaluationContext = {
    cow: req.get("x-cow") ?? ""
  };
  const withCows = await featureFlags.getBooleanValue('with-cows', false, context);
  if (withCows) {
    res.send(cowsay.say({ text: "Hello World!" }));
  } else {
    res.send('Hello World!');
  }
});

app.listen(port, () => {
  console.log(`Apsis server listening on port ${port}`);
});
