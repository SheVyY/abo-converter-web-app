# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in the ABO Converter Web App, please report it privately by:

1. **Email**: Send details to hozaksebastian@gmail.com
2. **Subject**: Include "SECURITY - Web App" in the subject line
3. **Details**: Provide as much information as possible about the vulnerability

Please do NOT create a public GitHub issue for security vulnerabilities.

## What to Include

When reporting a vulnerability, please include:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Browser/device information
- Any suggested fixes (if you have them)

## Response Timeline

- We will acknowledge receipt of your report within 48 hours
- We will provide a detailed response within 7 days
- We will work with you to understand and resolve the issue
- We will credit you in our security advisory (unless you prefer to remain anonymous)

## Security Best Practices

This web application follows these security practices:

- **Client-side processing**: All file conversion happens in the browser, no data sent to servers
- **No data storage**: Files are not stored or transmitted to any external services
- **Input validation**: All user inputs are validated and sanitized
- **Secure headers**: Proper security headers are configured
- **Dependencies**: Regular security updates for all dependencies

## Scope

This security policy applies to:

- The main web application (React/Next.js)
- Client-side file processing logic
- Docker container configuration
- Build and deployment processes

## Out of Scope

- Third-party services (Vercel, npm registry, etc.)
- User's local environment or browser security
- Physical security of development machines