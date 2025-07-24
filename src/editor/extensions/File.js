import { html, render } from 'lit';
import { mergeAttributes, Node } from '@tiptap/core'
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { ActiveStorageUploader } from '../ActiveStorageUploader';
import icons from '../icons';

export const uploadFile = (file, handleComplete) => {
  const handleProgress = () => {};
  const handleFailure = () => { console.log("Failed to upload file"); };

  const uploader = new ActiveStorageUploader(
    file,
    handleProgress,
    handleComplete,
    handleFailure
  )

  uploader.start()
}

// Find the placeholder in editor
function findPlaceholder(state, id) {
  let decos = placeholderPlugin.getState(state)
  let found = decos.find(null, null, spec => spec.id == id)
  return found.length ? found[0].from : null
}

// Get file icon based on file type
function getFileIcon(fileType, fileName) {
  const extension = fileName.split('.').pop()?.toLowerCase();

  // Check for specific file types
  if (fileType.startsWith('image/')) {
    return icons.get('image');
  }

  if (fileType === 'application/pdf') {
    return icons.get('file-pdf');
  }

  if (fileType.startsWith('text/') || ['txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts', 'jsx', 'tsx'].includes(extension)) {
    return icons.get('file-text');
  }

  if (['doc', 'docx'].includes(extension)) {
    return icons.get('file-word');
  }

  if (['xls', 'xlsx'].includes(extension)) {
    return icons.get('file-spreadsheet');
  }

  if (['ppt', 'pptx'].includes(extension)) {
    return icons.get('file-presentation');
  }

  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
    return icons.get('file-zip');
  }

  if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(extension)) {
    return icons.get('file-music');
  }

  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
    return icons.get('file-video');
  }

  // Default file icon
  return icons.get('file');
}

export default Node.create({
  name: 'file',
  group: 'block',
  draggable: true,

  addOptions() {
    return {
      attachmentsEnabled: true,
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      fileName: {
        default: null,
      },
      fileType: {
        default: null,
      },
      fileSize: {
        default: null,
      },
      signedId: {
        default: null,
      },
      id: {
        default: null,
      },
      width: {
        default: "100%",
        parseHTML: (element) =>
          element.style.width.includes("%") ? element.style.width : "100%",
      }
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { class: "file-attachment" })];
  },

  parseHTML() {
    return [{ tag: "div.file-attachment" }];
  },

  addStorage() {
    return {
      uploads: [],
    };
  },

  addCommands() {
    return {
      setFileWidth: (width) => ({ commands }) => {
        return commands.updateAttributes(this.name, { width });
      },
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const { signedId, fileName, fileType, fileSize, src, width } = node.attrs;
      const previewUrl = `/attachments/previews/${signedId}`;
      const downloadUrl = `/attachments/downloads/${signedId}`;

      const template = html`
      <div class="file-upload">
        <a href="${downloadUrl}" download="${fileName}" class="file-download no-legacy flex-col items-center text-center h-24 w-24">
          <img src="${previewUrl}" alt="${fileName}" class="file-preview">
        </a>
        <div class="file-name">
          ${fileName}
        </div>
      </div>
      `;

      // Scratch element to render into.
      const scratch = document.createElement("div");
      render(template, scratch);

      const dom = scratch.firstElementChild;

      return {
        dom,
        update(node) {
          if (node.type.name !== "file") return false;
          return false;
        },
      };
    };
  },

  addProseMirrorPlugins() {
    const { editor } = this;
    const { schema }  = editor;

    return [
      placeholderPlugin,
      new Plugin({
        key: new PluginKey('file'),
        props: {
          handlePaste: (view, event) => {
            if (!this.options.attachmentsEnabled) return false;

            event.preventDefault();

            const files = Array.from(event.clipboardData.files).filter((file) => {
              // Accept all files, not just images
              return true;
            });

            Array.from(files).forEach((file) => {
              // A fresh object to act as the ID for this upload
              let id = {};

              // Replace the selection with a placeholder
              let tr = view.state.tr;
              if (!tr.selection.empty) tr.deleteSelection();

              tr.setMeta(placeholderPlugin, {add: {id, pos: tr.selection.from}, file: file});
              view.dispatch(tr)

              const onUploadComplete = (attrs, completedUpload) => {
                                  const payload = {
                    signedId: attrs.signedId,
                    fileName: completedUpload.file.name,
                    fileType: completedUpload.file.type,
                    fileSize: formatFileSize(completedUpload.file.size),
                    src: `/rails/active_storage/blobs/redirect/${attrs.signedId}/${completedUpload.file.name}`,
                    id: attrs.id,
                  };

                view.dispatch(
                  view.state.tr.replaceWith(view.state.history$.prevRanges[0], view.state.history$.prevRanges[1], schema.nodes.file.create(payload))
                    .setMeta(placeholderPlugin, {remove: {id}})
                )
              }

              uploadFile(file, onUploadComplete);

            });
          },
          handleDrop: (view, event, _sliced, _moved) => {
            if (!this.options.attachmentsEnabled) return false;

            event.preventDefault();
            const files = Array.from(event.dataTransfer.files).filter((file) => {
              // Accept all files, not just images
              return true;
            });

            Array.from(files).forEach((file) => {
              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });

              // A fresh object to act as the ID for this upload
              let id = {};

              // Replace the selection with a placeholder
              let tr = view.state.tr;
              if (!tr.selection.empty) tr.deleteSelection();

              tr.setMeta(placeholderPlugin, {add: {id, pos: coordinates.pos}, file: file})
              view.dispatch(tr)

              const onUploadComplete = (attrs, completedUpload) => {
                  let pos = findPlaceholder(
                    view.state,
                    id
                  );
                  if (pos == null) return;

                  const payload = {
                    signedId: attrs.signedId,
                    fileName: completedUpload.file.name,
                    fileType: completedUpload.file.type,
                    fileSize: formatFileSize(completedUpload.file.size),
                    src: `/rails/active_storage/blobs/redirect/${attrs.signedId}/${completedUpload.file.name}`,
                    id: attrs.id,
                  };

                  view.dispatch(
                    view.state.tr.replaceWith(pos, pos, schema.nodes.file.create(payload))
                      .setMeta(placeholderPlugin, {remove: {id}})
                  )
                }

                uploadFile(file, onUploadComplete)
            });
          },
        },
      }),
    ];
  },

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
});

let placeholderPlugin = new Plugin({
  state: {
    init() { return DecorationSet.empty },
    apply(tr, set) {
      // Adjust decoration positions to changes made by the transaction
      set = set.map(tr.mapping, tr.doc)
      // See if the transaction adds or removes any placeholders
      let action = tr.getMeta(this)
      if (action && action.add) {
        let widget = document.createElement("div")
        let icon = document.createElement('div');
        widget.classList = "file-uploading";
        icon.innerHTML = getFileIcon(action.file.type, action.file.name).strings[0];
        widget.appendChild(icon);
        let deco = Decoration.widget(action.add.pos, widget, {id: action.add.id})
        set = set.add(tr.doc, [deco])
      } else if (action && action.remove) {
        set = set.remove(set.find(null, null,
                                    spec => spec.id == action.remove.id))
      }
      return set
    }
  },
  props: {
    decorations(state) { return this.getState(state) }
  }
});
