// Scrapes pages in the `apod.nasa.gov` domain for image links and metadata
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import type Apod from "@/types/apod.ts";

// TODO: make configurable so people can use different mirrors
const APOD_URL = "https://apod.nasa.gov"

const turndownService = new TurndownService();

// Plainly extracted web data
interface ApodWebData {
  date: string | undefined;
  title: string | undefined;
  creditAndCopyright: string | undefined;
  creditLinks: string[];
  creditText: string[];
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
    const copyright = this.isCopyright();
    return {
      date: this.getDate(),
      title: this.getTitle(),
      credits: this.getCredits(),
      copyright: copyright,
      description: this.getDescription(),
      imageLink: this.getImageLink(copyright)
    }
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

  getTitle(): string {
    if (!this.webData.title) {
      throw new ApodScraperError("Title");
    }
    const title = this.webData.title.trim();
    return title;
  }

  isCopyright(): boolean {
    if (!this.webData.creditAndCopyright) {
      throw new ApodScraperError("Credit & Copyright");
    }
    const copyright = this.webData.creditAndCopyright
      .toUpperCase()
      .includes("COPYRIGHT");

    return copyright;
  }

  getCredits() {
    const data = this.webData;
    if (!data.creditLinks || data.creditLinks.length < 2) {
      throw new ApodScraperError("Links for credits");
    }
    const imgCreditLink = data.creditLinks[0]!;
    const textCreditLink = data.creditLinks[1]!;
    if (!data.creditText || data.creditText.length < 2) {
      throw new ApodScraperError("Links for credits");
    }
    const imgCreditName = data.creditText[0]!;
    const textCreditName = data.creditText[1]!;
    const credits = {
      image: {
        name: imgCreditName,
        link: imgCreditLink
      },
      text: {
        name: textCreditName,
        link: textCreditLink
      }
    };

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

  async getApodWebDataExtractor(url: string) {
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
      creditAndCopyright: "center > b:eq(1)",
      creditLinks: [{
        selector: "center > a",
        value: "href"
      }],
      creditText: ["center > a"],
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
    const yy = String(date.getFullYear() % 100).padStart(2, '0');
    const mm = String(date.getMonth()).padStart(2, '0');
    const dd = String(date.getDay()).padStart(2, '0');

    const url = `${APOD_URL}/apod/ap${yy}${mm}${dd}.html`;
    return await this.getApodFromUrl(url)
  }
}
