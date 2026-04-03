# AGENTS.md - SongNumber

## Commands

```bash
npm run dev              # Start dev server (https://vite.local.dev:3000)
npm run build            # Type check + production build
npm run build-only       # Production build without type checking
npm run type-check       # Run vue-tsc type checking
npm run test:unit        # Run all vitest tests
npm run test:unit -- -t "test name"  # Run a single test by name
npm run test:unit -- src/path/to/file.test.ts  # Run tests in a specific file
npm run lint             # Run ESLint with auto-fix
npm run format           # Run Prettier on src/
npm run sync             # Ionic Capacitor sync (build + copy native)
```

## Project Structure

Feature-based organization under `src/`:

```
src/
  main/        # Song number selection feature
  books/       # Song book management feature
  config/      # App configuration feature
  info/        # Information display feature
  layout/      # Shared layout components
  store/       # Pinia stores (barrel export via index.ts)
  i18n/        # Translations (en, ro)
  theme/       # Global styles (SCSS)
```

Each feature folder contains `components/` and `pages/`.

## Code Style

### Formatting (Prettier)

- No semicolons
- Single quotes for strings
- Tab width: 2 spaces
- Print width: 140 characters
- No trailing commas
- Arrow function parens: avoid when single parameter
- Closing bracket on same line as props
- Vue `<script>` and `<style>` tags indented

### TypeScript

- Strict mode enabled via `@vue/tsconfig`
- Use `type` imports when only needed for types
- Path alias: `@/*` resolves to `./src/*`
- No explicit `any` enforcement (currently disabled in eslint)
- Define interfaces for component props and store models

### Vue Components

- Use Composition API with `<script setup lang="ts">`
- Components use PascalCase naming (e.g., `SongNumber.vue`)
- Ionic components imported from `@ionic/vue`
- Use `defineModel<T>()` for v-model bindings
- Lazy load route components: `component: () => import('@/path/Component.vue')`

### State Management (Pinia)

- Use `defineStore` with setup function pattern
- Barrel export all stores from `src/store/index.ts`
- Use `storeToRefs` for reactive store properties
- Use `storageRef` for persistent state via Capacitor Preferences
- Composables prefixed with `use` (e.g., `useSongNumberStore`)

### Naming Conventions

- Components: PascalCase (`SongDigit.vue`)
- Stores: kebab-case with `.store.ts` suffix (`song-number.store.ts`)
- Variables/functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Enums: PascalCase
- Route names: lowercase

### Error Handling

- Try/catch for async operations (e.g., Capacitor APIs)
- Silent failures acceptable for non-critical features (e.g., cert loading)
- Use logger store for structured logging

### Styling

- SCSS for styles
- Global styles in `src/theme/global.scss`
- Component-scoped styles preferred
- Use Ionic CSS utilities when possible

### i18n

- Vue I18n with composition API (`legacy: false`)
- Translation files: `src/i18n/{locale}.ts`
- Use `useI18n()` composable in components

## Important Notes

- This is an Ionic Vue + Capacitor mobile app for Chromecast song number display
- HTTPS required for local dev (certs in `.cert/`)
- Chromecast integration via custom `cordova-chromecast` package
- PWA enabled with auto-update registration
- Target platforms: Android, iOS, Web
