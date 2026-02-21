# Apsis

A modern wrapper for NASA's [Astronomy Picture of the Day](https://apod.nasa.gov/)
website

## Running the Front-End

```bash
cd frontend
npm start
```

## Running the Back-End

```bash
cd backend
npm run dev
```

# Progress

- [x] Simple Feature flag system using OpenFeature and `InMemoryProvider`
- [x] Display today's APOD
- [x] Display information from today's APOD using a simple web-scraper
- [ ] Select other days, go back and forward a day
- [ ] Add functionality for storing/caching APOD images and metadata

## Stretch-Goals

- [ ] Make a docker-compose
- [ ] Use an actual OpenFeature provider
- [ ] Make it pretty
