# AGENTS.md - SongNumber

## Commands

```bash
bun i                    # Install dependencies (bun is the package manager)
bun run dev              # Start dev server (https://vite.local.dev:3000)
bun run build            # Type check + production build
bun run build-only       # Production build without type checking
bun run type-check       # Type check with vue-tsgo (TypeScript 7)
bun run lint             # Biome lint
bun run format           # Biome format (write)
bun run check            # Biome lint + format + organize imports (write)
bun run sync             # Ionic Capacitor sync (build + copy native)
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
  theme.css    # Global styles
```

Each feature folder contains `components/` and `pages/`.

## Code Style

### Formatting (Biome, `biome.json`)

- No semicolons
- Single quotes for strings
- Tab width: 2 spaces
- Print width: 140 characters
- No trailing commas
- Arrow function parens: avoid when single parameter
- Closing bracket on same line as props (`bracketSameLine: true`)
- Vue `<script>` and `<style>` contents indented (`html.formatter.indentScriptAndStyle`)
- Imports are sorted by Biome, except `src/store/index.ts`, whose barrel export order is intentional (excluded via override)
- In `.vue` files, unused variable/import and `useImportType` rules are off: Biome can't see template usage

### TypeScript

- Strict mode enabled via `@vue/tsconfig`
- Use `type` imports when only needed for types
- Path alias: `@/*` resolves to `./src/*`
- No explicit `any` enforcement (Biome `noExplicitAny: off`)
- Define types/interfaces in `src/store/models.ts` for shared types
- Use `Record<string, string>` for dynamic object types

### Vue Components

- Use Composition API with `<script setup lang="ts">`
- Components use PascalCase naming (e.g., `SongNumber.vue`)
- Ionic components imported from `@ionic/vue`
- Use `defineModel<T>()` for v-model bindings
- Lazy load route components: `component: () => import('@/path/Component.vue')`
- Page components use `IonPage` as root element
- Use `useI18n()` for translations: `{{ t('pages.main.title') }}`
- Modals created via `modalController.create()` and `await modal.present()`

### State Management (Pinia)

- Use `defineStore` with setup function pattern
- Barrel export all stores from `src/store/index.ts`
- Use `storeToRefs` for reactive store properties in components
- Destructure actions directly from store (not via `storeToRefs`)
- Use `storageRef` for persistent state via Capacitor Preferences
- Store names: `useXxxStore()` (e.g., `useSongNumberStore`)
- Store files: kebab-case with `.store.ts` suffix

### Naming Conventions

- Components: PascalCase (`SongDigit.vue`, `SelectBookModal.vue`)
- Stores: kebab-case with `.store.ts` suffix (`song-number.store.ts`)
- Variables/functions: camelCase
- Constants: UPPER_SNAKE_CASE (e.g., `APPLICATION_ID`, `STORAGE_ID_DIGITS`)
- Enums: PascalCase (`ChromeCastState`, `LogLevel`)
- Route names: lowercase (`main`, `books`, `config`, `info`)

### Error Handling

- Try/catch for async operations (e.g., Capacitor APIs)
- Silent failures acceptable for non-critical features (e.g., cert loading in vite.config.ts)
- Use `useLoggerStore()` for structured logging with levels: `info`, `warn`, `error`, `debug`
- Log levels persisted via `STORAGE_ID_DEBUG`
- Toast notifications for user-facing messages via logger store

### Styling

- Plain CSS (no Sass). Avoid CSS nesting (iOS 16.0-16.4, still supported by Ionic 9, lacks it); keep selectors flat
- Global styles in `src/theme.css` (Ionic CSS imports + overrides)
- Shadow-DOM Ionic components (e.g. `ion-toast`) ignore global selectors for their internals: style them via their CSS variables (`--background`, ...) or `::part()`. Scoped ones (e.g. `ion-alert`) accept plain selectors
- Component-scoped styles preferred
- Use Ionic CSS utilities when possible (e.g., `ion-padding`, `ion-padding-start`)

### i18n

- Vue I18n with composition API (`legacy: false`)
- Translation files: `src/i18n/{locale}.ts` (en, ro)
- Use `useI18n()` composable in components
- Translation key pattern: `pages.{feature}.{key}` or `providers.{service}.{key}`

## Important Notes

