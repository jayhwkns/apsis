import { OpenFeature, InMemoryProvider, type EvaluationContext, type Client, type Provider } from "@openfeature/server-sdk";
import type { Request } from "express";

// Strict interface for OpenFeature configuration
// A type similar to this might exist elsewhere, but I couldn't find it so I'm
// making my own.
type FlagConfiguration = Record<string, {
  variants: {
    on: boolean | number | string;
    off: boolean | number | string;
  },
  disabled: boolean,
  defaultVariant: "on" | "off",
  contextEvaluator: (context: EvaluationContext) => "on" | "off"
}>;

// TODO: define in some other place without hard-coded values (dotenv?)
const FLAG_CONFIGURATION: FlagConfiguration = {
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

// Abstraction layer for OpenFeature with helper methods for common use-cases
export class FeatureFlagAPIManager {
  client: Client
  provider: Provider

  constructor() {
    this.client = OpenFeature.getClient();
    this.provider = new InMemoryProvider(FLAG_CONFIGURATION);
    OpenFeature.setProvider(this.provider);
  }

  public async getFlagEnabled(flag: string, req: Request): Promise<boolean> {
    const context = {
      cow: req.get("x-cow") ?? ""
    };
    return this.client.getBooleanValue(flag, false, context);
  }
}
