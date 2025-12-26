# Contributing to VivaSec

Thank you for your interest in contributing to VivaSec! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on the code, not the person
- Help others learn and grow
- Report issues responsibly

## Getting Started

### 1. Fork the Repository

Click the "Fork" button on GitHub to create your own copy of the repository.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/vivasec.git
cd vivasec
```

### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/vivasec.git
```

### 4. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## Development Workflow

### Setup Development Environment

```bash
# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local

# Initialize database
pnpm db:push

# Start development server
pnpm dev
```

### Making Changes

1. **Follow Code Style**
   - Use TypeScript for type safety
   - Follow existing code patterns
   - Use meaningful variable names
   - Add comments for complex logic

2. **Update Related Files**
   - Update tests if changing functionality
   - Update documentation if changing features
   - Update types if changing data structures

3. **Test Your Changes**
   ```bash
   # Run tests
   pnpm test

   # Run tests in watch mode
   pnpm test --watch

   # Check TypeScript
   pnpm check
   ```

### Commit Guidelines

Use clear, descriptive commit messages:

```bash
# Good commit messages
git commit -m "Add screenshot detection to VivaChat"
git commit -m "Fix VPN connection timeout issue"
git commit -m "Update database schema for new features"

# Avoid vague messages
git commit -m "Fix bug"
git commit -m "Update stuff"
```

### Push Changes

```bash
# Push to your fork
git push origin feature/your-feature-name
```

## Creating a Pull Request

1. **Go to GitHub**
   - Navigate to your fork
   - Click "Compare & pull request"

2. **Fill PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Performance improvement

   ## Related Issues
   Fixes #123

   ## Testing
   How to test these changes

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Tests pass
   - [ ] Documentation updated
   - [ ] No breaking changes
   ```

3. **Wait for Review**
   - Maintainers will review your PR
   - Address feedback and make updates
   - Once approved, your PR will be merged

## Feature Development

### Adding a New Feature

1. **Create Issue First**
   - Describe the feature
   - Discuss implementation approach
   - Get feedback from maintainers

2. **Implement Feature**
   - Follow the project structure
   - Add database schema if needed
   - Create API endpoints
   - Build UI components
   - Write tests

3. **Document Feature**
   - Update README.md
   - Add code comments
   - Create usage examples

### File Structure for New Features

```
Feature: New Privacy Module

1. Database Schema (drizzle/schema.ts)
   - Add tables for feature data

2. Database Helpers (server/db.ts)
   - Add query functions

3. API Endpoints (server/routers.ts)
   - Add tRPC procedures

4. UI Components (client/src/pages/)
   - Create feature page
   - Add to App.tsx routing

5. Tests (server/*.test.ts)
   - Write unit tests

6. Documentation
   - Update README.md
   - Add comments
```

## Bug Fixes

### Reporting Bugs

1. **Check Existing Issues**
   - Search for similar issues
   - Add to existing issue if found

2. **Create New Issue**
   ```markdown
   ## Description
   Clear description of the bug

   ## Steps to Reproduce
   1. Step 1
   2. Step 2
   3. Step 3

   ## Expected Behavior
   What should happen

   ## Actual Behavior
   What actually happens

   ## Environment
   - OS: Windows/Mac/Linux
   - Browser: Chrome/Firefox/Safari
   - Node version: 22.13.0
   ```

### Fixing Bugs

1. **Create Fix Branch**
   ```bash
   git checkout -b fix/bug-description
   ```

2. **Fix and Test**
   - Make minimal changes
   - Test thoroughly
   - Add regression tests

3. **Submit PR**
   - Reference the issue
   - Explain the fix
   - Show testing results

## Documentation

### Updating Documentation

1. **README.md**
   - Installation instructions
   - Feature descriptions
   - Quick start guide

2. **Code Comments**
   - Explain complex logic
   - Document functions
   - Add type hints

3. **DEPLOYMENT_GUIDE.md**
   - Deployment instructions
   - Configuration options
   - Troubleshooting

### Writing Good Documentation

- Use clear, simple language
- Include examples
- Add code snippets
- Keep it up-to-date

## Testing

### Writing Tests

```typescript
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("feature.test", () => {
  it("should do something", async () => {
    const caller = appRouter.createCaller(ctx);
    const result = await caller.feature.action();
    expect(result).toBe(expected);
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/feature.test.ts

# Run with coverage
pnpm test --coverage
```

## Performance Guidelines

1. **Database Queries**
   - Use indexes for frequently queried columns
   - Avoid N+1 queries
   - Limit result sets

2. **Frontend**
   - Minimize bundle size
   - Use code splitting
   - Optimize images
   - Implement lazy loading

3. **API**
   - Cache responses
   - Use pagination
   - Compress responses

## Security Guidelines

1. **Never Commit Secrets**
   - Use .env files
   - Use environment variables
   - Check .gitignore

2. **Input Validation**
   - Validate all user inputs
   - Use Zod for schema validation
   - Sanitize data

3. **Authentication**
   - Use protectedProcedure for auth-required endpoints
   - Verify user permissions
   - Use secure session handling

## Deployment

### Before Deploying

- [ ] All tests pass
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Security checklist complete

### Deployment Process

1. Merge to main branch
2. Create release tag
3. Deploy to staging
4. Test in staging
5. Deploy to production

## Getting Help

- **Questions**: Create a Discussion on GitHub
- **Issues**: Create an Issue for bugs
- **Chat**: Join our community Discord (if available)
- **Email**: support@vivasec.app

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

## License

By contributing to VivaSec, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to VivaSec! 🎉

**Last Updated**: December 2025
