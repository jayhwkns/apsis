import express from "express";
import cowsay from "cowsay";
import cors from "cors";
import { FeatureFlagAPIManager } from "@/utils/featureFlags.ts";
import { ApodScraper } from "@/utils/apodScraper.ts";
import { ApodCache } from "./utils/apodCache.ts";

/// Declare and set up express application

const app = express();
const routes = express.Router();
// React takes 3000 by default
const port = 3070;

const featureFlagManager = new FeatureFlagAPIManager();
const apodScraper = new ApodScraper({ copyrightRestrict: false });
const apodCache = new ApodCache({ cacheDir: "./cache" });
apodCache.initCache();

app.use(cors())

// For parsing application/json
app.use(express.json());

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

app.get('/api/feature-enabled/:flagId', async (req, res) => {
  const flagId = req.params["flagId"];
  const enabled = await featureFlagManager.getFlagEnabled(flagId, req);
  res.send({ flagEnabled: enabled });
})

app.get('/api/feature-flag-table', async (req, res) => {
  const email = req.get("x-email");
  const organization = req.get("x-organization");

  const body = await featureFlagManager.getFeatureFlagsTableForUser(
    email, organization
  );

  res.send(body);
})

app.get("/api/apod/today", async (_, res) => {
  var apodMd;
  const today = new Date();
  if (apodCache.has(today)) {
    apodMd = await apodCache.getApod(today)
  } else {
    const apodObj = await apodScraper.today();
    apodMd = await apodCache.writeApod(apodObj);
  }
  res.send(apodMd);
})

app.post("/api/apod", async (req, res) => {
  const date = new Date(req.body.date);
  var apodMd;
  if (apodCache.has(date)) {
    apodMd = await apodCache.getApod(date)
  } else {
    const apodObj = await apodScraper.fromDay(date);
    apodMd = await apodCache.writeApod(apodObj);
  }
  res.send(apodMd);
})

app.listen(port, () => {
  console.log(`Apsis server listening on port ${port}`);
});
