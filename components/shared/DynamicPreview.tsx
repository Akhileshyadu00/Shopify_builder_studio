"use client";

import { useEffect, useRef } from "react";

interface DynamicPreviewProps {
  code: string; // Single block code
  className?: string;
}

export function DynamicPreview({ code, className }: DynamicPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    // --- MODE DETECTION ---
    const isReact = code.includes("import React") || code.includes("export default function") || code.includes("return (");
    const isCSS = !code.includes("<") && code.includes("{") && code.includes(":") && !code.includes("schema");

    let finalContent = "";

    if (isReact) {
      // --- REACT MODE ---
      // We need to transform the code to be runnable in the browser via Babel
      // 1. Remove imports (browsers can't handle them easily in this context without import maps, mostly unrelated for single file components)
      let cleanCode = code.replace(/import.*?from.*?;/g, "");

      // 2. Change 'export default function X' to 'function X' and render it
      const componentNameMatch = cleanCode.match(/export\s+default\s+function\s+(\w+)/);
      const componentName = componentNameMatch ? componentNameMatch[1] : "App";
      cleanCode = cleanCode.replace(/export\s+default\s+function/, "function");

      finalContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
              <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { margin: 0; padding: 0; font-family: sans-serif; }
                ::-webkit-scrollbar { width: 0px; background: transparent; }
              </style>
            </head>
            <body>
              <div id="root"></div>
              <script type="text/babel">
                // lucide-react mock because we can't import it easily
                const LucideIcons = new Proxy({}, {
                    get: (target, prop) => (props) => {
                        return <span style={{display:'inline-block', border:'1px solid currentColor', width:24, height:24, borderRadius:4, textAlign:'center'}}>i</span>
                    }
                });
                
                ${cleanCode}

                const root = ReactDOM.createRoot(document.getElementById('root'));
                // Try to render the identified component
                try {
                    root.render(<${componentName} />);
                } catch (e) {
                    document.body.innerHTML = '<div style="color:red; padding:20px;">Runtime Error: ' + e.message + '</div>';
                }
              </script>
            </body>
          </html>
        `;

    } else if (isCSS) {
      // --- CSS MODE ---
      finalContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { margin: 0; padding: 20px; font-family: sans-serif; }
                /* User CSS */
                ${code}
              </style>
            </head>
            <body>
              <div class="demo-box">
                <h1>CSS Preview</h1>
                <p>Content to demonstrate styles.</p>
                <button>Button</button>
                <div class="card">Card Element</div>
              </div>
            </body>
          </html>
        `;
    } else {
      // --- LIQUID / HTML MODE (Existing Logic) ---

      // --- 1. Extract Schema & Styles & JS ---
      const settings: Record<string, any> = {};
      const blocksSchema: Record<string, any> = {};
      const schemaMatch = code.match(/{% schema %}([\s\S]*?){% endschema %}/);

      if (schemaMatch) {
        try {
          const schemaJson = JSON.parse(schemaMatch[1]);
          if (schemaJson.settings) {
            schemaJson.settings.forEach((setting: any) => {
              if (setting.id && setting.default !== undefined) {
                settings[setting.id] = setting.default;
              }
            });
          }
          if (schemaJson.blocks) {
            schemaJson.blocks.forEach((block: any) => {
              const blockDefaults: Record<string, any> = {};
              if (block.settings) {
                block.settings.forEach((s: any) => {
                  if (s.id && s.default !== undefined) {
                    blockDefaults[s.id] = s.default;
                  }
                });
              }
              blocksSchema[block.type] = blockDefaults;
            });
          }
        } catch (e) {
          console.error("Schema parse error", e);
        }
      }

      const styleMatch = code.match(/{% stylesheet %}([\s\S]*?){% endstylesheet %}/) || code.match(/<style>([\s\S]*?)<\/style>/);
      const extractedCss = styleMatch ? styleMatch[1] : "";

      const jsMatch = code.match(/{% javascript %}([\s\S]*?){% endjavascript %}/) || code.match(/<script>([\s\S]*?)<\/script>/);
      const extractedJs = jsMatch ? jsMatch[1] : "";

      let extractedHtml = code
        .replace(/{% stylesheet %}[\s\S]*?{% endstylesheet %}/g, "")
        .replace(/<style>[\s\S]*?<\/style>/g, "")
        .replace(/{% javascript %}[\s\S]*?{% endjavascript %}/g, "")
        .replace(/<script>[\s\S]*?<\/script>/g, "")
        .replace(/{% schema %}[\s\S]*?{% endschema %}/g, "");

      // --- 2. Advanced Mocking Engine ---
      // Updated Regex: Matches parameters after 'section.blocks' like 'limit: 3', 'reversed', etc.
      const loopRegex = /{%[-]?\s*for\s+(\w+)\s+in\s+section\.blocks.*?[-]?%}([\s\S]*?){%[-]?\s*endfor\s*[-]?%}/g;

      extractedHtml = extractedHtml.replace(loopRegex, (match, loopVar, loopBody) => {
        const blockTypes = Object.keys(blocksSchema);
        let generatedContent = "";
        const iterations = blockTypes.length > 0 ? blockTypes.length : 3;
        for (let i = 0; i < iterations; i++) {
          let itemHtml = loopBody;
          const blockType = blockTypes[i] || 'unknown';
          const defaults = blocksSchema[blockType] || {};
          Object.keys(defaults).forEach(key => {
            const val = defaults[key];
            const r = new RegExp(`{{\\s*${loopVar}\\.settings\\.${key}\\s*}}`, 'g');
            itemHtml = itemHtml.replace(r, val);
          });
          const cleanupRegex = new RegExp(`{{\\s*${loopVar}\\.settings\\.\\w+\\s*}}`, 'g');
          itemHtml = itemHtml.replace(cleanupRegex, "Lorem Ipsum");
          generatedContent += itemHtml;
        }
        return generatedContent;
      });

      Object.keys(settings).forEach(key => {
        const val = settings[key];
        const regex = new RegExp(`{{\\s*section\\.settings\\.${key}\\s*}}`, 'g');
        const escapeRegex = new RegExp(`{{\\s*section\\.settings\\.${key}\\s*\\|\\s*escape\\s*}}`, 'g');
        extractedHtml = extractedHtml.replace(regex, val).replace(escapeRegex, val);
      });

      extractedHtml = extractedHtml.replace(/{{\s*['"].*?['"]\s*\|\s*asset_url\s*}}/g, "https://placehold.co/600x400/EEE/31343C?text=Asset");
      extractedHtml = extractedHtml.replace(/{{\s*.*?\|\s*image_url.*?\s*}}/g, "https://placehold.co/600x400/EEE/31343C?text=Image");
      extractedHtml = extractedHtml.replace(/{{\s*.*?\|\s*placeholder_svg_tag.*?\s*}}/g, '<div style="background:#eee;width:100%;height:100%;min-height:200px;display:flex;align-items:center;justify-content:center;color:#888;">Placeholder SVG</div>');
      extractedHtml = extractedHtml.replace(/{{\s*.*?\|\s*money.*?\s*}}/g, "$19.99");
      extractedHtml = extractedHtml.replace(/{{\s*['"](.*?)['"]\s*\|\s*t\s*}}/g, (match, key) => {
        const parts = key.split('.');
        return parts[parts.length - 1].replace(/_/g, ' ');
      });

      extractedHtml = extractedHtml.replace(/{{\s*section\.id\s*}}/g, "custom-preview-123");

      extractedHtml = extractedHtml.replace(/{%\s*render\s*['"](.*?)['"].*?%}/g, (match, snippet) => {
        if (snippet.includes('icon')) {
          return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:24px;height:24px;display:inline-block;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg><!-- Snippet: ${snippet} -->`;
        }
        return `<!-- Rendered Snippet: ${snippet} -->`;
      });

      extractedHtml = extractedHtml.replace(/{%\s*form\s*.*?%}/g, '<form action="#" method="post" onsubmit="event.preventDefault(); alert(\'Form submitted (Preview)\');">');
      extractedHtml = extractedHtml.replace(/{%\s*endform\s*%}/g, '</form>');
      extractedHtml = extractedHtml.replace(/{%\s*assign\s+.*?%}/g, "");
      extractedHtml = extractedHtml.replace(/{%\s*capture\s+.*?%}([\s\S]*?){%\s*endcapture\s*%}/g, "");
      extractedHtml = extractedHtml.replace(/{%\s*case\s+.*?%}/g, "");
      extractedHtml = extractedHtml.replace(/{%\s*when\s+.*?%}/g, "");
      extractedHtml = extractedHtml.replace(/{%\s*else\s*%}/g, "");
      extractedHtml = extractedHtml.replace(/{%\s*endcase\s*%}/g, "");

      extractedHtml = extractedHtml.replace(/{%[\s\S]*?%}/g, "");
      extractedHtml = extractedHtml.replace(/{{[\s\S]*?}}/g, "");

      finalContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { margin: 0; padding: 0; font-family: sans-serif; }
                ::-webkit-scrollbar { width: 0px; background: transparent; }
                ${extractedCss}
              </style>
            </head>
            <body>
              ${extractedHtml}
              <script>
                try {
                    ${extractedJs}
                } catch(e) { console.log('Preview JS Error', e) }
                
                document.addEventListener('click', (e) => {
                    if(e.target.tagName === 'A') {
                        e.preventDefault();
                    }
                });
              </script>
            </body>
          </html>
        `;
    }

    doc.open();
    doc.write(finalContent);
    doc.close();
  }, [code]);

  return (
    <div className={`w-full h-full bg-white relative ${className}`}>
      <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded z-10 font-mono opacity-50 hover:opacity-100 transition-opacity pointer-events-none">
        {code.includes("import React") || code.includes("export default function") || code.includes("return (") ? "React Mode" : (code.includes("{") && !code.includes("<") && code.includes(":") && !code.includes("schema")) ? "CSS Mode" : "Liquid Mode"}
      </div>
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        title="Preview"
        sandbox="allow-scripts allow-modals allow-same-origin"
      />
    </div>
  );
}
