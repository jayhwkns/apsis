# Apsis

A modern wrapper for NASA's [Astronomy Picture of the Day](https://apod.nasa.gov/)
website

## Front-End

Built with Vite, TS, SolidJS, and Tailwindcss.
The reactive design allows for faster navigation between days.
The design is meant to modernize the look of the original site to look more
like NASA's current websites, while the simpler view has more visual clarity.

### Preview

<img width="1215" height="754" alt="image" src="https://github.com/user-attachments/assets/1ec592fd-afe7-462f-805f-d14b8f4b4aaf" />

### Running

```bash
cd frontend
# install dependencies
npm install  
npm run dev
```

## Back-End

The back-end web-scrapes the original APOD website's HTML data.
There exists an [APOD API](https://github.com/nasa/apod-api) that is officially
supported by NASA, but this app doesn't use it. Why?

1. I wanted to write a web-scraper from scratch
2. Less network plumbing, faster responses
3. Additional functionality (below)

After scraping the data from NASA's APOD website, it gets converted to
**markdown** format with **yaml frontmatter** and cached in a directory
specified on the back-end. Then, the APOD data gets sent in the markdown/yaml
format, which is typically slightly smaller that HTML/JSON. This has the
benefit of a smaller payload, additional performance, and the plain data is
more readable and easier to work with.

### Running

```bash
cd backend
# instal dependencies
npm install
npm run dev
```

# Progress

- [x] Simple Feature flag system using OpenFeature and `InMemoryProvider`
  - Completed in PR #1
- [x] Display today's APOD
  - Completed in PR #2
- [x] Display information from today's APOD using a simple web-scraper
  - Completed in PR #2
- [x] Select other days, go back and forward a day
  - Completed in PR #3
- [x] Add functionality for storing/caching APOD images and metadata
  - Completed in PR #7

## Stretch-Goals

- [ ] Make a docker-compose
- [ ] Use an actual OpenFeature provider
- [x] Make it pretty
