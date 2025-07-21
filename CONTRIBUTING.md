# Contributing to Vendor Management System

Thank you for your interest in contributing to the Vendor Management System! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Set up your environment variables (see README.md)
5. Start the development server: `npm run dev`

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic

### Component Structure
- Keep components focused and single-purpose
- Use proper TypeScript interfaces for props
- Implement proper error handling
- Follow the existing file organization pattern

### Database Changes
- Never modify existing migration files
- Create new migration files for schema changes
- Always include RLS policies for new tables
- Test migrations thoroughly

### Commit Messages
Use clear, descriptive commit messages:
- `feat: add new vendor search functionality`
- `fix: resolve image upload issue`
- `docs: update setup instructions`
- `refactor: improve catalog management component`

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Update documentation if needed
5. Submit a pull request with a clear description

## Testing

- Test all new features manually
- Ensure responsive design works on mobile
- Verify database operations work correctly
- Test image upload functionality

## Questions?

Feel free to open an issue for any questions or suggestions!