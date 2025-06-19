# Ptah Chamber

**Ptah Chamber** is a custom WordPress plugin designed to register and manage custom Elementor widgets.

## Features

- Easy integration with Elementor.
- Custom widgets including:
  - Age Approval
  - Promo Grid
  - Example Widget
- Built with modern tooling: Vite, PostCSS, and CSS Modules.
- Assets organized for maintainability: images, JavaScript, and CSS.

## Project Structure

```
ptah-chamber/
├── assets/              # Source images, JS, and styles
├── dist/                # Compiled CSS and JS files
├── utils/               # Helper scripts for Elementor integration
├── widgets/             # Custom Elementor widget definitions
├── ptah-chamber.php     # Main plugin file
├── postcss.config.cjs   # Postcss configuration
├── vite.config.js       # Build configuration
├── package.json         # Project dependencies and scripts
```

## Development

To start development and watch for changes:

```bash
npm install
npm run dev
```

To build production assets:

```bash
npm run build
```

## Notes

- Requires Elementor installed and activated.
- Make sure to place the plugin in the `wp-content/plugins` directory and activate it from the WordPress admin.