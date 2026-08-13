# Contributing

## Commit Messages

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Code style changes (formatting, whitespace, etc.) |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `perf` | A code change that improves performance |
| `test` | Adding or fixing tests |
| `build` | Changes to build system or dependencies |
| `ci` | Changes to CI configuration files and scripts |
| `chore` | Other changes that don't modify src or test files |
| `revert` | Reverts a previous commit |

### Scope

Free-form — use whatever makes sense for the change (e.g., `frontend`, `backend`, `api`, `typespec`, etc.).

### Examples

```
feat(backend): add slot availability endpoint
fix(frontend): resolve date picker timezone offset
docs: add CONTRIBUTING.md
ci: add commitlint to CI workflow
```

### Enforcement

- **Local**: `husky` runs `commitlint` automatically before each commit
- **CI**: commit messages are validated on push and pull requests
- Invalid commit messages will be rejected by both

## Development Setup

### Root (TypeSpec API definition)

```bash
npm install
npx tsp compile main.tsp       # compile, emit OpenAPI
npx tsp validate main.tsp      # validate without emitting
```

### Backend (Spring Boot)

```bash
./mvnw spring-boot:run         # run the server
./mvnw test                    # run tests
```

### Frontend (Vite + React)

```bash
cd frontend
npm install
npm run dev                    # start dev server
npm run test:run               # run tests
npm run typecheck              # type check
npm run lint                   # lint with oxlint
```
