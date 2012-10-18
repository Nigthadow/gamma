/**
 * A simple web editor implemented in the jQuery plugin way
 *  
 */
(function($) {
	'use strict'
	var pn = 'webeditor';
	var data = {
		config: {
				title: {
					'menu-cat': {
						itemClz: ['we-menu-cat', 'we-menu-item-border'],
						titleName: ["Normal"],
						needArrow: true,
						titleCss: {'left': "1px"},
						clue: "标题选项",
						defaults: '',
					},
					'menu-font-family': {
						itemClz: ['we-menu-font', 'we-menu-item-border'],
						titleName: ["Arial"],
						needArrow: true,
						clue: "字体样式",
						defaults: 'Arial, Helvetica, sans-serif'
					},
					'menu-font-size': {
						itemClz: ['we-menu-size', 'we-menu-item-border'],
						titleName: ["15"],
						titleCss: {'cursor': "text"},
						needArrow: true,
						clue: "字体大小",
						defaults: '15',
					},
					'menu-font-color': {
						itemClz: ['font-color', 'we-menu-item-border'],
						titleName: ["Ac"],
						needArrow: true,
						clue: "字体颜色",
						defaults: '#000',
					},
					'menu-font-bg-color': {
						itemClz: ['font-bg-color', 'we-menu-item-border'],
						titleName: ["Ac"],
						needArrow: true,
						clue: "背景颜色",
						defaults:'#fff',
					},
					"menu-more": {
						itemClz: ['more'],
						titleName: [""],
						needArrow: true,
						clue: "更多",
						defaults: '',
					},
				},
				icon: {
					"menu-font-b": {
						itemClz: ['icon-spot'],
						iconClz: ['b-icon'],
						clue: "粗体",
						defaults:false,
					},
					"menu-font-i": {
						itemClz: ['icon-spot'],
						iconClz: ['i-icon'],
						clue: "斜体",
						defaults: false,
					},
					"menu-font-u": {
						itemClz: ['icon-spot'],
						iconClz: ['u-icon'],
						clue: "下划线",
						defaults: false,
					},
					"menu-ol": {
						itemClz: ['icon-spot'],
						iconClz: ['ol-icon'],
						clue: "有序序列",
						defaults: false,
					},
					"menu-ul": {
						itemClz: ['icon-spot'],
						iconClz: ['ul-icon'],
						clue: "无序序列",
						defaults: false,
					},
					"menu-aleft": {
						itemClz: ['icon-spot'],
						iconClz: ['a-left-icon'],
						clue: "左对齐",
						defaults: false,
					},
					"menu-acenter": {
						itemClz: ['icon-spot'],
						iconClz: ['a-center-icon'],
						clue: "居中对齐",
						defaults:false,
					},
					"menu-aright": {
						itemClz: ['icon-spot'],
						iconClz: ['a-right-icon'],
						clue: "右对齐",
						defaults:false,
					},
					"menu-ilink": {
						itemClz: ['icon-spot'],
						iconClz: ['i-link-icon'],
						clue: "插入链接",
						defaults: '',
					},
					"menu-iimg": {
						itemClz: ['icon-spot'],
						iconClz: ['i-img-icon'],
						clue: "插入图片",
						defaults: '',
					},
				}
			},
	};
	var eventToolKit = {
		mutex: {
			groups: {
				order: ['menu-ol', 'menu-ul'],
				align: ['menu-aleft', 'menu-acenter', 'menu-aright'],
			},
			map: {
				click: ['order', 'align'],
			},
			getMutexGroupsByEventAndItem: function(eventName, ele) {
				var groupNames = this.map[eventName], itemId = ele.attr('id'), groups = [];
				if (!groupNames || !itemId) return groups;
				
				for(var i in groupNames) {
					var group = this.groups[groupNames[i]];
					if($.inArray(itemId, group) > -1) groups.push(group);
				}
				return groups;
			},
		},
		getEventEngine: function() {
			return (function(event) {
				var data = event.data;
				var me = $(this);
				var id = me.attr('id');
				if(data.mutex) { // mutex logic processing
					var groups = data.mutex.group;
					var handlers = data.mutex.handlers
					handlers = handlers ? handlers : [];
					for(var i in groups) {
						var group = groups[i];
						for (var k in group) {
							if(id == group[k]) continue;
							var item = $('#' + group[k]);
							for(var j in handlers) {
								var handler = handlers[j];
								handler(item, event);
							};
						};
					};
				}; // end of mutex logic processing
				
				if(data.uiHandlers) { // UI processing
					var handlers = data.uiHandlers
					for(var i in handlers) {
						var handler = handlers[i];
						handler(me, event);
					}
				}; // end of UI processing
				
				if(data.formatHandlers) { // format processing
					var handlers = data.formatHandlers
					for(var i in handlers) {
						var handler = handlers[i];
						handler(me, event);
					}
				}; // end of format processing			
			});
		},		
		cleanAll: function(ele) {
			// detach all panels
			$('[id$=-panel]', $('#we-menu')).detach();
			// unselect the following menu items
			var unSelectedItems = ['menu-cat', 'menu-font-family', 'menu-font-size', 'menu-font-color', 'menu-font-bg-color', 'we-menu-fs-dropdown'];
			for(var i in unSelectedItems) {
				$('[id$=' + unSelectedItems[i] + ']').removeClass("menu-item-selected-shadow")
			}
		},
		stop: function(ele, event) {
			event.stopPropagation();
		},
		toggleSelected: function(ele) {
			ele.toggleClass("menu-item-selected-shadow");
			// toggle attribute selected
			if(ele.attr('selected')) return ele.removeAttr('selected');
			else return ele.attr('selected', '');
		},
		selected: function(ele) {
			return ele.removeClass("menu-item-selected-shadow").addClass('menu-item-selected-shadow');
		},
		unselected: function(ele) {
			return ele.removeClass("menu-item-selected-shadow").removeAttr('selected');
		},
		editable: function(ele) {
			return ele.attr('contentEditable', 'true');
		},
		panelHoverIn: function(ele) {
			var tar = ele instanceof jQuery ? ele : $(this);
			return tar.addClass('we-menu-panel-hover');
		},
		panelHoverOut: function(ele) {
			var tar = ele instanceof jQuery ? ele : $(this);
			return tar.removeClass('we-menu-panel-hover')
		},
		panelDetach: function(ele) {
			var tar = ele instanceof jQuery ? ele : $(this);
			var targetPanelId = tar.attr('panel');
			if(targetPanelId) return $('#' + targetPanelId).detach(); 
			else return $('[id$=-panel]', $('#we-menu')).detach();
		},
		panelSelected: function(ele) {
			var tar = ele instanceof jQuery ? ele : $(this);
			var targetMenuId = tar.attr('menu');
			if(!targetMenuId) throw Error('Define a "menu" attribute to the option to find the corresponding menu item');
			else {
				$('#' + targetMenuId)
					.removeClass("menu-item-selected-shadow")
					.children('[class$=title]')
					.text(tar.text());
				return ele;
			}
		},
		saveSelection: function(ele, event) {
			var save, selection = null;
			if(window.getSelection) { 
				// ge IE 9 and other browers
				save = function() {
					var selection = window.getSelection(), ranges = [];
					if(selection.rangeCount) {
						for(var i = 0; i < selection.rangeCount; i ++) {
							ranges.push(selection.getRangeAt(i));
						}
					}
					return ranges;
				};
			} else if(document.selection && document.selection.createRange) {
				// le IE 8
				save = function() {
					var selection = document.selection;
					return (selection.Type != 'None') ? selection.createRange() : null;
				};
			}
			if(save) selection = save();
			$.fn[pn].data.selection = selection;
			return ele;
		},
		restoreSelection: function(ele, event) {
			var restore;
			if(window.getSelection) { 
				// ge IE 9 and other browers
				restore = function(savedSelection) {
					if(!savedSelection) return;
					var selection = window.getSelection();
					selection.removeAllRanges();
					for(var i = 0, len = savedSelection.length; i < len; i ++) {
						var range = savedSelection[i];
						selection.addRange(range);
					}
				};
			} else if(document.selection && document.selection.createRange) {
				// le IE 8
				restore = function(savedSelection) {
					if(savedSelection) {
						savedSelection.select();
					}
				};
			}
			if(restore) restore($.fn[pn].data.selection);
			return ele;
		},
		bindEvent: function(eventName, ele, uiHandlers, formatHanlders,  mutexHandlers) {
			var mg = $.fn[pn].etk.mutex.getMutexGroupsByEventAndItem(eventName, ele);
			return ele.on(eventName, {'mutex': {'group': mg, 'handlers': mutexHandlers}, 'uiHandlers': uiHandlers, 'formatHandlers': formatHanlders}, $.fn[pn].etk.getEventEngine(ele));
		},
	};
	var WEBEDITOR = {
		defaults: {
			width: 700,
			height: 500,
			menuWidth: 700,
			menuHeight: 55,
		},
		
		mainSep: '<div class="we-main-sep"/>',
		menu: '<div id="we-menu"/>',
		editArea: '<div class="we-edit-area" id="we-edit-area"></div>',
		
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
				 .append(this.initEditArea());
		},
		
		initEditArea: function() {
			var saveSelection = $.fn[pn].etk.saveSelection
			var keyupHandler = function(event) {
				// make sure every paragraph is wrapped by a <div>
				var key = event.which;
				switch(key) {
					case 46: // Delete key
					case 8: // Backspace key
						if($(this).children('div').length == 0) {
							$(this).empty().append($('<div><br></div>')).trigger('blur').trigger('focus');
						}
						break;	
					case 37: // Left key
					case 38: // Up key
					case 39: // Right key
					case 40: // Down key
						{
							saveSelection();
							break;
						}					
				}
				return $(this);
			};
			this.$editArea.attr('contentEditable', 'true')
				.append($('<div><br></div>'))
				.keyup(keyupHandler)
				.hover(function(event) {
					return $(this);
				}, function(event) {
					saveSelection()
					return $(this);
				});
			if($.browser.mozilla) {
				// TODO keyup cann't be fired in FF:()
				window.onkeyup = keyupHandler;
			}
			return $('<div>').addClass('we-ec').append(this.$editArea);
		},
		
		initMenuLayout: {	
			getArrow: function() {
				return this.getMenuIcon().addClass("arrow").attr('id', 'we-menu-arrow-down');
			},
			
			getSep: function(clz) {
				if(!clz) return this.getMenuItem().addClass("we-menu-sep");
				else return this.getDiv().addClass(clz);
					
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
				var div = $("<div>");	
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
				
				var config = $.fn[pn].data.config;
				var tc = config.title[id], ic = config.icon[id];
				if(tc && ic) throw RangeError("id: " + id + " exists in both title part and icon part, please check the config again!");
				if(!tc && !ic) throw RangeError("id: " + id + " does not exist in neither title part nor icon part!");
				
				var item, clue;
				if(tc) {
					item = this.getMenuItemWithTitle(id, tc.itemClz, tc.titleName[0], tc.needArrow, tc.titleCss);
					item.attr('_v', tc.defaults);
					clue = tc.clue;
				} else if(ic) {
					item = this.getMenuItemWithIcon(id, ic.itemClz, ic.iconClz);
					item.attr('_v', ic.defaults);
					clue = ic.clue;
				} else throw Error("something wrong happened:(|)");
				
				this.addToolTip(item, clue);
				return item;
			},
			
			getCoordinate: function(ele) {
				var marginLeft = parseInt(ele.css("margin-left")),
				marginTop = parseInt(ele.css("margin-top")),
				width = parseInt(ele.css("width")),
				height = parseInt(ele.css("height")),
				position = ele.position(),
				left = position.left,
				top = position.top;
				var leftOffset = left + marginLeft;
				var topOffset = top + marginTop + height;
				
				return [leftOffset, topOffset];
			},
			getMenuCatPanel: function() {
				var panelId = 'we-menu-cat-panel', 
					options = [['we-menu-cat-pnormal', 'Normal', 'cat-pnormal'],
							   ['we-menu-cat-phead3', 'Head 3', 'cat-phead3'],
							   ['we-menu-cat-phead2', 'Head 2', 'cat-phead2'],
							   ['we-menu-cat-phead1', 'Head 1', 'cat-phead1']];
							   
				var panel = this.getDiv().attr('id', panelId).addClass('we-menu-panel');
				for(var i=0,j=options.length; i<j; i++){
				  var option = options[i];
				  if(option.length != 3) throw Error('Wrong parameters number for cat panel: ' + option);
				  this.getDiv(option[1])
				  	  .addClass(option[0])
				  	  .attr('id', option[2])
				  	  .attr('panel', panelId)
				  	  .attr('menu', 'menu-cat')
				  	  .appendTo(panel);
				};
				
				return panel;
			},
			getMenuFontFamilyPanel: function() {
				var panelId = 'we-menu-ff-panel', 
					options = [['we-menu-ff-arial', 'Arial', 'ff-arial'],
							   ['we-menu-ff-mp', 'Myriad', 'ff-mp'],
							   ['we-menu-ff-songti', '宋体', 'ff-st']];
							   
				var panel = this.getDiv().attr('id', panelId).addClass('we-menu-panel');
				for(var i=0,j=options.length; i<j; i++){
				  var option = options[i];
				  if(option.length != 3) throw Error('Wrong parameters number for font family panel: ' + option);
				  this.getDiv(option[1])
				  	  .addClass(option[0])
				  	  .attr('id', option[2])
				  	  .attr('panel', panelId)
				  	  .attr('menu', 'menu-font-family')
				  	  .appendTo(panel);
				};
				
				return panel;
			},
			getMenuFontSizePanel: function() {
				var panelId = 'we-menu-fs-panel', lineId = 'we-menu-fs-line-panel', knobId = 'we-menu-fs-knob-panel';
				var panel = this.getDiv().attr('id', panelId).addClass('we-menu-panel');
				var line = this.getDiv().attr('id', lineId); 
				var knob = this.getDiv().attr('id', knobId);
				return [panel, line, knob];
			},
			getColorPanel: function() {
				var panelId = 'we-menu-color-panel';
				var panel = this.getDiv().attr('id', panelId),
				title = $('<h4>').text('Color Panel').addClass('wmcp-title').appendTo(panel),
				ul = $('<ul>').addClass('wmcp-ul').appendTo(panel);
				var colors = {
					gray: ['fff', '999', '666', '333', '000'],
					red: ['ffbfbf', 'ff4040', 'd90000', 'bf0000', '800000'], /* take a look at: http://webdesign.about.com/od/colorpalettes/l/bl_palette_red.htm*/
					blue: ['9cf', '69c', '369', '069', '036'], /* take a look at: http://www.creativecolorschemes.com/resources/free-color-schemes/blue-tone-color-scheme.shtml*/
					green: ['a0dfbf', '40be80', '00a855', '006600', '030'], /* take a look at: http://webdesign.about.com/od/colorpalettes/l/bl_palette_green.htm*/
				};
				
				for(var i in colors) {
					var color = colors[i];
					var li = $('<li>').appendTo(ul);
					var table = $('<table>').addClass('wmcp-table').appendTo(li);
					var tr = $('<tr>').appendTo(table);
					var emptyTd = $('<td>').css('width', '10px').appendTo(tr);
					for(var j in color) {
						var rgb = '#' + color[j];
						$('<td>').append(this.getDiv().addClass('wmcp-color-spot').attr('title', rgb).css('backgroundColor', rgb)).appendTo(tr);
					}
					$('<li>').css('height', '3px').css('border', '0').appendTo(ul);
				}
				return panel;
			},
			
			/**
			 * 
 			 * @param {jQuery Object} ele
 			 * @param {string} msg: clue message
			 */
			addToolTip: function(ele, msg) {
				var getdiv = this.getDiv, coor = this.getCoordinate;
				ele.hover(
					function() {
						// add shadown
						$(this).addClass("menu-item-hover-shadow");
						// add clue message
						var co = coor($(this)); 
						var leftOffset = co[0];
						var topOffset = co[1] + 5;
						var clue = getdiv(msg).addClass("menu-clue").css("left", leftOffset + "px").css("top", topOffset + "px").appendTo($(this).parent());
						
						// add arrow on top of clue rectangle
						var clueWidth = parseInt(clue.css('width'))
						leftOffset = leftOffset + clueWidth / 3;
						topOffset = topOffset - 3;
						getdiv().addClass("menu-clue-arrow-up").css("left", leftOffset + "px").css("top", topOffset + "px").appendTo($(this).parent());
					}, 
					function() {
						$("div[class|=menu-clue]", $(this).parent()).detach();
						$(this).removeClass("menu-item-hover-shadow");
					}
				);
			},
		},
		initMenuEvents: {
			init: function(initMenuLayout) {
				this.etk = $.fn[pn].etk;
				this.bindEvent = $.fn[pn].etk.bindEvent;
				this.ml = initMenuLayout;
				$('body').click(function(){
					$.fn[pn].etk.cleanAll();
				});
				return this;
			},	
			
			bindEvents4Cat: function(ele) {
				var ml = this.ml;
				var bindEvent = this.bindEvent,
					hoverIn = this.etk.panelHoverIn,
					hoverOut = this.etk.panelHoverOut,
					pDetach = this.etk.panelDetach,
					pSelected = this.etk.panelSelected,
					clean = this.etk.cleanAll,
					stop = this.etk.stop;
				var formatNormal = function(ele) {
					// TODO implement format logic for normal
					return ele;
				};
				var formatHead3 = function(ele) {
					// TODO implement format logic for Head 3
					return ele;
				};
				var formatHead2 = function(ele) {
					// TODO implement format logic for Head 2
					return ele
				};
				var formatHead1 = function(ele) {
					// TODO implement format logic for Head 1	
					return ele
				};
				var getFormatter = function(ele) {
					var id = ele.attr('id');
					if(!id) throw new Error(id + ' cannot be used to find the formatter');
					if(id === 'cat-pnormal') return formatNormal;
					else if(id === 'cat-phead3') return formatHead3;
					else if(id === 'cat-phead2') return formatHead2;
					else if(id === 'cat-phead1') return formatHead1;
					else throw new Error('No formatter found for id: ' + id);
				};
				
				var setSelectedValue = function(ele) {
					var p = $('#menu-cat'), id = ele.attr('id'), _v = '';
					if(!id) throw new Error(id + ' cannot be used to find the formatter');
					if(id === 'cat-pnormal') _v = '';
					else if(id === 'cat-phead3') _v = 'h3';
					else if(id === 'cat-phead2') _v = 'h2';
					else if(id === 'cat-phead1') _v = 'h3';
					else throw new Error('No formatter found for id: ' + id);
					p.attr('_v', _v);
					return ele;
				}
				
				var expandPanel = function(ele) {
					var co = ml.getCoordinate(ele);
					ml.getMenuCatPanel()
					  .css('left', co[0])
					  .css('top', co[1] + 3)
					  .appendTo(ele.parent())
					  .children('div')
					  .each(function() {
						var ele = $(this);
						ele.hover(hoverIn, hoverOut);
						bindEvent('click', ele, [pDetach, pSelected, setSelectedValue, stop], [getFormatter(ele)]);
					});
				};
				return bindEvent('click',ele, [clean, this.etk.selected, expandPanel, stop], []);
			},
			bindEvents4FontFamily: function(ele) {
				var ml = this.ml;
				var bindEvent = this.bindEvent,
					hoverIn = this.etk.panelHoverIn,
					hoverOut = this.etk.panelHoverOut,
					pDetach = this.etk.panelDetach,
					pSelected = this.etk.panelSelected,
					clean = this.etk.cleanAll,
					stop = this.etk.stop;
				var formatter = function(ele) {
					// TODO implement format logic
					return ele;
				};
				var changeMenuFontFamily = function(ele) {
					var menuId = ele.attr('menu'), font = ele.css('font-family');
					$('#' + menuId, $('#we-menu')).css('font-family', font).attr('_v', font);
					
					return ele;
				};
				var expandPanel = function(ele) {
					var co = ml.getCoordinate(ele);
					ml.getMenuFontFamilyPanel()
					  .css('left', co[0]).css('top', co[1] + 3)
					  .appendTo(ele.parent())
					  .children('div').each(function() {
						var ele = $(this);
						ele.hover(hoverIn, hoverOut);
						bindEvent('click',ele, [changeMenuFontFamily, pDetach, pSelected, stop], [formatter]);
					});
				};
				return bindEvent('click',ele, [clean, this.etk.selected, expandPanel, stop], []);
			},
			bindEvents4FontSize: function(ele) {
				var ml = this.ml;
				var bindEvent = this.bindEvent,
					hoverIn = this.etk.panelHoverIn,
					hoverOut = this.etk.panelHoverOut,
					pDetach = this.etk.panelDetach,
					pSelected = this.etk.panelSelected,
					clean = this.etk.cleanAll,
					stop = this.etk.stop;
				var smallRadius = function(ele) {
					return ele.css("border-radius", '2px 2px').css('-moz-border-radius', '2px 2px');
				};
				var sizeChange = function(ele) {
					return ele;
				};
				
				var expandPanel = function(ele) {
					var p = ele.parent();
					var co = ml.getCoordinate(p);
					var panels = ml.getMenuFontSizePanel();
					var panel = panels[0], line = panels[1], knob = panels[2]; 
					var panelLeft = co[0] + parseInt(p.css('width')) - parseInt(ele.css('width'));
					panel.css('left', panelLeft).css('top', co[1] + 3).appendTo(p.parent());
					var panelWidth = parseInt(panel.css('width'));
					line.css('left', panelLeft + panelWidth / 5).css('top', co[1] + 6).appendTo(p.parent());
					var getSize = function(ele, event) {
						var y = event.pageY, top = ele.offset().top, bt = ele.css('border-top-width');
						var size = parseInt(y) - parseInt(top) - parseInt(bt);
						size = size < 1 ? 1 : size;
						size = size > 100 ? 100 : size;
						
						return parseInt(size);
					};
					var clickLine = function(ele, event) {
						var size = getSize(ele, event);
						$('.we-menu-title', p).text(size);
						p.attr('_v', size);
						return ele;
					};
					
					var fontSizeFormatter = function(ele) {
						// TODO 实现字体大小的格式变化
						return ele;
					};
					bindEvent('click', line, [clickLine], [fontSizeFormatter]);
					
					var size = parseInt(p.children('.we-menu-title').text());
					if(size < 1) size = 1;
					if(size > 100) size = 100;
					var lineWidth = line.outerWidth();
					knob.css('left', panelLeft + panelWidth / 5 + lineWidth).css('top', co[1] + 6 + size).text(size).appendTo(p.parent());
					
					var mouseMove = function(ele, event) {
						var e = event,
						height = knob.outerHeight(),
		                topStart = line.offset().top + parseInt(line.css('border-top')) + 1, // at least 1 for font size
		                topEnd = line.offset().top + line.outerHeight() - parseInt(line.css('border-bottom')),
		                minTopPosition = topStart - 0.5 * height,
		                maxTopPosition = topEnd - 0.5 * height;
		                var top = e.pageY - height / 2;
		           		if (top - minTopPosition < 0) top = minTopPosition;
					    else if(top - maxTopPosition > 0) top = maxTopPosition;
					    knob.offset({top: top}).text(getSize(ele, event));
					};
					bindEvent('mousemove', line, [mouseMove]);
					bindEvent('click', knob, [stop]);
					bindEvent('click', panel, [stop]);
				};
				
				var dropdown = ele.children('#we-menu-fs-dropdown'), size = ele.children('[class$=title]');
				bindEvent('click', dropdown, [clean, this.etk.selected, smallRadius, expandPanel, stop]);
				// bindEvent('click', size, [], [this.etk.editable], []);
				return ele;
			},
			bindEvents4FontColor: function(ele) {
				var ml = this.ml;
				var bindEvent = this.bindEvent,
					hoverIn = this.etk.panelHoverIn,
					hoverOut = this.etk.panelHoverOut,
					pDetach = this.etk.panelDetach,
					pSelected = this.etk.panelSelected,
					clean = this.etk.cleanAll,
					stop = this.etk.stop;
				var expandPanel = function(ele, event) {
					var co = ml.getCoordinate(ele);
					ml.getColorPanel()
					  .css('left', co[0]).css('top', co[1] + 3)
					  .appendTo(ele.parent())
					  .find('div').each(function(event) {
					  	var ele = $(this);
					  	var uiHandler = function(ele, event) {
					  		var color = ele.css('background-color');
					  		$('[class$=title]', $('#menu-font-color').attr('_v', color)).css('color', color);
					  		return ele;
					  	};
					  	var formatter = function(ele, event) {
					  		// TODO 实现字体颜色更改
					  		return ele;
					  	}
					  	bindEvent('click', ele, [uiHandler], [formatter]);
					  });
				};
				bindEvent('click', ele, [clean, this.etk.selected, expandPanel, stop]);
				return ele;
			},
			bindEvents4FontBgColor: function(ele) {
				var ml = this.ml;
				var bindEvent = this.bindEvent,
					hoverIn = this.etk.panelHoverIn,
					hoverOut = this.etk.panelHoverOut,
					pDetach = this.etk.panelDetach,
					pSelected = this.etk.panelSelected,
					clean = this.etk.cleanAll,
					stop = this.etk.stop;
				var expandPanel = function(ele, event) {
					var co = ml.getCoordinate(ele);
					ml.getColorPanel()
					  .css('left', co[0]).css('top', co[1] + 3)
					  .appendTo(ele.parent())
					  .find('div').each(function(event) {
					  	var ele = $(this);
					  	var uiHandler = function(ele, event) {
					  		var color = ele.css('background-color');
					  		$('#menu-font-bg-color').css('background-color', color).attr('_v', color);
					  		return ele;
					  	};
					  	var formatter = function(ele, event) {
					  		// TODO 实现字体背景色更改
					  		return ele;
					  	}
					  	bindEvent('click', ele, [uiHandler], [formatter]);
					  });
				};
				bindEvent('click', ele, [clean, this.etk.selected, expandPanel, stop]);
				return ele;
			},
			bindEvents4U: function(ele) {
				var formatHandler = function(ele) {
					// TODO 实现格式变换逻辑
				};				
				
				var formatHandlers = [formatHandler];
				this.bindEvent('click',ele, [this.etk.toggleSelected], formatHandlers);
				
				return ele;
			},
			bindEvents4I: function(ele) {
				var formatHandler = function(ele) {
					// TODO 实现格式变换逻辑
				};
				
				var formatHandlers = [formatHandler];
				this.bindEvent('click', ele, [this.etk.toggleSelected], formatHandlers);
				this.bindEvent('mousedown', ele, [], [])
				return ele;
			},
			bindEvents4B: function(ele) {
				var toggleSelected = this.etk.toggleSelected,
					restoreSelection = this.etk.restoreSelection;
				var formatHandler = function(ele) {
					// TODO 实现格式变换逻辑
				};
				
				var formatHandlers = [formatHandler];
				this.bindEvent('click',ele, [toggleSelected, restoreSelection], formatHandlers);
				// this.bindEvent('mouseup', ele, [], [])
				return ele;
			},
			bindEvents4Ol: function(ele) {
				// TODO mutex handler for _v need more work!!!
				var mutexHandlers = [this.etk.unselected];
				var uiHandlers = [this.etk.toggleSelected];
				var formatHandler = function(ele) {
					// TODO 实现格式变换逻辑
				};
				return this.bindEvent('click',ele, uiHandlers, [formatHandler], mutexHandlers);
			},
			bindEvents4Ul: function(ele) {
				var mutexHandlers = [this.etk.unselected];
				var uiHandlers = [this.etk.toggleSelected];
				var formatHandler = function(ele) {
					// TODO 实现格式变换逻辑
				};
				this.bindEvent('click',ele, uiHandlers, [formatHandler], mutexHandlers);
				return ele;
			},
			bindEvents4AlignLeft: function(ele) {
				var mutexHandlers = [this.etk.unselected];
				var uiHandlers = [this.etk.toggleSelected];
				var formatHandler = function(ele) {
					// TODO 实现格式变换逻辑
				};
				this.bindEvent('click',ele, uiHandlers, [formatHandler], mutexHandlers);
				return ele;
			},
			bindEvents4AlignCenter: function(ele) {
				var mutexHandlers = [this.etk.unselected];
				var uiHandlers = [this.etk.toggleSelected];
				var formatHandler = function(ele) {
					// TODO 实现格式变换逻辑
				};
				this.bindEvent('click',ele, uiHandlers, [formatHandler], mutexHandlers);
				return ele;
			},
			bindEvents4AlignRight: function(ele) {
				var mutexHandlers = [this.etk.unselected];
				var uiHandlers = [this.etk.toggleSelected];
				var formatHandler = function(ele) {
					// TODO 实现格式变换逻辑
				};
				this.bindEvent('click',ele, uiHandlers, [formatHandler], mutexHandlers);
				return ele;
			},
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
				
				// add dropdown box for font size
				var dropDownBox = this.ml.getDiv().addClass('we-menu-title-dropdown').attr('id', 'we-menu-fs-dropdown');
				var arrow = item.children('#we-menu-arrow-down').appendTo(dropDownBox);
				item.children('#we-menu-arrow-down').remove();
				item.append(dropDownBox);
				item.children('[class$=title]').css('width', '24px');
				
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
				var id = 'menu-aright';
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
			var ml = this.initMenuLayout;
			var me = this.initMenuEvents.init(ml);
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
	
	$.fn[pn] = function(options) {
		return this.each(function() {
			var we = $.extend({}, WEBEDITOR);
			we.init(this, options);
			}
		);
	};
	$.fn[pn].etk = eventToolKit;
	$.fn[pn].data = data;
})(jQuery);