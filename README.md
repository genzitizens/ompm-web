# OMPM Web

Web-based skeleton for the OMPM application. This project uses React, TypeScript, and Vite, with Docker support for local development and production-style container builds.

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Docker

### Development

```bash
docker compose --profile dev up web-dev
```

### Production-style local run

```bash
docker compose up web
```
