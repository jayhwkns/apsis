// Scrapes pages in the `apod.nasa.gov` domain for image links and metadata
import * as cheerio from "cheerio";
import TurndownService from "turndown";

// TODO: make configurable so people can use different mirrors
const APOD_URL = "https://apod.nasa.gov"

const turndownService = new TurndownService();

interface ApodData {
  date: Date;
  title: string;
  credits: {
    image: {
      name: string;
      link: string;
    };
    text: {
      name: string;
      link: string;
    };
  };
  copyright: boolean;
  description: string;
  imageLink: string | undefined;
}

class ApodScraperError extends Error {
  constructor(field: string) {
    super(`${field} could not be parsed from apod webpage`);
    this.name = "ApodScraperError";
    Object.setPrototypeOf(this, ApodScraperError.prototype);
  }
}

export class ApodScraper {
  // Will refrain from sending the image link when image is copyrighted.
  // This is mostly out of abundance of caution, as I am not a legal expert.
  copyrightRestrict: boolean;

  constructor(allowCopyright: boolean) {
    this.copyrightRestrict = allowCopyright;
  }

  public async today() {
    // Go to apod and get html
    const res = await fetch(APOD_URL);
    const html = await res.text();

    // Parse using cheerio
    const $ = cheerio.load(html);

    const data = $.extract({
      date: "center > p:eq(1)",
      title: "center > b",
      creditAndCopyright: "center > b:eq(1)",
      creditLinks: [{
        selector: "center > a",
        value: "href"
      }],
      creditText: ["center > a"],
      imageLink: {
        selector: "img",
        value: "src"
      }
    });

    if (!data.date) {
      throw new ApodScraperError("Date");
    }
    // Date constructor already supports the format it's in
    const date = new Date(data.date.trim());

    if (!data.title) {
      throw new ApodScraperError("Title");
    }
    const title = data.title.trim();

    if (!data.creditAndCopyright) {
      throw new ApodScraperError("Credit & Copyright");
    }
    const copyright = data.creditAndCopyright
      .toUpperCase()
      .includes("COPYRIGHT");

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

    const description = $("body > p").html();
    if (!description) {
      throw new ApodScraperError("Description");
    }
    // This bit will be a little redundant in our front-end
    const remove = "**Explanation:**"
    // Convert to markdown.
    // This saves on payload, can make future storage more efficient and
    // effectively sanitizes the HTML data.
    const descriptionMarkdown = turndownService.turndown(description)
      .replace(remove, "")
      .trim();

    const copyrightProtected = copyright && this.copyrightRestrict;
    if (!copyrightProtected && !data.imageLink) {
      throw new ApodScraperError("Image link");
    }
    const imageLink = copyrightProtected ? undefined : data.imageLink;

    // Construct data
    const apodData: ApodData = {
      date: date,
      title: title,
      credits: credits,
      copyright: copyright,
      description: descriptionMarkdown,
      imageLink: imageLink
    }

    return apodData;
  }
}
