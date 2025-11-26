# Security Policy

## Supported Versions

Since this is a showcase project built primarily as a Claude Artifact, only the current live version is actively supported.

| Version | Supported          |
| ------- | ------------------ |
| 2.x     | :white_check_mark: |
| 1.x     | :x:                |

## Reporting a Vulnerability

As an AI Solutions Architect, I take security seriously. If you discover a security issue, please do not open a public issue immediately.

1. **Email** me directly at [nuno.salvacao@gmail.com](mailto:nuno.salvacao@gmail.com).
2. In the subject line, please include `[SECURITY] Commercial Kit Generator`.
3. Provide a detailed description of the vulnerability and steps to reproduce.

I will acknowledge your report within 48 hours.

## Data Privacy & AI Models

This application runs client-side, but it interacts with AI models (Claude API).

- **Data Transmission:** When generating documents, data is sent to Anthropic's API.
- **Sensitivity:** Do not upload PII (Personally Identifiable Information), secrets, keys, or highly confidential trade secrets unless you have an enterprise agreement with the AI provider covering such use.
- **Local Storage:** This app uses your browser's Local Storage for convenience. Clearing your browser cache will remove saved contexts.

## Theoretical Security (Architecture)

If deploying this in a production environment, the following standard measures are recommended (as outlined in the [Technical Blueprint](docs/Technical%20Report%20-%20Commercial%20Kit%20Generator.md)):

- **Input Sanitization:** All file uploads should be sanitized before processing.
- **Rate Limiting:** To prevent API abuse and cost spikes.
- **TLS/SSL:** Mandatory for all data in transit.
