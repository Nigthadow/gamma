/**
 * a web editor implemented in the jQuery plugin way
 *  
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
		
		initMenuLayout: {	
			config: {
				title: {
					'menu-cat': {
						itemClz: ['we-menu-cat', 'we-menu-item-border'],
						titleName: ["Normal"],
						needArrow: true,
						titleCss: {'left': "1px"},
						clue: "标题选项",
					},
					'menu-font-family': {
						itemClz: ['we-menu-font', 'we-menu-item-border'],
						titleName: ["Arial"],
						needArrow: true,
						clue: "字体样式",
					},
					'menu-font-size': {
						itemClz: ['we-menu-size', 'we-menu-item-border'],
						titleName: ["12"],
						needArrow: true,
						clue: "字体大小",
					},
					'menu-font-color': {
						itemClz: ['font-color', 'we-menu-item-border'],
						titleName: ["Ac"],
						needArrow: true,
						clue: "字体颜色",
					},
					'menu-font-bg-color': {
						itemClz: ['font-bg-color', 'we-menu-item-border'],
						titleName: ["Ac"],
						needArrow: true,
						clue: "背景颜色",
					},
					"menu-more": {
						itemClz: ['more'],
						titleName: [""],
						needArrow: true,
						clue: "更多",
					},
				},
				icon: {
					"menu-font-b": {
						itemClz: ['b'],
						iconClz: ['b-icon'],
						clue: "粗体",
					},
					"menu-font-i": {
						itemClz: ['i'],
						iconClz: ['i-icon'],
						clue: "斜体",
					},
					"menu-font-u": {
						itemClz: ['u'],
						iconClz: ['u-icon'],
						clue: "下划线",
					},
					"menu-ol": {
						itemClz: ['ol'],
						iconClz: ['ol-icon'],
						clue: "有序序列",
					},
					"menu-ul": {
						itemClz: ['ul'],
						iconClz: ['ul-icon'],
						clue: "无序序列",
					},
					"menu-aleft": {
						itemClz: ['a-left'],
						iconClz: ['a-left-icon'],
						clue: "左对齐",
					},
					"menu-acenter": {
						itemClz: ['a-center'],
						iconClz: ['a-center-icon'],
						clue: "居中对齐",
					},
					"menu-right": {
						itemClz: ['a-right'],
						iconClz: ['a-right-icon'],
						clue: "右对齐",
					},
					"menu-ilink": {
						itemClz: ['i-link'],
						iconClz: ['i-link-icon'],
						clue: "插入链接",
					},
					"menu-iimg": {
						itemClz: ['i-img'],
						iconClz: ['i-img-icon'],
						clue: "插入图片",
					},
				}
			},		
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
			
			/**
			 * 
			 * @param {string} itemId : string, id for each menu item div
			 * @param {Array} itemClazz: array, classes for this menu item div
			 * @param {string} titleName: string, title name. e.g Normal
			 * @param {Array} needArrow: boolean, whether need a down arrow on the right side or not
			 * @param {boolean} titleCss: object, extra css for title
			 */
			getMenuItemWithTitle: function(itemId, itemClazz, titleName, needArrow, titleCss) {
				var item = this.initItem(this.getMenuItem(), itemClazz, itemId);
				if(titleName) {
					var title = this.getItemTitle(titleName);
					if(titleCss) {
						for(var css in titleCss) {
							title.css(css, titleCss[css]);
						}
					}
					title.appendTo(item);
				}
				
				if(needArrow) {
					this.getArrow().appendTo(item);
				}
				
				return item;
			},
			
			/**
			 * 
			 * @param {string} itemId: string, id for icon item div
			 * @param {Array} itemClazz: array, classes for this item div
			 * @param {Array} iconClazz: array, classes for icon
			 */
			getMenuItemWithIcon: function(itemId, itemClazz, iconClazz) {
				var item = this.initItem(this.getMenuItem(), itemClazz, itemId);
				if(iconClazz) {
					var icon = this.getMenuIcon();
					for(var i in iconClazz) {
						icon.addClass(iconClazz[i]);
					}
					icon.appendTo(item);
				}
				
				return item;
			},
			
			/**
			 * 
 			 * @param {string} id: item id
			 */
			getMenuItemById: function(id) {
				if(!id || typeof id !== 'string')	throw TypeError(id + " is not a string!");
				
				var tc = this.config.title[id], ic = this.config.icon[id];
				if(tc && ic) throw RangeError("id: " + id + " exists in both title part and icon part, please check the config again!");
				if(!tc && !ic) throw RangeError("id: " + id + " does not exist in neither title part nor icon part!");
				
				var item, clue;
				if(tc) {
					item = this.getMenuItemWithTitle(id, tc.itemClz, tc.titleName[0], tc.needArrow, tc.titleCss);
					clue = tc.clue;
				} else if(ic) {
					item = this.getMenuItemWithIcon(id, ic.itemClz, ic.iconClz);
					clue = ic.clue;
				} else throw Error("something wrong happened:(|)");
				
				this.addClueMsg(item, clue);
				return item;
			},
			
			/**
			 * 
 			 * @param {jQuery Object} ele
 			 * @param {string} msg: clue message
			 */
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
			
			toggleBorder: function(ele) {
				$(this).toggleClass("menu-item-selected");
			},
		},
		initMenuEvents: {
			mutex: {
				groups: {
					order: ['menu-ol', 'menu-ul'],
					align: ['menu-aleft', 'menu-acenter', 'menu-aright'],
				},
				map: {
					click: ['order', 'align'],
				},
				
				getMutexGroupsByEventAndItem: function(eventName, item) {
					// TODO 这里应该用event name 和 item一起来选择互斥组
					var groupNames = this.map[eventName];
					var groups = [];
					if(groupNames) {
						for(var i in groupNames) {
							var group = this.groups[groupNames[i]];
						}
						
						groups.push(this.groups[groupNames[i]]);
					}
					
					return groups;
				},
			},
			bindEvents4Cat: function(ele) {
				return ele;
			},
			bindEvents4FontFamily: function(ele) {
				return ele;
			},
			bindEvents4FontSize: function(ele) {
				return ele;
			},
			bindEvents4FontColor: function(ele) {return ele;},
			bindEvents4FontBgColor: function(ele) {return ele;},
			bindEvents4U: function(ele) {
				var mutex = this.mutex.getMutexGroupsByEventAndItem('click', ele);
				return ele;
			},
			bindEvents4I: function(ele) {return ele;},
			bindEvents4B: function(ele) {return ele;},
			bindEvents4Ol: function(ele) {return ele;},
			bindEvents4Ul: function(ele) {return ele;},
			bindEvents4AlignLeft: function(ele) {return ele;},
			bindEvents4AlignCenter: function(ele) {return ele;},
			bindEvents4AlignRight: function(ele) {return ele;},
			bindEvents4InsertLink: function(ele) {return ele;},
			bindEvents4InsertImg: function(ele) {return ele;},
			bindEvents4More: function(ele) {return ele;}
		},
		
		initMenuUtils: {
			init: function(initMenuLayout, initMenuEvents) {
				this.ml = initMenuLayout;
				this.me = initMenuEvents;
				
				return this;
			},
			
			initMenuCat: function()	{
				var id = 'menu-cat';
				var cat = this.ml.getMenuItemById(id);
				return this.me.bindEvents4Cat(cat);
			},
			initMenuFontFamily: function() {
				var id = 'menu-font-family';
				var ff = this.ml.getMenuItemById(id);
				return this.me.bindEvents4FontFamily(ff);
			},
			initMenuFontSize: function() {
				var id = 'menu-font-size';
				var item = this.ml.getMenuItemById(id);
				return this.me.bindEvents4FontSize(item);
			},
			initMenuBold: function() {
				var id = 'menu-font-b';
				var item = this.ml.getMenuItemById(id);
				return this.me.bindEvents4B(item);
			},
			initMenuItalic: function() {
				var id = 'menu-font-i';
				var item = this.ml.getMenuItemById(id);
				return this.me.bindEvents4I(item);
			},
			initMenuUnderline: function() {
				var id = 'menu-font-u';
				var item = this.ml.getMenuItemById(id);
				return this.me.bindEvents4U(item);
			},
			initMenuFontColor: function() {
				var id = 'menu-font-color';
				var item = this.ml.getMenuItemById(id);
				return this.me.bindEvents4FontColor(item);
			},
			initMenuFontBgColor: function() {
				var id = 'menu-font-bg-color';
				var item = this.ml.getMenuItemById(id);
				return this.me.bindEvents4FontBgColor(item);
			},
			initMenuOl: function() {
				var id = 'menu-ol';
				var item = this.ml.getMenuItemById(id);
				return this.me.bindEvents4Ol(item);
			},
			initMenuUl: function() {
				var id = 'menu-ul';
				var item = this.ml.getMenuItemById(id);
				return this.me.bindEvents4Ul(item);
			},
			initMenuAlignLeft: function() {
				var id = 'menu-aleft';
				var item = this.ml.getMenuItemById(id);
				return this.me.bindEvents4AlignLeft(item);
			},
			initMenuAlignCenter: function() {
				var id = 'menu-acenter';
				var item = this.ml.getMenuItemById(id);
				return this.me.bindEvents4AlignCenter(item);
			},
			initMenuAlignRight: function() {
				var id = 'menu-right';
				var item = this.ml.getMenuItemById(id);
				return this.me.bindEvents4AlignRight(item);
			},
			initMenuInsertLink: function() {
				var id = 'menu-ilink';
				var item = this.ml.getMenuItemById(id);
				return this.me.bindEvents4InsertLink(item);
			},
			initMenuInsertImg: function() {
				var id = 'menu-iimg';
				var item = this.ml.getMenuItemById(id);
				return this.me.bindEvents4InsertImg(item);
			},
			initMenuMore: function() {
				var id = 'menu-more';
				var item = this.ml.getMenuItemById(id);
				return this.me.bindEvents4More(item);
			},
		},
		
		initMenu: function () {
			var $menu = this.$menu;
			var ml = this.initMenuLayout, me = this.initMenuEvents;
			var u = this.initMenuUtils.init(ml, me);
			var addMe = function(me) {
				$menu.append(me);
			};
			
			addMe(u.initMenuCat());
			addMe(ml.getSep());
			addMe(u.initMenuFontFamily());
			addMe(ml.getSep());
			addMe(u.initMenuFontSize());
			addMe(ml.getSep());
			addMe(u.initMenuBold());
			addMe(u.initMenuItalic());
			addMe(u.initMenuUnderline());
			addMe(u.initMenuFontColor());
			addMe(u.initMenuFontBgColor());
			addMe(ml.getSep());
			addMe(u.initMenuOl());
			addMe(u.initMenuUl());
			addMe(u.initMenuAlignLeft());
			addMe(u.initMenuAlignCenter());
			addMe(u.initMenuAlignRight());
			addMe(ml.getSep());
			addMe(u.initMenuInsertLink());
			addMe(u.initMenuInsertImg());
			addMe(u.initMenuMore());
			
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