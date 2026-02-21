// apodCache handles the filesystem storage of APOD metadata
import type Apod from "@/types/apod.ts";
import * as fs from "fs/promises";
import * as fsSync from "fs";
import YAML from "js-yaml";
import { abbreviate } from "./dateUtils.ts";

// Make description optional so we can delete it and put it in the markdown body
type ApodFrontmatter = Omit<Apod, "description"> & Partial<Pick<Apod, "description">>

interface ApodCacheConfig {
  cacheDir: string
}

export class ApodCache {
  config: ApodCacheConfig = {
    cacheDir: "./cache"
  }

  constructor(config?: Partial<ApodCacheConfig>) {
    this.config = { ...this.config, ...config };
  }

  getPath(date: Date): string {
    return `${this.config.cacheDir}/${abbreviate(date)}.md`;
  }

  public async initCache() {
    if (fsSync.existsSync(this.config.cacheDir)) return;
    await fs.mkdir(this.config.cacheDir, { mode: 0o755 });
  }

  public has(date: Date) {
    const path = this.getPath(date);
    return fsSync.existsSync(path);
  }

  public async writeApod(apod: Apod): Promise<string> {
    const description = apod.description;
    const frontmatter: ApodFrontmatter = apod;
    delete frontmatter.description;
    const yaml = YAML.dump(frontmatter);
    const content = `---\n${yaml}---\n${description}`;
    const path = this.getPath(apod.date);

    await fs.writeFile(path, content);

    return content;
  }

  public async getApod(date: Date): Promise<string> {
    const path = this.getPath(date);

    return await fs.readFile(path, "utf-8");
  }
}
