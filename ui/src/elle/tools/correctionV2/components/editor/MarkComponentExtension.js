import { Mark } from '@tiptap/core';
import { ReactMarkViewRenderer } from '@tiptap/react';
import MarkupComponent from './MarkupComponent.jsx';

const MarkComponentExtension = Mark.create({
  name: 'reactComponent',

  exitable: true,
  inclusive: false,

  addOptions() {
    return {
      onTextUpdate: null
    };
  },

  addAttributes() {
    return {
      'data-count': { default: 0 },
      initialText: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-initialText'),
        renderHTML: (attributes) => ({
          initialText: attributes.initialText
        })
      },
      classValue: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-classValue'),
        renderHTML: (attributes) => ({
          classValue: attributes.classValue
        })
      },
      correctedText: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-correctedText'),
        renderHTML: (attributes) => ({
          correctedText: attributes.correctedText
        })
      },
      errorType: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-errorType'),
        renderHTML: (attributes) => ({
          errorType: attributes.errorType
        })
      },
      errorId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-componentId'),
        renderHTML: (attributes) => ({
          errorId: attributes.errorId
        })
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'markup-error'
      }
    ];
  },

  onUpdate() {
    const doc = this.editor.state.doc;
    const text = doc.textBetween(0, doc.content.size, ' ');
    const innerHTML = this.editor.getHTML();

    if (this.options.onTextUpdate) {
      this.options.onTextUpdate(text, innerHTML);
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['markup-error', HTMLAttributes];
  },

  addMarkView() {
    return ReactMarkViewRenderer(MarkupComponent);
  }
});

export default MarkComponentExtension;
