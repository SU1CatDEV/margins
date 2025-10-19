import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath, URL } from 'url';

console.log(path.resolve(__dirname, './resources/js/pdf.js/src/'))
export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx', 'resources/js/pdf.js/web/viewer.js'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: [
                {find: 'pdfjs', replacement: fileURLToPath(new URL('./resources/js/pdf.js/src', import.meta.url)) },
                {find: 'pdfjs-lib', replacement: fileURLToPath(new URL('./resources/js/pdf.js/src/pdf.js', import.meta.url)) },
                {find: 'pdfjs-web', replacement: fileURLToPath(new URL('./resources/js/pdf.js/web/', import.meta.url)) },

                {find: "fluent-bundle", replacement: fileURLToPath(new URL("./resources/js/pdf.js/node_modules/@fluent/bundle/esm/index.js", import.meta.url)) },
                {find: "fluent-dom", replacement: fileURLToPath(new URL("./resources/js/pdf.js/node_modules/@fluent/dom/esm/index.js", import.meta.url)) },
                {find: "cached-iterable", replacement: fileURLToPath(new URL("./resources/js/pdf.js/node_modules/cached-iterable/src/index.mjs", import.meta.url)) },

                {find: "display-cmap_reader_factory", replacement: fileURLToPath(new URL("./resources/js/pdf.js/src/display/cmap_reader_factory.js", import.meta.url)) },
                {find: "display-standard_fontdata_factory", replacement: fileURLToPath(new URL("./resources/js/pdf.js/src/display/standard_fontdata_factory.js", import.meta.url)) },
                {find: "display-wasm_factory", replacement: fileURLToPath(new URL("./resources/js/pdf.js/src/display/wasm_factory.js", import.meta.url)) },
                {find: "display-fetch_stream", replacement: fileURLToPath(new URL("./resources/js/pdf.js/src/display/fetch_stream.js", import.meta.url)) },
                {find: "display-network", replacement: fileURLToPath(new URL("./resources/js/pdf.js/src/display/network.js", import.meta.url)) },
                {find: "display-node_stream", replacement: fileURLToPath(new URL("./resources/js/pdf.js/src/display/stubs.js", import.meta.url)) },
                {find: "display-node_utils", replacement: fileURLToPath(new URL("./resources/js/pdf.js/src/display/stubs.js", import.meta.url)) },

                {find: "web-alt_text_manager", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/alt_text_manager.js", import.meta.url)) },
                {find: "web-annotation_editor_params", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/annotation_editor_params.js", import.meta.url)) },
                {find: "web-download_manager", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/download_manager.js", import.meta.url)) },
                {find: "web-external_services", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/genericcom.js", import.meta.url)) },
                {find: "web-new_alt_text_manager", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/new_alt_text_manager.js", import.meta.url)) },
                {find: "web-null_l10n", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/genericl10n.js", import.meta.url)) },
                {find: "web-pdf_attachment_viewer", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/pdf_attachment_viewer.js", import.meta.url)) },
                {find: "web-pdf_cursor_tools", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/pdf_cursor_tools.js", import.meta.url)) },
                {find: "web-pdf_document_properties", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/pdf_document_properties.js", import.meta.url)) },
                {find: "web-pdf_find_bar", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/pdf_find_bar.js", import.meta.url)) },
                {find: "web-pdf_layer_viewer", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/pdf_layer_viewer.js", import.meta.url)) },
                {find: "web-pdf_outline_viewer", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/pdf_outline_viewer.js", import.meta.url)) },
                {find: "web-pdf_presentation_mode", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/pdf_presentation_mode.js", import.meta.url)) },
                {find: "web-pdf_sidebar", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/pdf_sidebar.js", import.meta.url)) },
                {find: "web-pdf_thumbnail_viewer", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/pdf_thumbnail_viewer.js", import.meta.url)) },
                {find: "web-preferences", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/genericcom.js", import.meta.url)) },
                {find: "web-print_service", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/pdf_print_service.js", import.meta.url)) },
                {find: "web-secondary_toolbar", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/secondary_toolbar.js", import.meta.url)) },
                {find: "web-signature_manager", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/signature_manager.js", import.meta.url)) },
                {find: "web-toolbar", replacement: fileURLToPath(new URL("./resources/js/pdf.js/web/toolbar.js", import.meta.url)) },
        ]
   }
});

// commands to get this thing running:
// php artisan serve
// php artisan reverb:start
// php artisan autosave:run
// npm run dev