enyo.kind({
	name: "Library",
	kind: enyo.VFlexBox,
	flex: 1,
	className: "basic-back",
	
	events: {
		onUndo: "",
		onSelect: "",
		onRemove: ""
	},
	
	_index: 0,
	_changed: false,

	_searchText: "",
	_searchCount: 0,

	_currentView: "flip",
	_currentTheme: null,
	
	_matchingThemes: [],
	_installedThemes: [],

	_previewAppIcons: [
		"Phone", "Messaging", "Browser", "Email", "Calendar", "Launcher"
	],

	_currentThemeComponents: [
		"App Icons", "App Launcher", "Applications", "Boot Logo", "Enyo Widgets", "Exhibition", "Just Type", 
		"Keyboard", "Lock Screen", "Quick Launcher", "Status Bar", "System Menus", "Wallpapers"
	],
	
	_selectedThemeComponents: false,
	
	components: [
		{name: "configView", layoutKind: "VFlexLayout", flex: 1, components: [
			{kind: "PageHeader", layoutKind: "HFlexLayout", components: [
				{name: "normalHeader", layoutKind: "HFlexLayout", flex: 1, components: [
					{kind: "ToolButton", style: "margin: -20px;margin-left: 0px;padding-top:10px;", icon: "./images/remote-button.png"},
					{kind: "Spacer", flex: 1},
					{name: "title", style: "text-transform: capitalize;", content: "Local Themes", style: "margin-top: -2px;"},
					{kind: "Spacer", flex: 1},
					{kind: "ToolButton", style: "margin: -20px;margin-right: -5px;padding-top:10px;", icon: "./images/search-button.png", onclick: "showSearchField"}			
				]},
				{name: "searchHeader", layoutKind: "HFlexLayout", flex: 1, components: [
					{name: "search", kind: "SearchInput", flex: 1, style: "margin: -12px -3px;", onchange: "handleSearchUpdate", onCancel: "hideSearchField"}
				]}
			]},
			
			{name: "content", kind: "Pane", transitionKind: "enyo.transitions.Simple", flex: 1, width: "100%", components: [
				{layoutKind: "VFlexLayout", style: "padding-top: 10px;min-height:100%;", flex: 1, components: [
					{name: "carousel", kind: "Carousel", flex: 1, onGetLeft: "getLeftThemeView", onGetRight: "getRightThemeView"}
				]},
				{kind: "Scroller", layoutKind: "VFlexLayout", className: "device-" + enyo.fetchDeviceInfo().modelNameAscii.toLowerCase(), flex: 1, style: "display: none;", components: [
					{layoutKind: "VFlexLayout", className: "theme-list-view", components: [
						{name: "themesList", kind: "VirtualRepeater", onSetupRow: "getThemeItem", components: [
							  {kind: "SwipeableItem", layoutKind: "HFlexLayout", tapHighlight: true, onclick: "handleFlipView", onConfirm: "removeSelectedTheme", components: [
									{name: "themeScreenshot", kind: "Image", className: "theme-list-screenshot"},
									{layoutKind: "VFlexLayout", flex: 1, pack: "center", components: [
										{layoutKind: "HFlexLayout", components: [
											{name: "themeTitle", content: "", className: "theme-list-title", flex: 1},
											{name: "themeVersion", content: "", className: "theme-list-title"},
										]},
										{layoutKind: "HFlexLayout", align: "left", pack: "begin", components: [
											{content: "Components:", className: "enyo-label theme-list-information"}
										]},
										{layoutKind: "HFlexLayout", flex: 1, align: "right", pack: "end", components: [
											{name: "themeComponents", content: "", className: "theme-list-description"}
										]},
										{layoutKind: "HFlexLayout", align: "left", pack: "begin", components: [
											{content: "Supports:", className: "enyo-label theme-list-information"},
										]},
										{layoutKind: "HFlexLayout", flex: 1, align: "right", pack: "end", components: [
											{name: "themeSupports", content: "", className: "theme-list-description"}
										]}
									]}
							  ]}
						 ]}
					]}
				]}				
			]},
			
			{name: "flipToolbar", kind: "Toolbar", layoutKind: "HFlexLayout", className: "enyo-toolbar-light", components: [
				{kind: "Control", layoutKind: "HFlexLayout", style: "width: 50px;", components: [
					{name: "undoButton", kind: "ToolButton", icon: "./images/reset.png", style: "margin: -1px 0px;", onclick: "doUndo"},
				]},
				{kind: "Spacer", flex: 1},
				{name: "selectButton", kind: "Button", caption: "Select This Theme", onclick: "handleSelectTheme"},
				{kind: "Spacer", flex: 1},
				{name: "listButton", kind: "ToolButton", icon: "./images/list-view.png", style: "margin: -1px 0px;", onclick: "handleListView"}
			]}
		]},
				
		{name: "openThemeWebsite", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "launch"}
	],
	
	refreshView: function() {
		if(this._currentView == "flip")
			this.$.carousel.setCenterView(this.getThemeView(this._index, false));		
	},
	
	selectTheme: function(inThemeId) {
		if(this._currentView == "list") {
			this._currentView = "flip";

			this.$.content.selectViewByIndex(0);

			this.$.flipToolbar.show();		
		}		

		if(!inThemeId) {
			this._index = 0;

			this.$.title.setContent("Local Themes (1/" + this._matchingThemes.length + ")");

			this.$.carousel.setCenterView(this.getThemeView(0, false));
		} else {
			for(var i = 0; i < (this._matchingThemes.length); i++) {
				if(this._matchingThemes[i].id == inThemeId) {
					this._index = i;

					this.$.title.setContent("Local Themes (" + (i + 1) + "/" + this._matchingThemes.length + ")");

					this.$.carousel.setCenterView(this.getThemeView(i, true));
				 
					break;
				}				
			}
		}
	},

	updateTheme: function(inTheme) {
		if(this._currentView == "list") {
			this._currentView = "flip";

			this.$.content.selectViewByIndex(0);

			this.$.flipToolbar.show();		
		}		

		this.$.undoButton.hide();
		this.$.selectButton.setCaption("Select This Theme");

		this._selectedThemeComponents = false;
				
		this._currentTheme = {id: inTheme.id, components: {}};
		
		this._currentTheme.preview = enyo.clone(inTheme.preview);

		for(var component in inTheme.components) {
			this._currentTheme.components[component] = enyo.clone(inTheme.components[component]);
		}
		
		this.$.carousel.setCenterView(this.getThemeView(this._index, false));		
	},
		
	updateThemes: function(inTheme, inThemes) {
		this._index = 0;

		this.$.searchHeader.hide();

		this.$.undoButton.hide();
		this.$.selectButton.setCaption("Select This Theme");

		this._selectedThemeComponents = false;
				
		this._currentTheme = {id: inTheme.id, components: {}};
		
		this._currentTheme.preview = enyo.clone(inTheme.preview);

		for(var component in inTheme.components) {
			this._currentTheme.components[component] = enyo.clone(inTheme.components[component]);
		}
		
		this._installedThemes = inThemes;
		
		this._matchingThemes = inThemes;

		this.$.title.setContent("Local Themes (1/" + this._matchingThemes.length + ")");
		
		if(this._currentView == "flip")
			this.$.carousel.setCenterView(this.getThemeView(this._index, false));		
		else
			this.$.themesList.render();	
	},

	openThemeWebsite: function() {
		if(this._matchingThemes[this._index].website) {
			this.$.openThemeWebsite.call({id: "com.palm.app.browser", params: {url: this._matchingThemes[this._index].website}});
		}
	},

	openDonationsLink: function() {
		if(this._matchingThemes[this._index].donations) {
			this.$.openThemeWebsite.call({id: "com.palm.app.browser", params: {url: this._matchingThemes[this._index].donations}});
		}
	},

	showSearchField: function() {
		this.$.normalHeader.hide();
		this.$.searchHeader.show();
	},

	hideSearchField: function() {
		this._searchText = "";

		this.$.searchHeader.hide();
		this.$.normalHeader.show();

		if(this._currentView == "list") {
			this._matchingThemes = this._installedThemes;

			this.$.themesList.render();
		} else {
			for(var i = 0; i < this._installedThemes.length; i++) {
				if(this._installedThemes[i].id == this._matchingThemes[this._index].id) {
					this._index = i;
					break;
				}
			}
			
			this._matchingThemes = this._installedThemes;

			this.$.title.setContent("Local Themes (" + (this._index + 1) + "/" + this._matchingThemes.length + ")");		

			this.$.carousel.setCenterView(this.getThemeView(this._index, false));
		}
	},

	handleSearchUpdate: function() {
		this._searchText = this.$.search.getValue();
		this._searchCount = 0;
		
		if(this._searchText.length > 0) {
			this._matchingThemes = [];

			this._matchingThemes.push(this._installedThemes[0]);

			for(var i = 1; i < this._installedThemes.length; i++) {
				var regexp = new RegExp(this._searchText.replace(/(\S+)/g, function(s) { return "\\b(" + s + ")(.*)" }).replace(/\s+/g, ''), "gi");
			
				if((this._installedThemes[i].name.match(regexp) != null) ||
					(this._installedThemes[i].version.match(regexp) != null) ||
					(this._installedThemes[i].creator.match(regexp) != null) ||
					(this._installedThemes[i].description.match(regexp) != null) ||
					(this._installedThemes[i].versions.toString().match(regexp) != null) ||
					(this._installedThemes[i].components.toString().match(regexp) != null))
				{
					this._matchingThemes.push(this._installedThemes[i]);
				}
			}
		} else {
			this._matchingThemes = this._installedThemes;
		}
		
		if(this._currentView == "list") {
			this.$.themesList.render();	
		} else {
			this._index = 0;

			this.$.carousel.setCenterView(this.getThemeView(this._index, false));
		}	
	},

	removeViewedTheme: function() {
		this.doRemove(this._matchingThemes[this._index].id);
	},

	removeSelectedTheme: function(inSender, inIndex) {
		this.doRemove(this._matchingThemes[inIndex].id);
	},

	getThemeItem: function(inSender, inIndex) {
		if((inIndex >= 0) && (inIndex < this._matchingThemes.length)) {
			this.$.themeTitle.setContent(this._matchingThemes[inIndex].name);
			this.$.themeVersion.setContent("v" + this._matchingThemes[inIndex].version);			

			var components = "";
			var supports = "";

			if(inIndex == 0) {
				components = "AI, AL, A, BL, EW, E, JT, K, LS, QL, SB, SM, W";
				supports = enyo.fetchDeviceInfo().modelNameAscii + " with " + this._matchingThemes[0].versions[0];
			} else {
				for(var i = 0; i < this._matchingThemes[inIndex].components.length; i++) {
					if(components != "")
						components += ", ";
				
					var tmp = this._matchingThemes[inIndex].components[i];
				
					var array = tmp.split(' ');
				
					for(var j = 0; j < array.length; j++)
						components += array[j].substring(0,1).toUpperCase();
				}
			
				var devices = this._matchingThemes[0].devices.toString();
			
				devices = devices.replace("emulator", "Emulator");
				devices = devices.replace("touchpad", "TouchPad");
				devices = devices.replace("veer", "Veer");
				devices = devices.replace("pre3", "Pre3");
				devices = devices.replace("pre", "Pre,Pre+,Pre2");												
			
				supports = devices.replace(/,/g, ", ") + " with " + 
					this._matchingThemes[0].versions.toString().replace(/,/g, ", ");
			}
			
			this.$.themeComponents.setContent(components);
			this.$.themeSupports.setContent(supports);
	
			if(this._matchingThemes[inIndex].screenshots.length > 0) {
				this.$.themeScreenshot.setSrc(this._matchingThemes[inIndex].screenshots[0]);
			}

			var dev = enyo.fetchDeviceInfo().modelNameAscii.toLowerCase();
	
			var ver = enyo.fetchDeviceInfo().platformVersionMajor +
					"." + enyo.fetchDeviceInfo().platformVersionMinor +
					"." + enyo.fetchDeviceInfo().platformVersionDot;
	
			if((this._matchingThemes[inIndex].devices.indexOf(dev) == -1) ||
				(this._matchingThemes[inIndex].versions.indexOf(ver) == -1))
			{
				this.$.themeSupports.applyStyle("color", "red");
			}
	
			return true;
		}
	},

	getThemeView: function(inIndex, inDrawer, inScreenshot) {
		if((inIndex >= 0) && (inIndex < this._matchingThemes.length)) {
			var themeComponents = [];		
			var themeScreenshots = [];

			for(var i = 0; i < this._currentThemeComponents.length; i++) {
				var component = this._currentThemeComponents[i];

				var disabled = false;

				if(inIndex == 0)
					disabled = true;
			
				if((inIndex == 0) || (this._matchingThemes[inIndex].components.indexOf(component) != -1)){
					var checked = false;

					if((inIndex == 0) || ((this._currentTheme.components[component].state == true) &&
						(this._currentTheme.components[component].theme == this._matchingThemes[inIndex].id)))
					{
						checked = true;
					}

					themeComponents.push(	
						{layoutKind: "HFlexLayout", style: "margin: 0px 11px 0px 20px;height: 40px;", components: [
							{content: component, flex: 1},
							{index: i, kind: "CheckBox", checked: checked , disabled: disabled, onChange: "handleToggleComponent"}
						]});
				}
			}

			for(var i = 0; i < this._matchingThemes[inIndex].screenshots.length; i++) {
				themeScreenshots.push({index: i, kind: "Image", src: this._matchingThemes[inIndex].screenshots[i], style: "margin: 0px 20px;", height: "50px", onclick: "handleViewScreenshot"});
			}

			var ssIndex = 0;
			var ssDrawer = false;
		
			if(inScreenshot < this._matchingThemes[inIndex].screenshots.length) {
				ssDrawer = true;
				ssIndex = inScreenshot;
			}

			var websiteLink = "";

			if(this._matchingThemes[inIndex].website)
				websiteLink = "color: #5599ff;";
	
			var removeButton = "display: block;margin-top: 10px;margin-bottom: 15px;";
			var donateLink = "display: block;";
		
			if(inIndex == 0)
				donateLink = "display: none;";
			
			if((inIndex == 0) || (!this._matchingThemes[inIndex].removable))
				removeButton = "display: none;margin-top: 10px;margin-bottom: 15px;";
					
			if((!this._matchingThemes[inIndex].donations) || (this._matchingThemes[inIndex].donations == ""))
				donateLink = "display: none;";
	
			var supportedDevice = "";
			var supportedVersion = "";
		
			var dev = enyo.fetchDeviceInfo().modelNameAscii.toLowerCase();
		
			var ver = enyo.fetchDeviceInfo().platformVersionMajor +
					"." + enyo.fetchDeviceInfo().platformVersionMinor +
					"." + enyo.fetchDeviceInfo().platformVersionDot;
		
			if(this._matchingThemes[inIndex].devices.indexOf(dev) == -1)
				supportedDevice = "color: red;";
		
			if(this._matchingThemes[inIndex].versions.indexOf(ver) == -1)
				supportedVersion = "color: red;";
	
			return {kind: "Scroller", className: "device-" + enyo.fetchDeviceInfo().modelNameAscii.toLowerCase(), autoHorizontal: false, horizontal: false, flex: 1, components: [		
				{layoutKind: "VFlexLayout", className: "theme-info-view", components: [
					{className: "theme-info-title", content: this._matchingThemes[inIndex].name + " v" + this._matchingThemes[inIndex].version},
					{className: "theme-info-section", components:[
						{kind: "DividerDrawer", caption: "Theme Screenshots", open: ssDrawer, components: [
							{kind: "Scroller", autoHorizontal: false, autoVertical: false, vertical: false, horizontal: true, className: "theme-info-screenshots", components: [
								{layoutKind: "HFlexLayout", className: "theme-info-screenshots", flex: 1, components: 		
									themeScreenshots
								}
							]}
						]}
					]},
					{layoutKind: "VFlexLayout", className: "theme-info-screenshot", components: [
						{kind: "SizeableImage", maxZoomRatio: 0, autoSize: true, src: this._matchingThemes[inIndex].screenshots[ssIndex]},
					]},
					{className: "theme-info-section", components:[
						{kind: "Divider", caption: "Theme Information"},
					]},
					{content: this._matchingThemes[inIndex].description, className: "theme-info-description"},
					{layoutKind: "HFlexLayout", components: [
						{content: "Creator:", flex: 1, className: "theme-info-information"},
						{content: this._matchingThemes[inIndex].creator, className: "theme-info-information", style: websiteLink, onclick: "openThemeWebsite"}
					]},
					{layoutKind: "HFlexLayout", components: [
						{content: "Devices:", flex: 1, className: "theme-info-information"},
						{content: this._matchingThemes[inIndex].devices.toString().replace(/,/g, ", "), className: "theme-info-information", style: supportedDevice}
					]},
					{layoutKind: "HFlexLayout", components: [
						{content: "Supports:", flex: 1, className: "theme-info-information"},
						{content: this._matchingThemes[inIndex].versions.toString().replace(/,/g, ", "), className: "theme-info-information", style: supportedVersion}
					]},
					{content: "DONATE", className: "theme-info-donate-link", style: donateLink, onclick: "openDonationsLink"},
					{className: "theme-info-section", components:[
						{kind: "DividerDrawer", caption: "Theme Components", open: inDrawer, components:                 
							themeComponents
						},
					]},
					{kind: "Button", className: "enyo-button-negative", style: removeButton, caption: "Remove This Theme", onclick: "removeViewedTheme"}
				]}
			]};
		}
	},
	
	getLeftThemeView: function(inSender, inSnap) {
		 inSnap && this._index--;

		if(this._index <= 0)
		    this._index = 0;

		if(inSnap)
			this.$.title.setContent("Local Themes (" + (this._index + 1) + "/" + this._matchingThemes.length + ")");		

		if((inSnap) && (this._changed)) {
			this._changed = false;
		
			this.$.carousel.setCenterView(this.getThemeView(this._index, false));
		}
		 
		 if(this._index <= 0)
			 return null;

		if((this._index != 0) && (this._matchingThemes[this._index].components.length == 0))
			this.$.selectButton.setDisabled(true);
		else
			this.$.selectButton.setDisabled(false);					

		 return this.getThemeView(this._index-1, false);
	},
	
	getRightThemeView: function(inSender, inSnap) {
		 inSnap && this._index++;

		 if(this._index >= (this._matchingThemes.length - 1)) 
		 	this._index = (this._matchingThemes.length - 1);

		if(inSnap)
			this.$.title.setContent("Local Themes (" + (this._index + 1) + "/" + this._matchingThemes.length + ")");		

		if((inSnap) && (this._changed)) {
			this._changed = false;
			
   		 this.$.carousel.setCenterView(this.getThemeView(this._index, false));
		}

		 if(this._index >= (this._matchingThemes.length - 1))
			 return null;

		if((this._index != 0) && (this._matchingThemes[this._index].components.length == 0))
			this.$.selectButton.setDisabled(true);
		else
			this.$.selectButton.setDisabled(false);					
		  
		 return this.getThemeView(this._index+1, false);
	},
	
	handleFlipView: function(inSender, inEvent) {
		this._currentView = "flip";
		
		this._index = inEvent.rowIndex;

		this.$.content.selectViewByIndex(0);

		this.$.title.setContent("Local Themes (" + (this._index + 1) + "/" + this._matchingThemes.length + ")");

		this.$.flipToolbar.show();		

		this.$.carousel.setCenterView(this.getThemeView(this._index, true));
	},

	handleListView: function(inSender, inEvent) {
		this._currentView = "list";

		this.$.title.setContent("Local Themes (" + this._matchingThemes.length + ")");		

		this.$.content.selectViewByIndex(1);

		this.$.themesList.render();

		this.$.flipToolbar.hide();
	},
	
	handleSelectTheme: function(inSender, inEvent) {
		if(!this._selectedThemeComponents) {
			if((this._index != 0) && (this._matchingThemes[this._index].components.length == 0))
				return;
	
			this._currentTheme.id = this._matchingThemes[this._index].id;
	
			for(var i = 0; i < this._currentThemeComponents.length; i++) {
				var component = this._currentThemeComponents[i];

				if(this._matchingThemes[this._index].components.indexOf(component) == -1) {
					this._currentTheme.components[component].state = false;
				
					this._currentTheme.components[component].theme = this._matchingThemes[0].id;
					this._currentTheme.components[component].version = this._matchingThemes[0].version;
				} else {
					this._currentTheme.components[component].state = true;
				
					this._currentTheme.components[component].theme = this._matchingThemes[this._index].id;
					this._currentTheme.components[component].version = this._matchingThemes[this._index].version;
				}			

				if(component == "App Icons") {
					for(var j = 0; j < this._previewAppIcons.length; j++) {
						var icon = this._previewAppIcons[j];

						if(this._matchingThemes[this._index].preview[icon + " Icon"] != undefined)
							this._currentTheme.preview[icon + " Icon"] = this._matchingThemes[this._index].preview[icon + " Icon"];
					}
				} else {
					if(this._matchingThemes[this._index].preview[component] != undefined)
						this._currentTheme.preview[component] = this._matchingThemes[this._index].preview[component];
				}	
			}
		}

		this.$.carousel.setCenterView(this.getThemeView(this._index, false));

		this.$.undoButton.hide();
		this.$.selectButton.setCaption("Select This Theme");
		
		this._selectedThemeComponents = false;
			
		this.doSelect(this._currentTheme, true);
	},
	
	handleToggleComponent: function(inSender, inEvent) {
		var component = this._currentThemeComponents[inSender.index];
		
		this._selectedThemeComponents = true;

		this.$.undoButton.show();
		this.$.selectButton.setCaption("Select Components");

		this._changed = true;
	
		this._currentTheme.components[component].state = inSender.getChecked();
	
		if(inSender.getChecked()) {
			this._currentTheme.components[component].theme = this._matchingThemes[this._index].id;			
			this._currentTheme.components[component].version = this._matchingThemes[this._index].version;	
		} else {
			this._currentTheme.components[component].theme = "default";
			this._currentTheme.components[component].version = "1.0.0";			
		}

		this._currentTheme.id = "default";

		for(var i = 0; i < this._currentThemeComponents.length; i++) {
			var component = this._currentThemeComponents[i];

			if((this._currentTheme.components[component].state == true) &&
				(this._currentTheme.id != this._currentTheme.components[component].theme) &&
				(this._currentTheme.components[component].theme != "default"))
			{
				if(this._currentTheme.id != "default")
					this._currentTheme.id = "custom";
				else
					this._currentTheme.id = this._currentTheme.components[component].theme;
			}
		}

		for(var i = 0; i < this._currentThemeComponents.length; i++) {
			var component = this._currentThemeComponents[i];

			if(this._currentTheme.id != "custom")
				var themeId = this._currentTheme.id;
			else
				var themeId = this._currentTheme.components[component].theme;

			for(var j = 0; j < this._matchingThemes.length; j++) {
				if(themeId == this._matchingThemes[j].id) {
					if((this._currentTheme.id != "custom") && 
						(this._currentTheme.id != "default"))
					{
						if(this._matchingThemes[j].components.indexOf(component) != -1) {
							this._currentTheme.components[component].theme = this._matchingThemes[j].id;
							this._currentTheme.components[component].version = this._matchingThemes[j].version;
						}
					}

					if(this._currentTheme.components[component].state == true)
						var sourceTheme = this._matchingThemes[j];
					else
						var sourceTheme = this._matchingThemes[0];

					if(component == "App Icons") {
						for(var k = 0; k < this._previewAppIcons.length; k++) {
							var icon = this._previewAppIcons[k];

							if(sourceTheme.preview[icon + " Icon"] != undefined)
								this._currentTheme.preview[icon + " Icon"] = sourceTheme.preview[icon + " Icon"];
						}
					} else {
						if(sourceTheme.preview[component] != undefined)
							this._currentTheme.preview[component] = sourceTheme.preview[component];
					}
				
					break;
				}
			}
		}
	},
	
	handleViewScreenshot: function(inSender, inEvent) {
		this.$.carousel.setCenterView(this.getThemeView(this._index, false, inSender.index));				
	}	
});
