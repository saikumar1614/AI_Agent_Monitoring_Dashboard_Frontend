# AI Agent Monitoring Dashboard Frontend

Angular 17 frontend for monitoring AI agents, executions, tool usage, failures, latency, token consumption, and operational costs.

## Features

- Authentication flow and protected routes
- Dashboard with KPI cards, charts, and auto-refresh
- Agent and execution management views
- Tool usage and failure analytics pages
- Error details and failure resolution workflow
- Latency analytics with date and granularity filters
- Token analytics with Grafana dashboard embedding
- Cost analytics with trend and category breakdowns
- Lazy-loaded feature modules for bundle optimization

## Tech Stack

- Angular 17
- Angular Material + CDK
- RxJS + HttpClient
- Chart.js + ng2-charts
- Bootstrap / ngx-bootstrap

## Project Structure

- `src/app/core` : guards, interceptors, services, models
- `src/app/dashboard` : main monitoring dashboard
- `src/app/analytics` : latency, token, and cost analytics
- `src/app/failures` : failure dashboard and error details
- `src/app/tool-usage` : tool usage insights
- `src/environments` : environment-specific runtime settings
- `docs` : user guide and screenshots index

## Setup

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm ci
```

### Run in Development

```bash
npm start
```

### Run in Staging Mode

```bash
npm run start:staging
```

### Build

```bash
npm run build
```

### Production Build

```bash
npm run build:prod
```

## Environment Configuration

Configure runtime values in:

- `src/environments/environment.ts` (development)
- `src/environments/environment.staging.ts` (staging)
- `src/environments/environment.prod.ts` (production)

Key settings:

- `apiUrl`
- `timeout`
- endpoint maps under `endpoints`
- Grafana integration under `grafana`

## Docker Deployment

Build image:

```bash
docker build -t ai-agent-frontend .
```

Run container:

```bash
docker run -p 8080:80 ai-agent-frontend
```

Nginx SPA fallback and cache headers are configured in `nginx.conf`.

## CI

GitHub Actions workflow:

- `.github/workflows/frontend-ci.yml`

Pipeline steps:

- Install dependencies
- Build production bundle
- Upload dist artifact

## User Guide and Screenshots

- User guide: `docs/USER_GUIDE.md`
- Screenshot index: `docs/screenshots/README.md`

## Final Notes

- Routes are lazy loaded and preloaded using `PreloadAllModules`.
- Use SSH remote for git operations (`git@github.com:...`) as already configured.
