enyo.kind({
	name: "Startup",
	kind: enyo.VFlexBox,
	flex: 1,
	className: "basic-back",
	
	events: {
		onDone: ""
	},
	
	components: [
		{name: "startupView", layoutKind: "VFlexLayout", flex: 1, components: [
			{name: "startupHeader", kind: "wi.Header", random: [{weight: 100, tagline: "Welcome to Theme Manager!"}]},

			{layoutKind: "VFlexLayout", flex: 1, align: "left", style: "padding-right: 10px; font-size: 14px;", components: [
				{name: "startupScroller", kind: "Scroller", height: "613px", components: [
					{name: "instructions", content: "<br><center><b>Here is some basic information for new users:</b></center><ul>" +
						"<li><b>If you have none supported theme installed you should remove it before applying themes with Theme Manager!</b></li>" +
						"<li>You can use themes as they are or make your own custom theme by selecting components from multiple themes</li>" +
						"<li>The theme preview picture is just an estimation of how the theme would look like and not an actual screenshot</li>" +
						"<li>Before you install an OTA update make sure your theme supports the new version, after OTA just re-apply the theme</li>" +
						"<li>Theme applying will take some time, might take even three to five minutes with big themes, so be patient</li>" +
						"</ul><br>"},
					
					{kind: "Divider", caption: "0.9.5"},
					{content: "<ul><li>Moved to using AUSMT scripts / directory structure</li>" +
						"<li>Fixed icons preview for latest webOS release</li></ul>"},

					{kind: "Divider", caption: "0.9.2"},
					{content: "<ul><li>Added skipping of invalid theme directories</li></ul>"},

					{kind: "Divider", caption: "0.9.1"},
					{content: "<ul><li>Allowed patching of index.html files</li></ul>"},

					{kind: "Divider", caption: "0.9.0"},
					{content: "<ul><li>Fixed bug in themes scan that caused weird problems</li></ul>"},

					{kind: "Divider", caption: "0.8.9"},
					{content: "<ul><li>Small update for the theme installation scripts</li></ul>"},

					{kind: "Divider", caption: "0.8.5"},
					{content: "<ul><li>Small code cleanups/changes and spelling fixes</li>" +
						"<li>Added support for themes installed by ipk</li></ul>"},

					{kind: "Divider", caption: "0.8.1"},
					{content: "<ul><li>Fixed patching/replacing of files located in cryptofs</li></ul>"},

					{kind: "Divider", caption: "0.8.0"},
					{content: "<ul><li>Added searching/filtering of locally installed themes</li></ul>"},

					{kind: "Divider", caption: "0.7.0"},
					{content: "<ul><li>Changed how the components are selected for custom theme</li>" + 
						"<li>Added discovery/list view mode for theme library browser</li></ul>"},

					{kind: "Divider", caption: "0.6.9"},
					{content: "<ul><li>Fixed third party applications theming which was broken</li></ul>"},

					{kind: "Divider", caption: "0.6.8"},
					{content: "<ul><li>Small fix for situation when app was closed while applying theme</li></ul>"},

					{kind: "Divider", caption: "0.6.7"},
					{content: "<ul><li>Fixed a bug in theme applying process that could have caused problems</li></ul>"},

					{kind: "Divider", caption: "0.6.6"},
					{content: "<ul><li>Fixed serious bug that caused theme apply time to grow every time</li></ul>"},

					{kind: "Divider", caption: "0.6.5"},
					{content: "<ul><li>Fixed a bug that caused problems if wallpaper retrieval failed</li>" +
						"<li>More finishing touches for the UI when used on phones</li></ul>"},

					{kind: "Divider", caption: "0.6.0"},
					{content: "<ul><li>Cleaned up the code and fine tuned the user interface</li>" +
						"<li>Fixed a bug that caused theme scanning to abort with custom theme</li></ul>"},

					{kind: "Divider", caption: "0.5.5"},
					{content: "<ul><li>Added showing of themes scanning info for phones</li>" +
						"<li>Added support for Boot Logo component</li></ul>"},

					{kind: "Divider", caption: "0.5.4"},
					{content: "<ul><li>Changed all file extension checks to ignore case</li></ul>"},

					{kind: "Divider", caption: "0.5.3"},
					{content: "<ul><li>Fixed the user interface adjusting on a TouchPad</li></ul>"},
				
					{kind: "Divider", caption: "0.5.2"},
					{content: "<ul><li>Fixed the install dialog when scrolling</li>" + 
						"<li>Fixed installing of packages with version number</li>" + 
						"<li>Made the app work correctly on emulator</li></ul>"},
				
					{kind: "Divider", caption: "0.5.1"},
					{content: "<ul><li>Fixed themes installation when more than two selected</li></ul>"},

					{kind: "Divider", caption: "0.5.0"},
					{content: "<ul><li>First beta release, please report any problems you find</li>" +
								"<li>Added menu option for re-scanning all installed themes</li>" +
								"<li>Made the popup dialogs more informative in case of errors</li>" +
								"<li>Optimized the theme applying process to be little bit faster</li>" + 
								"<li>Changed to a custom install dialog that works on phones as well</li>" + 
								"<li>Changed the install dialog to only show zip files from downloads</li></ul>"},
				
					{kind: "Divider", caption: "0.2.0"},
					{content: "<ul><li>Made the app work on phones and added removing of themes</li>" +
								"<li>Added removing of themes and more information to be shown</li>" +
								"<li>Added device and webOS version matching for theme scanning</li></ul>"},
				
					{kind: "Divider", caption: "0.1.2"},
					{content: "<ul><li>Initial alpha release of Theme Manager app for webOS</li></ul>"}
				]}
			]},
		
			{kind: "Toolbar", pack: "center", className: "enyo-toolbar-light", components: [
				{kind: "Button", caption: "Ok, I've read this. Let's continue ...", onclick: "handleDoneReading"}
			]}
		]}
	],

	adjustInterface: function(inSize) {
		this.$.startupScroller.applyStyle("height", (inSize.h - 87) + "px");
	},
	
	hideWelcomeText: function() {
		this.$.instructions.hide();

		this.$.startupHeader.setTagLine("Have you already <a href=\"https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=7A4RPR9ZX3TYS&lc=FI&item_name=For%20Theme%20Manager&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted\">donated</a>?");
	},
	
	handleDoneReading: function(inSender, inEvent) {
		this.doDone();
	}
});

