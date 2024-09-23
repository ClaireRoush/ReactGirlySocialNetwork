import Quill from 'quill';

const BaseTheme = Quill.import('core/theme');

class CustomThemeForQuill extends BaseTheme {
  constructor(quill, options) {
    super(quill, options);
  }
}

Quill.register('themes/my-theme', CustomThemeForQuill);
