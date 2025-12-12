# Sidebar Highlight Feature

This document explains how to use the sidebar highlight feature that adds a blue dot indicator next to pages in the sidebar.

## Overview

The highlight feature allows you to mark specific pages in the sidebar with a small blue dot indicator, making them stand out and drawing attention to important or featured content.

## Usage

To highlight a page in the sidebar, simply add `highlight: true` to the page's frontmatter:

```mdx
---
title: "Your Page Title"
description: "Your page description"
highlight: true
---

Your page content here...
```

## How It Works

The feature is implemented using the Fumadocs Loader Plugins API, which is the recommended approach for customizing the page tree.

### Components

1. **Frontmatter Schema Extension** (`source.config.ts`)
   - The `highlight` field is added to the frontmatter schema as a boolean with a default value of `false`

2. **Loader Plugin** (`src/lib/source.tsx`)
   - A custom `highlightPlugin` uses the `transformPageTree.file` hook
   - During page tree generation, the plugin accesses each file's frontmatter data via `this.storage.read(filePath)`
   - For pages with `highlight: true`, the page name is wrapped with a blue dot indicator

3. **Layout Integration** (`src/app/docs/layout.tsx`)
   - The page tree (with highlight indicators already applied) is passed to the `DocsLayout` component

### Why Loader Plugins?

The Loader Plugins API is the official Fumadocs approach for customizing the page tree. Benefits include:

- **Single-pass transformation** - Changes happen during page tree generation, not as a separate post-processing step
- **Direct file access** - The `this.storage.read()` method provides direct access to file data without needing URL lookups
- **Official API** - Uses documented hooks designed for this purpose
- **Better maintainability** - Follows Fumadocs conventions and will be supported in future versions

## Visual Appearance

The blue dot indicator:
- Appears to the right of the page name in the sidebar
- Has a 6px diameter
- Uses the color `#3b82f6` (blue-500)
- Includes an 8px left margin for spacing
- Has a "Highlighted" title attribute for accessibility

## Customization

To customize the appearance of the highlight indicator, modify the inline styles in the `highlightPlugin` in `src/lib/source.tsx`:

```tsx
<span
  style={{
    marginLeft: "8px",        // Spacing from page name
    display: "inline-block",
    width: "6px",             // Dot size
    height: "6px",            // Dot size
    borderRadius: "50%",      // Makes it circular
    backgroundColor: "#3b82f6", // Dot color (blue-500)
  }}
  title="Highlighted"
/>
```

You can change:
- `backgroundColor` - to use a different color
- `width` and `height` - to make the dot larger or smaller
- `marginLeft` - to adjust spacing
- Add additional styling like box-shadow for visual effects

## Implementation Reference

Here's the core plugin implementation:

```tsx
import type { LoaderPlugin } from "fumadocs-core/source";

const highlightPlugin: LoaderPlugin = {
  name: "highlight",
  transformPageTree: {
    file(node, filePath) {
      if (!filePath) return node;

      const fileData = this.storage.read(filePath);
      const data = fileData?.data as { highlight?: boolean } | undefined;

      if (data?.highlight) {
        return {
          ...node,
          name: (
            <>
              {node.name}
              <span style={{ /* styles */ }} title="Highlighted" />
            </>
          ),
        };
      }
      return node;
    },
  },
};
```

## Notes

- The highlight feature works with Fumadocs v16+
- The feature uses the modern Loader Plugins API with `transformPageTree.file` hook
- The highlight indicator is rendered as part of the page tree, so it appears consistently across all navigation elements
- Setting `highlight: false` or omitting the field entirely will result in no indicator being shown

## References

- [Fumadocs Loader API](https://fumadocs.dev/docs/headless/source-api)
- [Fumadocs Loader Plugins](https://fumadocs.dev/docs/headless/source-api/plugins)