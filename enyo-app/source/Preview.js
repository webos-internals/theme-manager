enyo.kind({
	name: "Preview",
	kind: enyo.VFlexBox,
	flex: 1,
	className: "basic-back",
	
	events: {
		onSelect: "",
		onChangeView: ""
	},

	_currentTheme: null,

	_currentThemes: null,
	
	_currentThemeComponents: [
		"App Icons", "App Launcher", "Applications", "Boot Logo", "Enyo Widgets", "Exhibition", "Just Type", 
		"Keyboard", "Lock Screen", "Quick Launcher", "Status Bar", "System Menus", "Wallpapers"
	],
	
	components: [
		{name: "busyPopup", kind: "Popup", components: [
		    {content: "Theme applying is still in progress, please wait couple minutes and try again."}
		]},

		{name: "infoPopup", kind: "Popup", style: "max-width: 500px", components: [
		    {content: "Applying the theme can take few minutes, you can continue to use " +
		    			  "the application while the theme is being applied. You will get a " +
		    			  "notification when the theme has been applied."}
		]},

		{name: "lunaDialog", kind: "DialogPrompt", title: "Luna Restart", 
			acceptButtonCaption: "Yes", cancelButtonCaption: "No", onAccept: "handleDoApply", 
				message: "For the new theme to be fully in use you need to restart Luna which will " +
					"close all your open applications. Do you want to restart Luna now?"},

		{name: "serviceError", kind: "ModalDialog", caption: "Theme Applying Error", components: [
			{content: "Something went wrong in applying the theme! See /media/internal/webos-ausmt.log for the error.", 
				className: "enyo-text-error"}, 
			{kind: "Button", caption: "OK", onclick: "handleErrorClosed", style: "margin-top: 10px;"}
		]},

		{name: "mainView", layoutKind: "VFlexLayout", flex: 1, components: [
			{kind: "wi.Header", random: [{weight: 100, tagline: "Appearance is everything, right?"}]},
			
			{kind: "Scroller", className: "device-" + enyo.fetchDeviceInfo().modelNameAscii.toLowerCase(), autoHorizontal: false, horizontal: false, flex: 1, components: [
				{name: "themeTitle", kind: "Divider", caption: "Current Theme"},
				{layoutKind: "VFlexLayout", align: "left", style:"margin: 0px 20px 15px 20px;", pack: "top", components: [
					{name: "themeName", className: "theme-main-title", content: "Default WebOS Theme"},
					{name: "themePreview", className: "theme-main-preview", kind: "HtmlContent", srcId: "themePreview"}
				]},	
				{kind: "Divider", caption: "Theme Components"},
				{layoutKind: "VFlexLayout", flex: 1, style:"margin: 10px 20px 15px 20px;", components: [
					{name: "themeComponents", kind: "VirtualRepeater", onSetupRow: "getComponentItem", components: [
						{layoutKind: "HFlexLayout", style: "height: 40px;", onclick: "showComponentTheme", components: [
							{name: "componentName", content: "", flex: 1, style: "padding-left:5px;"},
							{name: "componentState", style: "margin-right: 3px;", kind: "CheckBox", disabled: true}
						]}
					]}
				]}
			]},
						
			{kind: "Toolbar", pack: "center", className: "enyo-toolbar-light", components: [
				{name: "viewRemote", kind: "ToolButton", icon: "./images/empty-button.png", style: "display: none;"},
				{kind: "Spacer", flex: 1}, 				
				{name: "install", kind: "ActivityButton", disabled: true, caption: "Apply Current Theme", onclick: "handleThemeApply"},
				{kind: "Spacer", flex: 1}, 				
				{name: "viewLocal", kind: "ToolButton", icon: "./images/local-button.png", style: "display: none;", onclick: "handleChangeView"}
			]}
		]},

		{name: "srvRestartLuna", kind: "PalmService", service: "palm://org.webosinternals.ipkgservice", method: "restartLuna"}, 
		
		{name: "handleThemeApply", kind: "PalmService", service: "palm://org.webosinternals.thememanager.srv/", method: "control", onSuccess:"handleThemeApplied", onFailure: "handleServiceError"},

		{name: "setPreferences", kind: "PalmService", service: "palm://com.palm.systemservice", method: "setPreferences", onSuccess: "handleThemeFinished", onFailure: "handleThemeFinished"}, 
		
		{name: "importWallpaper", kind: "PalmService", service: "palm://com.palm.systemservice/wallpaper", method: "importWallpaper", onSuccess: "handleWallpaperImport", onFailure: "handleWallpaperImport"}, 
	],
	
	enableButtons: function() {
		this.$.viewRemote.setStyle("display", "block");
		this.$.viewLocal.setStyle("display", "block");
	},
	
	updateTheme: function(inTheme) {
		this._currentTheme = inTheme;
		
		if(inTheme.id == "custom")		
			this.$.themeName.setContent("Custom WebOS Theme");
		else if(inTheme.id == "default")		
			this.$.themeName.setContent("Default WebOS Theme");
		else {	
			for(var i = 0; i < this._currentThemes.length; i++) {
				if(inTheme.id == this._currentThemes[i].id) {
					this.$.themeName.setContent(this._currentThemes[i].name);
					break;
				}
			}
		}
		
		enyo.byId("previewBackground").style.backgroundImage = "url(" + this._currentTheme.preview["Wallpapers"] + ")";

		enyo.byId("previewStatusBar").style.backgroundImage = "url(" + this._currentTheme.preview["Status Bar"] + ")";

		enyo.byId("previewJustTypeLeft").style.backgroundImage = "url(" + this._currentTheme.preview["Just Type"] + ")";

		if(this._currentTheme.preview["Just Type"]) 
			enyo.byId("previewJustTypeCenter").style.backgroundImage = "url(" + this._currentTheme.preview["Just Type"] + ")";
		
		enyo.byId("previewJustTypeRight").style.backgroundImage = "url(" + this._currentTheme.preview["Just Type"] + ")";

		enyo.byId("previewQuickLauncher").style.backgroundImage = "url(" + this._currentTheme.preview["Quick Launcher"] + ")";

		enyo.byId("previewPhoneIcon").style.backgroundImage = "url(" + this._currentTheme.preview["Phone Icon"] + ")";
		enyo.byId("previewMessagingIcon").style.backgroundImage = "url(" + this._currentTheme.preview["Messaging Icon"] + ")";
		enyo.byId("previewBrowserIcon").style.backgroundImage = "url(" + this._currentTheme.preview["Browser Icon"] + ")";
		enyo.byId("previewEmailIcon").style.backgroundImage = "url(" + this._currentTheme.preview["Email Icon"] + ")";

		if(this._currentTheme.preview["Calendar Icon"]) 
			enyo.byId("previewCalendarIcon").style.backgroundImage = "url(" + this._currentTheme.preview["Calendar Icon"] + ")";
		
		enyo.byId("previewAppLauncherIcon").style.backgroundImage = "url(" + this._currentTheme.preview["Launcher Icon"] + ")";

		this.$.themeComponents.render();						

		this.$.install.setDisabled(false);
	},
	
	updateThemes: function(inTheme, inThemes) {
		this._currentThemes = inThemes;
		
		this.updateTheme(inTheme);
	},
	
	getComponentItem: function(inSender, inIndex) {
		if(inIndex < this._currentThemeComponents.length) {
			var component = this._currentThemeComponents[inIndex];
		
			this.$.componentName.setContent(component);

			if((!this._currentTheme) || (this._currentTheme.id == "default")) {
				this.$.componentState.setChecked(true);		
			} else {
				if(this._currentTheme.components[component].theme == "default")
					this.$.componentName.applyStyle("color", "#666666");
				
				this.$.componentState.setChecked(this._currentTheme.components[component].state);		
			}
				
			return true;
		}
	},

	showComponentTheme: function(inSender, inEvent) {
		var component = this._currentThemeComponents[inEvent.rowIndex];
		
		this.doSelect(this._currentTheme.components[component].theme);
	},

	handleErrorClosed: function() {
		this.$.serviceError.close();

		this.$.install.setActive(false);	
	},

	handleServiceError: function(inSender, inResponse) {
		this.$.infoPopup.close();

		this.$.serviceError.openAtCenter();	
	},

	handleDoApply: function() {
		this.$.srvRestartLuna.call({});	
	},

	handleChangeView: function(inSender, inEvent) {
		this.doChangeView("themes");
	},

	handleThemeApply: function(inSender, inEvent) {
		this.$.infoPopup.openAtCenter();
	
		localStorage["theme"] = enyo.json.stringify(this._currentTheme);
		
		this.$.install.setDisabled(true);

		this.$.install.setActive(true);

		var device = enyo.fetchDeviceInfo().modelNameAscii.toLowerCase();
		
		var version = enyo.fetchDeviceInfo().platformVersionMajor + "." + 
			enyo.fetchDeviceInfo().platformVersionMinor + "." + 
			enyo.fetchDeviceInfo().platformVersionDot;

		this.$.handleThemeApply.call({action: "apply", theme: this._currentTheme,
			device: device, version: version});
	},

	handleThemeApplied: function(inSender, inResponse) {
		enyo.error("DEBUG - Apply response: " + enyo.json.stringify(inResponse));

		if((inResponse) && (inResponse.busy == true)) {
			this.$.infoPopup.close();
					
			this.$.busyPopup.openAtCenter();
		} else {
			if((inResponse) && (inResponse.wallpaper))
				this.$.importWallpaper.call({'target': inResponse.wallpaper});
			else
				this.handleThemeFinished();
		}
	},
	
	handleThemeFinished: function(inSender, inResponse) {
		this.$.infoPopup.close();

		this.$.install.setDisabled(false);

		this.$.install.setActive(false);
	
		this.$.lunaDialog.open();
	},
	
	handleWallpaperImport: function (inSender, inResponse) {
		if((inResponse) && (inResponse.wallpaper))
			this.$.setPreferences.call({'wallpaper': inResponse.wallpaper});
		else
			this.handleThemeFinished();
	}
});

