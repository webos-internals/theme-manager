enyo.kind({
	name: "ThemeManager",
	kind: enyo.VFlexBox,

	_ui: "full",
	
	_size: null,

	_version: "",

	_defaultTheme: null,
	
	_defaultThemes: {
		"2.1": {
			id: "default",
		
			name: "Default WebOS Theme",
			version: "1.0.0",

			devices: [enyo.fetchDeviceInfo().modelNameAscii.toLowerCase()],

			versions: [enyo.fetchDeviceInfo().platformVersionMajor +
				"." + enyo.fetchDeviceInfo().platformVersionMinor +
				"." + enyo.fetchDeviceInfo().platformVersionDot],
			
			description: "Default WebOS theme, i.e. the same as having no theme selected.",
			creator: "HP",
			website: "http://www.hp.com/",
		
			screenshots: ["./images/default-21.png"],
		
			preview: {
				"Phone Icon": "./images/icon-phone.png",			
				"Messaging Icon": "./images/icon-messaging.png",			
				"Browser Icon": "./images/icon-browser.png",			
				"Email Icon": "./images/icon-email.png",			
				"Launcher Icon": "./images/icon-launcher.png",	
				"Just Type": "/usr/palm/sysmgr/images/search-pill.png",		
				"Quick Launcher": "/usr/palm/sysmgr/images/quick_launch_bg.png",		
				"Status Bar": "/usr/palm/sysmgr/images/statusBar/status-bar-background.png",		
				"Wallpapers": "/usr/lib/luna/system/luna-systemui/images/flowers.png"
			},
			
			components: []
		},
		"2.2": {
			id: "default",
			
			name: "Default WebOS Theme",
			version: "1.0.0",

			devices: [enyo.fetchDeviceInfo().modelNameAscii.toLowerCase()],

			versions: [enyo.fetchDeviceInfo().platformVersionMajor +
				"." + enyo.fetchDeviceInfo().platformVersionMinor +
				"." + enyo.fetchDeviceInfo().platformVersionDot],

			description: "Default WebOS theme, i.e. the same as having no theme selected.",
			creator: "HP",
			website: "http://www.hp.com/",
		
			screenshots: ["./images/default-22.png"],
		
			preview: {
				"Phone Icon": "./images/icon-phone.png",			
				"Messaging Icon": "./images/icon-messaging.png",			
				"Browser Icon": "./images/icon-browser.png",			
				"Email Icon": "./images/icon-email.png",			
				"Launcher Icon": "./images/icon-launcher.png",	
				"Just Type": "/usr/palm/sysmgr/images/search-pill.png",		
				"Quick Launcher": "/usr/palm/sysmgr/images/1.5/quick_launch_bg.png",		
				"Status Bar": "/usr/palm/sysmgr/images/statusBar/status-bar-background.png",		
				"Wallpapers": "/usr/lib/luna/system/luna-systemui/images/flowers.png"
			},
			
			components: []
		},
		"3.0": {
			id: "default",
			
			name: "Default WebOS Theme",
			version: "1.0.0",

			devices: [enyo.fetchDeviceInfo().modelNameAscii.toLowerCase()],

			versions: [enyo.fetchDeviceInfo().platformVersionMajor +
				"." + enyo.fetchDeviceInfo().platformVersionMinor +
				"." + enyo.fetchDeviceInfo().platformVersionDot],

			description: "Default WebOS theme, i.e. the same as having no theme selected.",
			creator: "HP",
			website: "http://www.hp.com/",
		
			screenshots: ["./images/default-30.png"],
		
			preview: {
				"Phone Icon": "./images/icon-phone.png",			
				"Messaging Icon": "./images/icon-messaging.png",			
				"Browser Icon": "./images/icon-browser.png",			
				"Email Icon": "./images/icon-email.png",			
				"Calendar Icon": "./images/icon-calendar.png",			
				"Launcher Icon": "/usr/palm/sysmgr/images/launcher3/launcher-icon-64.png",	
				"Just Type": "/usr/palm/sysmgr/images/search-pill.png",		
				"Quick Launcher": "/usr/palm/sysmgr/images/launcher3/quicklaunch-bg.png",		
				"Status Bar": "/usr/palm/sysmgr/images/statusBar/status-bar-background.png",		
				"Wallpaper": "/usr/lib/luna/system/luna-systemui/images/flowers.png"
			},
			
			components: []
		}
	},

	_previewAppIcons: [
		"Phone", "Messaging", "Browser", "Email", "Calendar", "Launcher"
	],

	_defaultThemeComponents: [
		"App Icons", "App Launcher", "Applications", "Boot Logo", "Enyo Widgets", "Exhibition", "Just Type", 
		"Keyboard", "Lock Screen", "Quick Launcher", "Status Bar", "System Menus", "Wallpapers"
	],

	components: [
		{kind: "ApplicationEvents", onBack: "handleBackEvent"},
	
		{kind: "AppMenu", components: [
			{caption: "Theme Library", components: [
				{caption: "Install New Themes", onclick: "installThemePackages"},
				{caption: "Re-Scan All Themes", onclick: "scanAllThemes"}		 
			]},
			 {caption: "Restart Luna", onclick: "manualLunaRestart"},
			 {caption: "About", onclick: "showAboutPopup"}
		]},
	
		{name: "aboutPopup", kind: "Popup", style: "max-width: 500px;", components: [
		    {content: "This app was brought to you by sconix from WebOS Internals, if you like this "+
  			  "app please consider <a href=\"https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=7A4RPR9ZX3TYS&lc=FI&item_name=For%20Theme%20Manager&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted\">donating</a>!<br><br>Author of the icon used for this app is: <br>eniavlys (Browse Tux)"}
		]},

		{name: "errorPopup", lazy: false, kind: "ModalDialog", caption: "Unknown Service Error", components: [
			{name: "errorText", allowHtml: true, content: "Service not responding or unknown response was returned!", className: "enyo-text-error"}, 
			{kind: "Button", caption: "OK", onclick: "handleErrorClosed", style: "margin-top: 10px;"}
		]},

		{name: "updateDialog", kind: "DialogPrompt", title: "Current Theme Updated", 
			acceptButtonCaption: "Yes, do it now", cancelButtonCaption: "No, I do it later", onAccept: "handleThemeApply", 
				message: "Theme removed or newer version was installed of the theme(s) you had set as your current theme. " +
					"Your current theme was updated, please apply the theme if you want to take it in use. Apply the theme now?"},

		{name: "installPicker", kind: "wi.Picker", title: "Zip files in Downloads", multiSelect: true, onSelect: "handleThemesInstall"},

		{name: "appPane", kind: "SlidingPane", flex: 1, style: "background: #666666;", onSlideComplete: "adjustPanels", components: [
			{name: "left", width: "320px", components: [
				{name: "leftPane", kind: "Pane", transitionKind: "enyo.transitions.Simple", style: "z-index: 1;", flex: 1, components: [
					{layoutKind: "VFlexLayout", flex: 1, pack: "top", components: [
						{kind: "wi.Header", random: [{weight: 100, tagline: "Tweak the hell out of webOS!"}]}, 

						{layoutKind: "VFlexLayout", flex: 1, align: "center", pack: "center", components: [
							{name: "leftSpinner", kind: "SpinnerLarge"},
							{name: "leftProgress", content: "Scanning installed themes...", style: "margin: 0px 0px 10px 0px; font-size: 0.7em; color: #666666;"}
						]}, 
					]},
					
					{name: "clsPreview", kind: "Preview", className: "enyo-bg", onChangeView: "handleChangeView", onSelect: "handleThemeSelect"}, 
					{name: "clsStartup", kind: "Startup", className: "enyo-bg", onDone: "handleStartupDone"},
				]}
			]},
			{name: "middle", fixedWidth: true, width: "704px", dragAnywhere: false, className: "blank-slider", components: [
				{name: "middlePane", kind: "Pane", transitionKind: "enyo.transitions.Simple", flex: 1, components: [
					{layoutKind: "VFlexLayout", flex: 1, align: "center", pack: "center", style: "background: #666666;", components: [
						{name: "middleImage", kind: "Image", src: "images/empty-icon.png"}, 
						{name: "middleSpinner", kind: "SpinnerLarge"},
						{name: "middleProgress", content: "Scanning installed themes...", style: "display: none;margin-top: -10px; font-size: 0.7em; color: #999999;"}
					]},

					{name: "clsLibrary", kind: "Library", flex: 1, className: "enyo-bg", onUndo: "handleThemeReset", onSelect: "handleThemeUpdate", onRemove: "handleThemeRemove"}
				]}
			]}
		]},

		{name: "srvThemeManager", kind: "PalmService", service: "palm://org.webosinternals.thememanager.srv/", method: "control", 
			onFailure: "handleServiceError"},

		{name: "getCurrentWallpaper", kind: "PalmService", service: "palm://com.palm.systemservice/", subscribe: true, method: "getPreferences", 
			onSuccess: "handleGetWallpaper", onFailure: "handleGetWallpaper"}
	],
	
	rendered: function() {
		this.inherited(arguments);

		enyo.keyboard.setResizesWindow(false);

		enyo.error("DEBUG - Device: " + enyo.fetchDeviceInfo().modelNameAscii);

		this.adjustInterface();

		this._version = enyo.fetchDeviceInfo().platformVersionMajor +
			"." + enyo.fetchDeviceInfo().platformVersionMinor;

		if((localStorage) && (localStorage["version"])) {
			version = localStorage["version"];

			if(version != enyo.fetchAppInfo().version) {
				this.$.clsStartup.hideWelcomeText();

				this.$.leftPane.selectViewByIndex(2);
			} else {
				this.handleStartupDone();
			}
		} else {
			this.$.leftPane.selectViewByIndex(2);
		}

		localStorage["version"] = enyo.fetchAppInfo().version;
	},
		
	resizeHandler: function() {
		this.adjustInterface();

		this.$.clsLibrary.refreshView();
	},

	adjustPanels: function() {
		// This is to overcome the bug in the carousel widget

		if(this._ui == "compact") {
			if(this.$.appPane.getViewIndex() == 1) {
				this.$.clsLibrary.$.carousel.show();
				this.$.clsLibrary.refreshView();
			}				
		}
	},

	adjustInterface: function() {
		this._size = enyo.fetchControlSize(this);

		if(this._size.w <= 500) {
			this._ui = "compact";
		
			enyo.setAllowedOrientation("up");

			this.$.clsPreview.enableButtons();
		} else {
			this.$.middle.applyStyle("width", (this._size.w - 320) + "px");
		}
		
		this.$.clsStartup.adjustInterface(this._size);
	},

	showSpinner: function() {
		this.$.middleImage.hide();

		if(this._ui == "compact") {
			this.$.leftSpinner.show();

			this.$.leftPane.selectViewByIndex(0);
		} else {
			this.$.leftPane.selectViewByIndex(1);
		}
		
		this.$.middleSpinner.show();

		this.$.middlePane.selectViewByIndex(0);
	},
	
	hideSpinner: function() {
		if(this._ui == "compact") {
			this.$.leftPane.selectViewByIndex(1);
		
			this.$.leftSpinner.hide();
		}
		
		this.$.middlePane.selectViewByIndex(1);

		this.$.middleSpinner.hide();
	},	

	handleStartupDone: function(inSender, inEvent) {
		this.showSpinner();
		
		this.$.middleProgress.applyStyle("display", "block");
		
		this.$.getCurrentWallpaper.call({"keys": ["wallpaper"]});	
	},

	showAboutPopup: function() {
		this.$.aboutPopup.openAtCenter();
	},

	installThemePackages: function() {
		this.$.srvThemeManager.call({action: "list"}, 
			{onSuccess:"handlePackagesList"});
	},

	manualLunaRestart: function() {
		this.$.clsPreview.handleThemeFinished();
	},

	scanAllThemes: function() {
		this.showSpinner();

		var device = enyo.fetchDeviceInfo().modelNameAscii.toLowerCase();
		
		var version = this._version + "." + enyo.fetchDeviceInfo().platformVersionDot;

		this.$.srvThemeManager.call({action: "scan", device: device, version: version}, 
			{onSuccess:"handleThemesScanned"});
	},

	handleBackEvent: function(inSender, inEvent) {
		if((this._ui == "compact") && (this.$.appPane.getViewIndex() > 0)) {
			enyo.stopEvent(inEvent);

			this.$.clsLibrary.$.carousel.hide();
			
			this.$.appPane.back();
		}
	},

	handleChangeView: function(inSender, inView) {
		if(this._ui == "compact")
			this.$.appPane.selectViewByIndex(1);
	},
	
	handleThemeSelect: function(inSender, inThemeId) {
		if(this._ui == "compact")
			this.$.appPane.selectViewByIndex(1);
		
		this.$.clsLibrary.selectTheme(inThemeId);
	},

	handleThemeReset: function(inSender, inEvent) {	
		this.$.clsLibrary.updateTheme(this._defaultTheme);
	},
		
	handleThemeUpdate: function(inSender, inTheme, inShow) {
		if(this._ui == "compact") {
			this.$.clsLibrary.$.carousel.hide();
		
			this.$.appPane.selectViewByIndex(0);
		}
		
		this._defaultTheme  = {id: inTheme.id, components: {}};
		
		this._defaultTheme .preview = enyo.clone(inTheme.preview);

		for(var component in inTheme.components) {
			this._defaultTheme .components[component] = enyo.clone(inTheme.components[component]);
		}

		this.$.clsPreview.updateTheme(this._defaultTheme);
	},

	handleErrorClosed: function(inSender, inEvent) {
		this.$.errorPopup.close();
	},

	handleServiceError: function(inSender, inResponse) {
		enyo.error("DEBUG - Error response: " + enyo.json.stringify(inResponse));
		
		this.$.errorPopup.openAtCenter();
	},

	handleGetWallpaper: function(inSender, inResponse) {
		enyo.error("DEBUG - Wallpaper response: " + enyo.json.stringify(inResponse));
		
		if((inResponse) && (inResponse.wallpaper))
			this._defaultThemes[this._version].preview["Wallpapers"] = inResponse.wallpaper.wallpaperFile;

		var device = enyo.fetchDeviceInfo().modelNameAscii.toLowerCase();
		
		var version = this._version + "." + enyo.fetchDeviceInfo().platformVersionDot;

		this.$.srvThemeManager.call({action: "scan", device: device, version: version}, 
			{onSuccess:"handleThemesScanned"});
	},

	handlePackagesList: function(inSender, inResponse) {
		enyo.error("DEBUG - Packages response: " + enyo.json.stringify(inResponse));

		this.$.installPicker.setItems(inResponse.files);
		
		this.$.installPicker.openPicker();
	},

	handleThemesScanned: function(inSender, inResponse) {
		enyo.error("DEBUG - Scanned response: " + enyo.json.stringify(inResponse));

		for(var i = 0; i < inResponse.themes.length ; i++)
			enyo.error("DEBUG - Scanned response " + i + ": " + enyo.json.stringify(inResponse.themes[i]));

		this.hideSpinner();

		if(this._defaultTheme) {
			var theme = this._defaultTheme;
		} else {
			var theme = {
				id: this._defaultThemes[this._version].id, components: {},
				preview: enyo.clone(this._defaultThemes[this._version].preview)
			};
			
			if((localStorage) && (localStorage["theme"]))
				theme = enyo.json.parse(localStorage["theme"]);
		}

		var themes = [this._defaultThemes[this._version]];

		if((inResponse) && (inResponse.themes)) {
			themes = themes.concat(inResponse.themes);

			this.updateThemeInformation(theme, themes);
		}

		this._defaultTheme = theme;

		if((inResponse) && (inResponse.exception)) {
			this.$.errorPopup.openAtCenter();
		} else if((inResponse) && (inResponse.errors.length > 0)) {
			this.$.errorPopup.setCaption("Some Themes Have Errors");
			
			this.$.errorText.setContent("Some of the installed themes have corrupted or missing JSON data. Detected problems: <br><br>" + 
				inResponse.errors.toString().replace(/,/g, "<br>"));

			this.$.errorPopup.openAtCenter();
		}
	},
	
	handleThemeApply: function(inSender) {
		this.$.clsPreview.handleThemeApply();
	},
	
	handleThemesInstall: function(inSender, inFiles) {
		if(inFiles.length > 0) {
			this.showSpinner();

			this.$.srvThemeManager.call({action: "install", files: inFiles}, 
				{onSuccess:"handleThemesInstalled"});
		}
	},

	handleThemesInstalled: function(inSender, inResponse) {
		enyo.error("DEBUG - Installed response: " + enyo.json.stringify(inResponse));
	
		if(inResponse.stdout.length > 0) {
			this.$.errorPopup.setCaption("Failed Theme Installation");
			
			this.$.errorText.setContent("Some of the packages failed to install. " + 
				"The reason for this is most likely broken zip file or that zip did not contain Theme Manager compatible theme. " + 
				"Failed package(s): <br>" + inResponse.stdout.replace(/ /g, "<br>"));

			this.$.errorPopup.openAtCenter();
		}		
	
		this.scanAllThemes();
	},

	handleThemeRemove: function(inSender, inThemeId) {
		this.showSpinner();

		this.$.srvThemeManager.call({action: "remove", dir: inThemeId}, 
			{onSuccess:"handleThemeRemoved"});
	},

	handleThemeRemoved: function(inSender, inResponse) {
		enyo.error("DEBUG - Removed response: " + enyo.json.stringify(inResponse));

		var device = enyo.fetchDeviceInfo().modelNameAscii.toLowerCase();
		
		var version = this._version + "." + enyo.fetchDeviceInfo().platformVersionDot;

		this.$.srvThemeManager.call({action: "scan", device: device, version: version}, 
			{onSuccess:"handleThemesScanned"});
	},

//	

	getThemeIndex: function(inThemeId, inThemes) {
		for(var i = 0; i < inThemes.length; i++) {
			if(inThemeId == inThemes[i].id) {
				return i;
			}
		}

		return -1;
	},
	
	updateThemeInformation: function(inTheme, inThemes) {
		var themeUpdated = false;

		var themeSavedId = inTheme.id;

		inTheme.id = "default";

		for(var i = 0; i < this._defaultThemeComponents.length; i++) {
			var component = this._defaultThemeComponents[i];

			if(inTheme.components[component] == undefined) {
				inTheme.components[component] = { state: false, theme: "default", version: "1.0.0"};
			}

			if(themeSavedId != "custom")
				var themeIdx = this.getThemeIndex(themeSavedId, inThemes);
			else
				var themeIdx = this.getThemeIndex(inTheme.components[component].theme, inThemes);

			if((themeIdx == -1) || 
				((inThemes[themeIdx].components.indexOf(component) == -1) &&
				((inTheme.components[component].state != false) ||
				(inTheme.components[component].theme != "default"))))
			{
				themeUpdated = true;
	
				inTheme.components[component].state = false;
				inTheme.components[component].theme = "default";
				inTheme.components[component].version = "1.0.0";
			}
			else if((themeSavedId != "custom") &&
				(inThemes[themeIdx].components.indexOf(component) != -1) &&
				(inTheme.components[component].theme == "default"))
			{
				themeUpdated = true;

				inTheme.components[component].state = false;
				inTheme.components[component].theme = inThemes[themeIdx].id;
				inTheme.components[component].version = inThemes[themeIdx].version;
			} 
			else if((inThemes[themeIdx].version != inTheme.components[component].version) &&
				(inTheme.components[component].theme != "default"))
			{
				themeUpdated = true;
	
				inTheme.components[component].version = inThemes[themeIdx].version;
			} 
	
			if((inTheme.components[component].state == true) &&
				(inTheme.id != inTheme.components[component].theme) &&
				(inTheme.components[component].id != "default"))
			{
				if(inTheme.id != "default")
					inTheme.id = "custom";
				else
					inTheme.id = inTheme.components[component].theme;
			}

			if(inTheme.components[component].state != true)
				var sourceTheme = inThemes[0];
			else
				var sourceTheme = inThemes[themeIdx];

			this.updatePreviewInformation(component, inTheme, sourceTheme);
		}
		
		this.$.clsPreview.updateThemes(inTheme, inThemes);

		this.$.clsLibrary.updateThemes(inTheme, inThemes);

		if(themeUpdated) {
			if(this._ui == "compact") {
				this.$.clsLibrary.$.carousel.hide();
						
				this.$.appPane.selectViewByIndex(0);
			}
			
			this.$.updateDialog.open();
		}
	},
	
	updatePreviewInformation: function(inComponent, inThemeTarget, inThemeSource) {
		if(inComponent == "App Icons") {
			for(var i = 0; i < this._previewAppIcons.length; i++) {
				var icon = this._previewAppIcons[i];
	
				if((inThemeSource) && (inThemeSource.preview[icon + " Icon"] != undefined))
					inThemeTarget.preview[icon + " Icon"] = inThemeSource.preview[icon + " Icon"];
			}
		} else {
			if((inThemeSource) && (inThemeSource.preview[inComponent] != undefined))
				inThemeTarget.preview[inComponent] = inThemeSource.preview[inComponent];
		}	
	}
});

