/**

*/

(function($) {
	'use strict'
	var WEBEDITOR = {
		defaults: {
			width: 700,
			height: 500,
			menuWidth: 700,
			menuHeight: 55,
		},
		
		mainSep: '<div class="we-main-sep"/>',
		menu: '<div class="we-menu"/>',
		editArea: '<div class="we-edit-area" onClick="this.contentEditable=\'true\';"></div>',
		
		init: function (element, options) {
			this.$ctnr = $(element);
			this.$menu = $(this.menu);
			this.$mainSep = $(this.mainSep);
			this.$editArea = $(this.editArea);

			this.options = $.extend(this.defaults, options);
			this.initLayout();
		},
		
		initLayout: function() {
			var $ctnr = this.$ctnr;
			$ctnr.addClass("we-container")
				 .append(this.initMenu())
				 .append(this.$mainSep)
				 .append(this.$editArea);
		},
		
		initMenuUtils: {				
			getArrow: function() {
				return this.getMenuIcon().addClass("arrow");	
			},
			
			getSep: function() {
				return this.getMenuItem().addClass("we-menu-sep");
			},
			
			getItemTitle: function(title) {
				return this.getDiv(title).addClass("we-menu-title");	
			},
			
			getMenuItem: function()	{
				return this.getDiv().addClass("we-menu-item");	
			},
			
			getMenuIcon: function() {
				return this.getDiv().addClass("we-menu-icon");
			},
			
			getDiv: function(content) {
				var div = $("<div></div>");	
				if(content) {
					return div.text(content + "");	
				}
				
				return div;
			},
			
			initItem: function(ele, classes, id) {
				if(id) {
					ele.attr('id', id);
				}
				
				for(var i in classes) {
					ele.addClass(classes[i]);	
				}
				
				return ele;
			},
			
			addClueMsg: function(ele, msg) {
				var getdiv = this.getDiv;
				ele.hover(
					function() {
						var marginLeft = parseInt($(this).css("margin-left")),
						marginTop = parseInt($(this).css("margin-top")),
						width = parseInt($(this).css("width")),
						height = parseInt($(this).css("height")),
						position = $(this).position(),
						left = position.left,
						top = position.top;
						var leftOffset = left + marginLeft;
						var topOffset = top + marginTop + height + 5;
						var clue = getdiv(msg).addClass("menu-clue").css("left", leftOffset + "px").css("top", topOffset + "px").appendTo($(this).parent());
						var clueWidth = parseInt(clue.css('width'))
						leftOffset = leftOffset + clueWidth / 3;
						topOffset = topOffset - 3;
						getdiv().addClass("menu-clue-arrow-up").css("left", leftOffset + "px").css("top", topOffset + "px").appendTo($(this).parent());
					}, 
					function() {
						$("div[class|=menu-clue]", $(this).parent()).remove();
					}
				);
			},
			
			getMenuCat: function() {
				var id = 'menu-cat';
				var menuCat = this.initItem(this.getMenuItem(), ['we-menu-cat', 'we-menu-item-border'], id);
				this.getItemTitle("Normal").css("left", "1px").appendTo(menuCat);
				this.getArrow().appendTo(menuCat);
				
				this.addClueMsg(menuCat, '标题');
				return menuCat;
			},
			
			getMenuFontFamily: function() {
				var id = "menu-font-family";
				var menuFontFamily = this.initItem(this.getMenuItem(), ['we-menu-font', 'we-menu-item-border'], id);
				this.getItemTitle("Arial").appendTo(menuFontFamily);
				this.getArrow().appendTo(menuFontFamily);
				
				this.addClueMsg(menuFontFamily, '字体样式');
				return menuFontFamily;
			},
			
			getMenuFontSize: function() {
				var id = "menu-font-size";
				var menuFontSize = this.initItem(this.getMenuItem(), ['we-menu-size', 'we-menu-item-border'], id);
				this.getItemTitle("12").appendTo(menuFontSize);
				this.getArrow().appendTo(menuFontSize);
				
				this.addClueMsg(menuFontSize, '字体大小');
				return menuFontSize;
			},
			
			getMenuBold: function() {
				var id = "menu-font-b";	
				var b = this.initItem(this.getMenuItem(), ['b'], id);
				this.getMenuIcon().addClass("b-icon").appendTo(b);
				
				this.addClueMsg(b, '粗体');
				return b;
			},
			
			getMenuItalic: function() {
				var id = "menu-font-i";	
				var i = this.initItem(this.getMenuItem(), ['i'], id);
				this.getMenuIcon().addClass("i-icon").appendTo(i);
				
				this.addClueMsg(i, '斜体');
				return i;
			},
			
			getMenuUnderline: function() {
				var id = "menu-font-u";	
				var u = this.initItem(this.getMenuItem(), ['u'], id);
				this.getMenuIcon().addClass("u-icon").appendTo(u);
				
				this.addClueMsg(u, '下划线');
				return u;
			},
			
			getMenuFontColor: function() {
				var id = "menu-font-color";	
				var fontColor = this.initItem(this.getMenuItem(), ['font-color', 'we-menu-item-border'], id);
				this.getMenuIcon().addClass("fc-icon").appendTo(fontColor);
				this.getArrow().appendTo(fontColor);
				
				this.addClueMsg(fontColor, '字体颜色');
				return fontColor;
			},
			
			getMenuFontBgColor: function() {
				var id = "menu-font-bg-color";	
				var fontBgColor = this.initItem(this.getMenuItem(), ['font-bg-color', 'we-menu-item-border'], id);
				this.initItem(this.getDiv(), ["font-bg-icon", "bg-title"]).appendTo(fontBgColor);
				this.initItem(this.getDiv(), ['font-bg-icon', 'bg-arrow']).appendTo(fontBgColor);
				
				this.addClueMsg(fontBgColor, '背景颜色');
				return fontBgColor;
			},
			
			getMenuOl: function() {
				var id = "menu-ol";
				var ol = this.initItem(this.getMenuItem(), ['ol'], id);
				this.getMenuIcon().addClass("ol-icon").appendTo(ol);
				
				this.addClueMsg(ol, '有序序列');
				return ol;
			},
			
			getMenuUl: function() {
				var id = "menu-ul";
				var ul = this.initItem(this.getMenuItem(), ['ul'], id);
				this.getMenuIcon().addClass("ul-icon").appendTo(ul);
				
				this.addClueMsg(ul, '无序序列');
				return ul;
			},
			
			getMenuAlignLest: function() {
				var id = "menu-aleft";
				var aleft = this.initItem(this.getMenuItem(), ['a-left'], id);
				this.getMenuIcon().addClass("a-left-icon").appendTo(aleft);
				
				this.addClueMsg(aleft, '左对齐');
				return aleft;
			},
			
			getMenuAlignMiddle: function() {
				var id = "menu-amiddle";
				var acenter = this.initItem(this.getMenuItem(), ['a-center'], id);
				this.getMenuIcon().addClass("a-center-icon").appendTo(acenter);
				
				this.addClueMsg(acenter, '中间对齐');
				return acenter;
			},
			
			getMenuAlignRight: function() {
				var id = "menu-right";
				var aright = this.initItem(this.getMenuItem(), ['a-right'], id);
				this.getMenuIcon().addClass("a-right-icon").appendTo(aright);
				
				this.addClueMsg(aright, '右对齐');
				return aright;
			},
			
			getMenuInsertLink: function() {
				var id = "menu-alink";
				var ilink = this.initItem(this.getMenuItem(), ['i-link'], id);
				this.getMenuIcon().addClass("i-link-icon").appendTo(ilink);
				
				this.addClueMsg(ilink, '插入链接');
				return ilink;
			},
			
			getMenuInsertImg: function() {
				var id = "menu-alink";
				var iimg = this.initItem(this.getMenuItem(), ['i-img'], id);
				this.getMenuIcon().addClass("i-img-icon").appendTo(iimg);
				
				this.addClueMsg(iimg, '插入图片');
				return iimg;
			},
			
			getMenuMore: function() {
				var id = 'menu-more';
				var more = this.initItem(this.getMenuItem(), ['more'], id);
				this.getArrow().appendTo(more);
				
				this.addClueMsg(more, '更多');
				return more;
			},
		},
		
		initMenu: function () {
			var $menu = this.$menu;
			var u = this.initMenuUtils;
			var addMe = function(me) {
				$menu.append(me);
			};
			
			addMe(u.getMenuCat());
			addMe(u.getSep());
			addMe(u.getMenuFontFamily());
			addMe(u.getSep());
			addMe(u.getMenuFontSize());
			addMe(u.getSep());
			addMe(u.getMenuBold());
			addMe(u.getMenuItalic());
			addMe(u.getMenuUnderline());
			addMe(u.getMenuFontColor());
			addMe(u.getMenuFontBgColor());
			addMe(u.getSep());
			addMe(u.getMenuOl());
			addMe(u.getMenuUl());
			addMe(u.getMenuAlignLest());
			addMe(u.getMenuAlignMiddle());
			addMe(u.getMenuAlignRight());
			addMe(u.getSep());
			addMe(u.getMenuInsertLink());
			addMe(u.getMenuInsertImg());
			addMe(u.getMenuMore());
			
			return $menu;
		},
		
	};
	
	$.fn.webeditor = function(options) {
		return this.each(function() {
			var we = $.extend({}, WEBEDITOR);
			we.init(this, options);
			}
		);
	};
})(jQuery);