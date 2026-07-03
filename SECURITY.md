# Security Policy

## Supported Versions

This project is currently in active development. Security updates are handled on the latest development branch and the most recent release snapshot.

## Reporting a Vulnerability

If you discover a security vulnerability, please do not open a public issue.

Please report it privately by emailing the maintainer or opening a private security report through GitHub if available.

Please include:
- a clear description of the issue
- affected files or routes
- steps to reproduce
- potential impact
- suggested fix if available

## Expected Handling

- We will review the report as soon as possible.
- We will confirm the issue and assess severity.
- We will work on a fix and provide updates.
- We may request additional details during investigation.

## Security Best Practices for This Project

This app handles authentication, file uploads, video metadata, and third-party API credentials. Please follow these practices:

- Never commit secrets, API keys, or private tokens to GitHub.
- Always use environment variables for credentials.
- Keep dependency packages updated.
- Use HTTPS in production.
- Protect webhook endpoints and verify signatures.
- Restrict database access and use strong passwords.
- Review permissions for Clerk, UploadThing, Mux, and Upstash.

## Sensitive Files

Do not commit or share:
- .env
- .env.local
- .env.production
- API keys and secrets
- private webhook secrets
- database connection strings

## Recommended Production Hardening

Before deploying to production, ensure that:
- environment variables are set securely
- authentication is enforced for protected routes
- file uploads are validated and rate-limited
- webhooks are verified
- logs do not expose sensitive tokens
- monitoring and alerting are enabled