- This is an Ionic Vue + Capacitor mobile app for Chromecast song number display
- HTTPS required for local dev (certs in `.cert/`)
- Chromecast integration via custom `cordova-chromecast` package
- Chromecast app ID: `20CAA3A2`, namespace: `urn:x-cast:ro.biserica2.cast.songnumber`
- PWA is currently **disabled**: `VitePWA` is commented out in `vite.config.ts` until the library updates
- Target platforms: Android, iOS, Web
- Uses `@ionic/pwa-elements` for web-based modals/toasts
- Global `window.chrome.cast` declarations for Chromecast sender API
- TypeScript 7 (no JS compiler API) is type-checked with `vue-tsgo`. Don't add `vue-tsc`, or any tool needing the TS 6 API (e.g. typescript-eslint), without a `@typescript/typescript6` alias
- `vite.config.ts` marks `@ionic/core/components` side-effect free (`build.rolldownOptions.treeshake.moduleSideEffects`). Without it, Ionic 9's `exports` map hides the nested `sideEffects: false` and every Ionic component gets bundled (~1.1 MB instead of ~0.8 MB)
- There is no test runner; the unused Vitest/jsdom setup was removed. `bun test` is the lightest option if tests are added
- `vite.config.ts` reads `.cert/key.pem` and `.cert/cert.pem` if they exist and otherwise falls back to HTTP. HMR is hard-wired to `wss://vite.local.dev:3000`
- The README says the app ID is in `src/providers/chromecast.ts`. That path is stale: the ID is `APPLICATION_ID` in `src/store/crome-cast.store.ts`
- Native builds: `bun run sync`, then `bunx cap open android` (or `ios`). Android version is set in `android/app/build.gradle`; regenerate icons/splash with `bun run assets`

## Architecture

- **Bootstrapping** — `src/main.ts` defines the router, i18n and Pinia inline (there is no `router/` folder). Every page is a child of `LayoutPage.vue`; unknown paths redirect to `/main`.
- **Stores import each other through the `@/store` barrel.** `src/store/index.ts` re-exports in a deliberate order (models → ref → script → logger → camera → song-books → song-number → chromecast → form). Adding a store means adding it there, and keeping in mind that barrel order matters for circular imports.
- **Persistence** — `storageRef(key, initial, map?)` in `src/store/ref.ts` is a `ref` backed by Capacitor Preferences (JSON-serialized). It starts at `initial`, loads asynchronously, and only begins writing back (deep watch) _after_ the first load. Code that reads a `storageRef` right at startup may see the initial value. Storage keys are `STORAGE_ID_*` constants prefixed `song-number-settings-`.
- **Chromecast flow** — `crome-cast.store.ts` (the filename really is misspelled) loads the Google Cast sender script, initializes it on `__onGCastApiAvailable` (web) or `deviceready` (native via `cordova-chromecast`), and exposes `state` / `open` / `close` / `send` / `message`. `ChromeCastState` values are bit flags (`DISABLED=0, INITIALIZED=1, AVAILABLE=3, CONNECTED=7`), so check them with bitmasks the way `song-number.store.ts` does. `song-number.store.ts` sits on top of it: it owns the digits, book, notes and info, and sends messages whose `type` comes from its `MessageType` enum (`READ=0, SONG=1, INFO=2, CLEAR=3`).
- **Receiver** — `receiver/index.html` is the standalone Cast receiver page, hosted separately and registered under the app ID. It switches on the same numeric `type` values, so changing the message protocol means editing `MessageType` in `song-number.store.ts` **and** the receiver together.
- **Song book catalog** — `song-books.store.ts` fetches remote JSON from a user-configurable endpoint. It defaults to `VITE_DOWNLOADS` in `.env`, which points at this repo's `downloads/` folder on GitHub raw. The layout is `languages.json` → `index/<lang>/collections.json` → the collection files listed in `paths`. `downloads/` is data served from `master`, not app code. The default cover comes from `public/json/cover.json`.
- **Forms** — `src/store/form.ts` provides `useForm` plus validation rules (`requiredRule`, `minLengthRule`), which toggle Ionic's `ion-valid`, `ion-invalid` and `ion-touched` classes.
- **Logging** — `useLoggerStore` shows toasts instead of writing to the console. `info` always shows; `warn`, `error` and `debug` only show at or above the persisted log level.
