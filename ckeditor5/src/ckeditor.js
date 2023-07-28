/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor.js';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily.js';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize.js';
import Image from '@ckeditor/ckeditor5-image/src/image.js';
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert.js';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import Table from '@ckeditor/ckeditor5-table/src/table.js';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline.js';

class Editor extends ClassicEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
	Alignment,
	Bold,
	Essentials,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
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

// Editor configuration.
Editor.defaultConfig = {
	toolbar: {
		items: [
			'undo',
			'redo',
			'|',
			'bold',
			'italic',
			'underline',
			'|',
			'fontBackgroundColor',
			'fontColor',
			'fontFamily',
			'fontSize',
			'|',
			'-',
			'alignment',
			'|',
			'bulletedList',
			'numberedList',
			'|',
			'imageInsert',
			'mediaEmbed',
			'insertTable',
			'|',
			'link'
		],
		shouldNotGroupWhenFull: true
	},
	language: 'en'
};

export default Editor;
