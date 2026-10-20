import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte(), {
    name: 'inline-initial-styles',
    transformIndexHtml: {
      order: 'post',
      handler(html, context) {
        return html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, (tag) => {
          const href = tag.match(/href="([^"]+)"/)?.[1];
          const asset = Object.values(context.bundle ?? {}).find(
            (entry) => entry.type === 'asset' && href?.endsWith(entry.fileName)
          );
          return asset?.type === 'asset' ? `<style>${asset.source}</style>` : tag;
        });
      }
    }
  }],
});
