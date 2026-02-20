// Scrapes pages in the `apod.nasa.gov` domain for image links and metadata
import * as cheerio from "cheerio";

// TODO: make configurable so people can use different mirrors
const APOD_URL = "https://apod.nasa.gov"

interface ApodData {
  date: Date;
  title: string;
  credit: {
    name: string;
    link: string;
  };
  copyright: boolean;
  description: string;
  imageLink?: string;
}

export class ApodScraper {
  // Will refrain from sending the image link when image is copyrighted.
  // This is mostly out of abundance of caution, as I am not a legal expert.
  allowCopyright: boolean;

  constructor(allowCopyright: boolean) {
    this.allowCopyright = allowCopyright;
  }

  public async today() {
    // Go to apod and get html
    const res = await fetch(APOD_URL);
    const html = await res.text();

    // Parse using cheerio
    const $ = cheerio.load(html);

    const data = $.extract({
      date: 'center > p:eq(1)'
    });

    console.log(data.date);
  }
}
