/**

*/

(function($) {
	'use strict'
	var WEBEDITOR = {
		defaults: {
			width: 700,
			height: 500,
		},
		
		mainSep: '<div class="we-main-sep"/>"',
		menu: '<div class="we-menu"/>',
		editArea: '<div class="we-edit-area" onClick="this.contentEditable=\'true\';"></div>',
		
		init: function (element, options) {
			this.$ctnr = $(element);
			this.$menu = $(this.menu);
			this.$mainSep = $(this.mainSep);
			this.$editArea = $(this.editArea);
			var ctnrWidth = this.$ctnr.css('width');
			var ctnrHeight = this.$ctnr.css('height');
			this.options = $.extend({'width': ctnrWidth, 'height': ctnrHeight}, this.defaults, options);

			/* caculate the width and height of menu bar. I set 1px border for menu, */
			var menuWidth = this.options.width - 2;
			var menuHeight = this.options.height - 2;
			this.options = $.extend({}, this.options, {'menuWidth': menuWidth, 'menuHeight': menuHeight});
		},
		
		initLayout: function() {
			this.initMenu();	
		},
		
		initMenu: function () {
			var $menu = this.$menu;
			// $menu.css('width', this.options.menuWidth).css('height', this.options.menuHeight);
		},
		
	};
	
	$.fn.webeditor = function(options) {
		return this.each(function() {
			var we = $.extend(options, WEBEDITOR);
			we.init(this, options);
			}
		);
	};
})(jQuery);