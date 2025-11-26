# Contributing to Commercial Kit Generator

First off, thank you for considering contributing to this project! As an AI Solutions Architect showcase, I value clean, maintainable, and well-documented code.

## How Can You Contribute?

### 1. Reporting Bugs
- Ensure the bug was not already reported.
- Open a new Issue with a clear title and description.
- Include steps to reproduce and, if possible, the browser/OS version.

### 2. Suggesting Enhancements
- Open a new Issue with the tag `enhancement`.
- Explain *why* this feature would be valuable to the ICP (Industrial SME / SaaS B2B).

### 3. Pull Requests
- **Fork** the repo and create your branch from `main`.
- If you've added code that should be tested, add tests.
- Ensure your code follows the existing style (React + TypeScript).
- **Commit Messages:** Please follow [Conventional Commits](https://www.conventionalcommits.org/).
  - `feat: add new battlecard template`
  - `fix: resolve markdown parsing error`
  - `docs: update architecture diagram`

## Style Guide

- **TypeScript:** Strict mode enabled. No `any` unless absolutely necessary.
- **React:** Functional components with Hooks.
- **Tailwind:** Use utility classes for styling; avoid custom CSS files where possible.
- **Architecture:** Keep UI components separate from Logic/State hooks.

## AI Prompt Engineering
If you are modifying the prompts in `src/commercial-kit-gen-mvp.tsx`:
- Maintain the bilingual support (PT-PT / EN).
- Follow the structural patterns (Role, Context, Task, Format).
- Test the output in the artifact environment before submitting.

Thank you for helping make this tool better!
