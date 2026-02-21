// Scrapes pages in the `apod.nasa.gov` domain for image links and metadata
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import type Apod from "@/types/apod.ts";
import { abbreviate } from "./dateUtils.ts";

// TODO: make configurable so people can use different mirrors
const APOD_URL = "https://apod.nasa.gov"

const turndownService = new TurndownService();

// Plainly extracted web data
interface ApodWebData {
  date: string | undefined;
  title: string | undefined;
  // All centered HTML data below the image
  imageFooter: string | undefined;
  description: string | undefined;
  imageLink: string | undefined;
}


// Helper for the logic of getting raw string data in a type-safe format
class ApodWebDataExtractor {
  webData: ApodWebData;
  copyrightRestrict: boolean;
  constructor(webData: ApodWebData, copyrightRestrict: boolean) {
    this.webData = webData;
    this.copyrightRestrict = copyrightRestrict;
  }

  public buildApodData(): Apod {
    const imageFooter = this.parseImageFooter();
    return {
      date: this.getDate(),
      title: imageFooter.title,
      credits: imageFooter.credits,
      copyright: imageFooter.copyright,
      description: this.getDescription(),
      imageLink: this.getImageLink(imageFooter.copyright)
    }
  }

  parseImageFooter() {
    const imageFooter = this.webData.imageFooter;
    if (!imageFooter) {
      throw new ApodScraperError("Image Footer")
    }

    return {
      copyright: this.isCopyright(imageFooter),
      title: this.getTitle(imageFooter),
      credits: this.getCredits(imageFooter)
    };
  }

  getDate(): Date {
    if (!this.webData.date) {
      throw new ApodScraperError("Date");
    }
    // Date constructor already supports the format it's in
    const date = new Date(this.webData.date.trim());
    if (isNaN(date.getTime())) {
      throw new Error(`Date "${this.webData.date}" is in an invalid format!`);
    }
    return date;
  }

  getTitle(imageFooter: string): string {
    const $ = cheerio.load(imageFooter);
    const title = $("b").prop("innerText")?.trim();
    if (!title) {
      throw new ApodScraperError("Title");
    }
    return title;
  }

  isCopyright(imageFooter: string): boolean {
    const copyright = imageFooter
      .toUpperCase()
      .includes("COPYRIGHT");

    return copyright;
  }

  getCredits(imageFooter: string) {
    var imageCreditsHtml = imageFooter;
    var textCredits = undefined;
    if (imageFooter.includes("Text:")) {
      const split = imageFooter.split("Text:");
      imageCreditsHtml = split[0]!
      const after = split[1]!;
      const $ = cheerio.load(after);
      const a = $("a");
      const link = a.attr('href') ?? "";
      const name = a.prop("innerText") ?? "";
      textCredits = {
        name: name,
        link: link
      };
    }

    // Remove values in parenthesis, they are not involved in crediting the
    // person, but the organization that person is a part of.
    const clearedHtml = imageCreditsHtml.replace(new RegExp("\\(.*\\)"), "");
    const $ = cheerio.load(clearedHtml);
    const a = $("a").get();
    const imgCredits: {
      name: string;
      link: string | undefined
    }[] = [];
    if (a.length === 0) {
      // If unlinked, all names will be in a single element
      const name: string = $("b:get(1)").parent().last().prop("innerText")!;
      imgCredits.push({ name: name, link: undefined });
    } else {
      a.forEach((e) => {
        const name: string = (e.firstChild as any).data;
        if (name.toUpperCase().includes("COPYRIGHT")) {
          return;
        }
        const link = e.attribs["href"];
        const credit = {
          name: name,
          link: link
        };
        imgCredits.push(credit);
      })
    }

    const credits = {
      image: imgCredits,
      text: textCredits
    }

    return credits;
  }

  getDescription(): string {
    if (!this.webData.description) {
      throw new ApodScraperError("Description");
    }
    // This bit will be a little redundant in our front-end
    const remove = "**Explanation:**"
    // Convert to markdown.
    // This saves on payload, can make future storage more efficient and
    // effectively sanitizes the HTML.
    const descriptionMarkdown = turndownService.turndown(this.webData.description)
      .replace(remove, "")
      .trim();

    return descriptionMarkdown;
  }

  getImageLink(copyright: boolean): string | undefined {
    var imageLink = this.webData.imageLink;
    const copyrightProtected = copyright && this.copyrightRestrict;
    if (!copyrightProtected && !imageLink) {
      throw new ApodScraperError("Image link");
    }
    imageLink = copyrightProtected ? undefined : imageLink;
    return imageLink;
  }
}


class ApodScraperError extends Error {
  constructor(field: string) {
    super(`${field} could not be parsed from apod webpage`);
    this.name = "ApodScraperError";
    Object.setPrototypeOf(this, ApodScraperError.prototype);
  }
}

interface ApodScraperConfig {
  // Will refrain from sending the image link when image is copyrighted.
  // This is mostly out of abundance of caution, as I am not a legal expert.
  copyrightRestrict: boolean;
}

export class ApodScraper {
  config: ApodScraperConfig = {
    copyrightRestrict: true
  };

  constructor(config?: Partial<ApodScraperConfig>) {
    if (!config) return;
    this.config = { ...this.config, ...config };
  }

  async getApodWebDataExtractor(url: string): Promise<ApodWebDataExtractor> {
    // Go to apod and get html
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Couldn't get apod web data from URL "${url}". Status: ${res.status}`)
    }
    const html = await res.text();

    // Parse using cheerio
    const $ = cheerio.load(html);

    const data: ApodWebData = $.extract({
      date: "center > p:eq(1)",
      title: "center > b",
      imageFooter: {
        selector: "center:eq(1)",
        value: "innerHTML"
      },
      description: {
        selector: "body > p",
        value: "innerHTML"
      },
      imageLink: {
        selector: "img",
        value: "src"
      }
    });

    return new ApodWebDataExtractor(data, this.config.copyrightRestrict);
  }

  async getApodFromUrl(url: string) {
    return (await this.getApodWebDataExtractor(url)).buildApodData();
  }

  public async today(): Promise<Apod> {
    return await this.getApodFromUrl(APOD_URL);
  }

  public async fromDay(date: Date): Promise<Apod> {
    const url = `${APOD_URL}/apod/ap${abbreviate(date)}.html`;
    return await this.getApodFromUrl(url)
  }
}
