/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Bold, Italic, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { FontBackgroundColor, FontColor, FontFamily, FontSize } from '@ckeditor/ckeditor5-font';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Image, ImageInsert, ImageUpload } from '@ckeditor/ckeditor5-image';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Table } from '@ckeditor/ckeditor5-table';

// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

class Editor extends ClassicEditor {
	public static override builtinPlugins = [
		Alignment,
		Bold,
		Essentials,
		FontBackgroundColor,
		FontColor,
		FontFamily,
		FontSize,
		Heading,
		Image,
		ImageInsert,
		ImageUpload,
		Italic,
		Link,
		List,
		MediaEmbed,
		Paragraph,
		Table,
		Underline
	];

	public static override defaultConfig = {
		toolbar: {
			items: [
				'undo',
				'redo',
				'|',
				'fontSize',
				'heading',
				'|',
				'bold',
				'italic',
				'underline',
				'fontColor',
				'fontBackgroundColor',
				'fontFamily',
				'|',
				'link',
				'imageInsert',
				'mediaEmbed',
				'insertTable',
				'|',
				'alignment',
				'numberedList',
				'bulletedList'
			]
		},
		language: 'en'
	};
}

export default Editor;
