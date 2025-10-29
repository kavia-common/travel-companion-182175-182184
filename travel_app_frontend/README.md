# Angular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.1.

## Environment variables

This app reads Supabase credentials from environment variables:

- `NG_APP_SUPABASE_URL`: Your Supabase project URL (e.g., https://xyzcompany.supabase.co)
- `NG_APP_SUPABASE_KEY`: Your Supabase anon/public key

Create a `.env` file at the project root (same directory as `package.json`) or set variables in your shell. See `.env.example` for a template.

Example `.env`:

```
NG_APP_SUPABASE_URL=https://your-project.supabase.co
NG_APP_SUPABASE_KEY=your-anon-or-service-role-key
```

Notes:
- Do not commit real keys. Use `.env` locally and CI secrets in pipelines.
- The DI token `SUPABASE_CLIENT` is provided app-wide. You can inject it in any service/component.

## Supabase client usage

Inject the client using Angular DI:

```ts
import { Component, inject } from '@angular/core';
import { SUPABASE_CLIENT } from './app/core/supabase/supabase.tokens';

@Component({
  standalone: true,
  template: `...`
})
export class Example {
  private supabase = inject(SUPABASE_CLIENT);
}
```

If the variables are not configured, the factory will throw a helpful error when the client is first used.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:3000/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
