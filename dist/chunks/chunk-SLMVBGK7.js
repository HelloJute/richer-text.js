// src/styles/richerTextEditorStyles.js
import { css } from "lit";
var richerTextEditorStyles = css`
  :host {
    display: block;
    container: richer-text-editor-host / inline-size;

    /* Theme: light | dark */
    --theme: "light";

    /* Editor wrapper */
    --border-color: #e5e7eb;
    --border-radius: 0.25rem;
    --border-width: 1px;
    --background-color: #ffffff;
    --text-color: #1f2937;

    /* Editor toolbar */
    --toolbar-button-radius: 0.375rem;
    --toolbar-button-size: 2.25rem;
    --toolbar-button-background: #ffffff;
    --toolbar-button-background-active: #ffffff;
    --toolbar-button-background-hover: #e5e7eb;
    --toolbar-button-fill: #030712;
    --toolbar-button-fill-active: #030712;
    --toolbar-button-fill-hover: #030712;
    --toolbar-divider-color: #d1d5db;
    --toolbar-background: #ffffff;
    --toolbar-padding: 0.2rem;
    --toolbar-gap: 0.25rem;

    --callout-gray-background-color: #f3f4f6;
    --callout-gray-text-color: #1f2937;
    --callout-gray-border-color: #e5e7eb;

    --callout-blue-background-color: #ebf8ff;
    --callout-blue-text-color: #2563eb;
    --callout-blue-border-color: #93c5fd;

    --callout-green-background-color: #f0fdf4;
    --callout-green-text-color: #065f46;
    --callout-green-border-color: #06d6a0;

    --callout-yellow-background-color: #fffbeb;
    --callout-yellow-text-color: #7d6600;
    --callout-yellow-border-color: #f9ca24;
  }

  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }

  :host([readonly]) {
    opacity: 0.5;
    pointer-events: none;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    background-color: var(--background-color);
    border-radius: var(--border-radius);
    color: var(--text-color);
  }

  ::slotted([slot='editor']) {
    /* !important because of tailwindcss wildcard: border-width: 0 */
    border: var(--border-width) solid var(--border-color) !important;
    border-radius: var(--border-radius);
  }

  :host([toolbar-placement='top']) ::slotted([slot='editor']) {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  :host([toolbar-placement='bottom']) ::slotted([slot='editor']) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  role-toolbar::part(base) {
    display: flex;
    align-items: center;
    gap: var(--toolbar-gap);
    flex: 0 0 auto;
    flex-wrap: wrap;
    background-color: var(--toolbar-background);
    padding: var(--toolbar-padding);
    border: 1px solid var(--border-color);
  }

  :host([toolbar-placement='top']) .toolbar {
    border-bottom: 0;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  :host([toolbar-placement='bottom']) .toolbar {
    border-top: 0;
    border-radius: 0;
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    order: 1;
  }

  .toolbar-button {
    display: flex;
    align-items: center;
    height: var(--toolbar-button-size);
    width: var(--toolbar-button-size);
    cursor: pointer;
    border: 0;
    border-radius: var(--toolbar-button-radius);
    background-color: var(--toolbar-button-background);
    transition: all 0.2s;
    fill: var(--toolbar-button-fill);
  }

  .toolbar-button.is-active {
    fill: var(--toolbar-button-fill-active);
    background-color: var(--toolbar-button-background-active);
    box-shadow: 0 0 0 1px var(--border-color);
  }

  @media (hover: hover) {
    .toolbar-button:hover {
      fill: var(--toolbar-button-fill-hover);
      background-color: var(--toolbar-button-background-hover);
    }
  }

  .toolbar-button:focus {
    outline: none;
  }

  .toolbar-button svg {
    width: 80%;
    height: 80%;
  }

  .divider {
    width: 1px;
    height: calc(var(--toolbar-button-size) * 0.5);
    background-color: var(--toolbar-divider-color);
    margin-left: var(--toolbar-gap);
    margin-right: var(--toolbar-gap);
  }

  .spacer {
    // Take up all the free space
    flex: 1;
    flex-grow: 1;
  }

  /* File attachment styles */
  .file-attachment {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 0.75rem;
    margin: 0.5rem 0;
    background-color: #f9fafb;
  }

  .file-attachment-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .file-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background-color: #ffffff;
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
  }

  .file-icon svg {
    width: 1.5rem;
    height: 1.5rem;
    color: #6b7280;
  }

  .file-info {
    flex: 1;
    min-width: 0;
  }

  .file-name {
    font-weight: 500;
    color: var(--text-color);
    margin-bottom: 0.25rem;
    word-break: break-word;
  }

  .file-meta {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .file-actions {
    flex-shrink: 0;
  }

  .file-download {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    background-color: #ffffff;
    color: #6b7280;
    text-decoration: none;
    transition: all 0.2s;
  }

  .file-download:hover {
    background-color: var(--toolbar-button-background-hover);
    color: var(--text-color);
  }

  .file-download svg {
    width: 1rem;
    height: 1rem;
  }

  .file-uploading {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 0.75rem;
    margin: 0.5rem 0;
    background-color: #f9fafb;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .file-uploading > div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background-color: #ffffff;
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
  }

  .file-uploading svg {
    width: 1.5rem;
    height: 1.5rem;
    color: #6b7280;
  }

  /* Dark Mode styles */
  // @media (prefers-color-scheme: dark) {
  //   :host {
  //   }
  // }
`;

export {
  richerTextEditorStyles
};
//# sourceMappingURL=chunk-SLMVBGK7.js.map
