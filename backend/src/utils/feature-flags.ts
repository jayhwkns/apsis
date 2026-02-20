import { OpenFeature, InMemoryProvider, type EvaluationContext, type Client, type Provider } from "@openfeature/server-sdk";
import type { Request } from "express";

// Strict interface for OpenFeature configuration
// A type similar to this might exist elsewhere, but I couldn't find it so I'm
// making my own.
type FlagConfiguration = Readonly<Record<string, {
  variants: {
    on: boolean | number | string;
    off: boolean | number | string;
  },
  disabled: boolean,
  defaultVariant: "on" | "off",
  contextEvaluator: (context: EvaluationContext) => "on" | "off"
}>>;

// TODO: define in some other place without hard-coded values (dotenv?)
const FLAG_CONFIGURATION: FlagConfiguration = {
  'with-cows': {
    variants: {
      on: true,
      off: false
    },
    disabled: true,
    defaultVariant: "off",
    contextEvaluator: (context: EvaluationContext) => {
      if (
        context.cow === "Bessie" ||
        context.email === "user@mail.com" ||
        context.organization === "Stoke Space"
      ) {
        return "on";
      }
      return "off";
    }
  },
  'user-info': {
    variants: {
      on: true,
      off: false
    },
    disabled: false,
    defaultVariant: "off",
    contextEvaluator: (context: EvaluationContext) => {
      if (
        context.email === "user@mail.com" ||
        context.organization === "Stoke Space"
      ) {
        return "on";
      }
      return "off";
    }
  },
  'flag-info': {
    variants: {
      on: true,
      off: false
    },
    disabled: false,
    defaultVariant: "off",
    contextEvaluator: (context: EvaluationContext) => {
      if (
        context.email === "user@mail.com" ||
        context.organization === "Stoke Space"
      ) {
        return "on";
      }
      return "off";
    }
  }
};

// Stores feature flag names as keys and whether or not they are enabled
type FeatureFlagsTable = Record<string, boolean>;

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
    const context: EvaluationContext = {
      cow: req.get("x-cow") ?? "",
      email: req.get("x-email") ?? "",
      organization: req.get("x-organization") ?? ""
    };
    return this.client.getBooleanValue(flag, false, context);
  }

  // Gets a table of all feature flags and whether they're enabled/disabled
  public async getFeatureFlagsTableForUser(
    email: string | undefined,
    organization: string | undefined
  ): Promise<FeatureFlagsTable> {
    const context: EvaluationContext = {
      email: email ?? "",
      organization: organization ?? ""
    };
    var result: FeatureFlagsTable = {};

    /* This was the issue I was running into during the assessment. The
       function would return an empty object because I assumed this iterator
       waited on each iteration. In reality, it appears to spawn an async thread
       for each item.
    await Object.keys(FLAG_CONFIGURATION).forEach(async (flag) => {
      result[flag] = await this.client.getBooleanValue(flag, false, context);
    });

    Instead, I changed FLAG_CONFIGURATION to Readonly, so I can iterate over it
    like this:
    */

    for (const flag in FLAG_CONFIGURATION) {
      result[flag] = await this.client.getBooleanValue(flag, false, context);
    }

    return result;
  }
}
