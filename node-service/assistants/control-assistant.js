var ControlAssistant = function() {
}

//

ControlAssistant.prototype.setup = function() {  
}

ControlAssistant.prototype.run = function(future) {
	if(this.controller.args.action == "list")
		this.listThemes(future, this.controller.args);
	else if(this.controller.args.action == "scan")
		this.scanThemes(future, this.controller.args);
	else if(this.controller.args.action == "apply")
		this.applyTheme(future, this.controller.args);
	else if(this.controller.args.action == "remove")
		this.removeTheme(future, this.controller.args);
	else if(this.controller.args.action == "install")
		this.installThemes(future, this.controller.args);
	else
		future.result = { returnValue: false };
}

ControlAssistant.prototype.cleanup = function() {  
}

//

ControlAssistant.prototype.listThemes = function(future, args) {
	var fs = IMPORTS.require('fs');

	var exec = IMPORTS.require('child_process').exec;

	try { 
		var files = fs.readdirSync("/media/internal/downloads");
	} catch(error) { 
		future.result = { returnValue: false, 'exception': error };

		return;
	}

	var zipFiles = [];

	for(var fileIdx = 0; fileIdx < files.length; fileIdx++) {		
		var stat = fs.statSync("/media/internal/downloads/" + files[fileIdx]);

		if((stat) && (stat.isFile())) {
			if(files[fileIdx].slice(-4).toLowerCase() == ".zip")
				zipFiles.push({label: files[fileIdx], value: "/media/internal/downloads/" + files[fileIdx]});
		}
	}

	future.result = { returnValue: false, 'files': zipFiles };
}

ControlAssistant.prototype.scanThemes = function(future, args) {
	if((args.device) && (args.version)) {
		var fs = IMPORTS.require('fs');

		var exec = IMPORTS.require('child_process').exec;

		var cmd = "sh /media/cryptofs/apps/usr/palm/services/org.webosinternals.thememanager.srv/sh-scripts/scan";

		exec(cmd, function(future, error, stdout, stderr) {
			if(error !== null) {
				console.error("DEBUG - Scan exception: " + JSON.stringify(error));
		
				error.errorCode = error.code;
		
				future.exception = error;
			} else {
				var errors = new Array();
				var themes = new Array();

				var themeDirs = new Array();
	
				try { themeDirs = fs.readdirSync("/media/internal/.themes"); } catch(error) { themeDirs = []; }

				for(var dirIdx = 0; dirIdx < themeDirs.length; dirIdx++) {		
					var stat = fs.statSync("/media/internal/.themes/" + themeDirs[dirIdx]);
					
					if((stat) && (stat.isDirectory())) {		
						if((themeDirs[dirIdx] != ".org.webosinternals.thememanager-theme") && (themeDirs[dirIdx] != ".tmptheme") &&
							(themeDirs[dirIdx] != "custom") && (themeDirs[dirIdx] != "default"))
						{		
							var removable = true;

							if(themeDirs[dirIdx].slice(0,1) == ".")
								removable = false;

							try { var fileData = fs.readFileSync("/media/internal/.themes/" + themeDirs[dirIdx] + '/theme.json', 'utf8'); } catch(error) {
								errors.push("No JSON file in: " + themeDirs[dirIdx]);

								continue;
							}

							try { var jsonData = JSON.parse(fileData); } catch(error) { 
								errors.push("Invalid JSON data in: " + themeDirs[dirIdx] + "/theme.json");
					
								continue;
							}	

							if((jsonData.name == undefined) || (jsonData.version == undefined) || 
								(jsonData.devices == undefined) || (jsonData.themedata == undefined) || 
								(jsonData.description == undefined) || (jsonData.creator == undefined) ||
								(jsonData.website == undefined) || (jsonData.screenshots == undefined) ||
								(jsonData.name == "Default WebOS Theme") || (jsonData.name == "Custom Theme"))
							{
								errors.push("Required sections missing in: " + themeDirs[dirIdx] + "/theme.json");

								continue;
							}
				
							var preview = {};
							var versions = [];
							var components = [];
							var screenshots = [];
				
							var version = args.version;
				
							for(var ver in jsonData.themedata)
								versions.push(ver);
		
							for(var i = 0; i < jsonData.screenshots.length; i++) {
								screenshots.push("/media/internal/.themes/" + themeDirs[dirIdx] + "/" + jsonData.screenshots[i]);
							}
	
							if((jsonData.themedata) && (jsonData.themedata[version]) &&
								(jsonData.themedata[version].alias != undefined))
							{
								version = jsonData.themedata[version].alias;
							}

							if((jsonData.devices.indexOf(args.device) != -1) && (jsonData.themedata[version] != undefined)) {
								if(jsonData.themedata[version].app_icons) {
									components.push("App Icons");

									if(jsonData.themedata[version].app_icons.images) {
										for(var i = 0; i < jsonData.themedata[version].app_icons.images.length; i++) {
											if(jsonData.themedata[version].app_icons.images[i].path == "/usr/palm/applications/com.palm.app.phone/icon.png")
												preview["Phone Icon"] = "/media/internal/.themes/" + themeDirs[dirIdx] + "/" + jsonData.themedata[version].app_icons.images[i].file;

											else if(jsonData.themedata[version].app_icons.images[i].path == "/usr/palm/applications/com.palm.app.messaging/icon.png")
												preview["Messaging Icon"] = "/media/internal/.themes/" + themeDirs[dirIdx] + "/" + jsonData.themedata[version].app_icons.images[i].file;
											else if(jsonData.themedata[version].app_icons.images[i].path == "/usr/palm/applications/com.palm.app.messaging/1.5/icon.png")
												preview["Messaging Icon"] = "/media/internal/.themes/" + themeDirs[dirIdx] + "/" + jsonData.themedata[version].app_icons.images[i].file;
											else if(jsonData.themedata[version].app_icons.images[i].path == "/media/cryptofs/apps/usr/palm/applications/com.palm.app.messaging/icon.png")
												preview["Messaging Icon"] = "/media/internal/.themes/" + themeDirs[dirIdx] + "/" + jsonData.themedata[version].app_icons.images[i].file;

											else if(jsonData.themedata[version].app_icons.images[i].path == "/usr/palm/applications/com.palm.app.browser/icon.png")
												preview["Browser Icon"] = "/media/internal/.themes/" + themeDirs[dirIdx] + "/" + jsonData.themedata[version].app_icons.images[i].file;

											else if(jsonData.themedata[version].app_icons.images[i].path == "/usr/palm/applications/com.palm.app.email/icon.png")
												preview["Email Icon"] = "/media/internal/.themes/" + themeDirs[dirIdx] + "/" + jsonData.themedata[version].app_icons.images[i].file;
											else if(jsonData.themedata[version].app_icons.images[i].path == "/usr/palm/applications/com.palm.app.email/1.5/icon.png")
												preview["Email Icon"] = "/media/internal/.themes/" + themeDirs[dirIdx] + "/" + jsonData.themedata[version].app_icons.images[i].file;
											else if(jsonData.themedata[version].app_icons.images[i].path == "/media/cryptofs/apps/usr/palm/applications/com.palm.app.email/icon.png")
												preview["Email Icon"] = "/media/internal/.themes/" + themeDirs[dirIdx] + "/" + jsonData.themedata[version].app_icons.images[i].file;

											else if(jsonData.themedata[version].app_icons.images[i].path == "/usr/palm/applications/com.palm.app.calendar/images/launcher/icon-1.png")
												preview["Calendar Icon"] = "/media/internal/.themes/" + themeDirs[dirIdx] + "/" + jsonData.themedata[version].app_icons.images[i].file;
											else if(jsonData.themedata[version].app_icons.images[i].path == "/usr/palm/applications/com.palm.app.calendar/images/launcher/1.5/icon-1.png")
												preview["Calendar Icon"] = "/media/internal/.themes/" + themeDirs[dirIdx] + "/" + jsonData.themedata[version].app_icons.images[i].file;
											else if(jsonData.themedata[version].app_icons.images[i].path == "/media/cryptofs/apps/usr/palm/applications/com.palm.app.calendar/images/launcher/icon-1.png")
												preview["Calendar Icon"] = "/media/internal/.themes/" + themeDirs[dirIdx] + "/" + jsonData.themedata[version].app_icons.images[i].file;

											else if(jsonData.themedata[version].app_icons.images[i].path == "/usr/palm/sysmgr/images/launcher3/launcher-icon-64.png")
												preview["Launcher Icon"] = "/media/internal/.themes/" + themeDirs[dirIdx] + "/" + jsonData.themedata[version].app_icons.images[i].file;
										}
									}
								} 

								if(jsonData.themedata[version].app_launcher)
									components.push("App Launcher");

								if(jsonData.themedata[version].applications)
									components.push("Applications");

								if(jsonData.themedata[version].boot_logo)
									components.push("Boot Logo");

								if(jsonData.themedata[version].enyo_widgets)
									components.push("Enyo Widgets");

								if(jsonData.themedata[version].exhibition)
									components.push("Exhibition");

								if(jsonData.themedata[version].just_type) {
									components.push("Just Type");

									if(jsonData.themedata[version].just_type.images) {
										for(var i = 0; i < jsonData.themedata[version].just_type.images.length; i++) {
											if(jsonData.themedata[version].just_type.images[i].path == "/usr/palm/sysmgr/images/search-pill.png")							
												preview["Just Type"] = "/media/internal/.themes/" + themeDirs[dirIdx] + "/" + jsonData.themedata[version].just_type.images[i].file;
										}							
									}
								} 

								if(jsonData.themedata[version].keyboard)
									components.push("Keyboard");

								if(jsonData.themedata[version].lock_screen)
									components.push("Lock Screen");

								if(jsonData.themedata[version].quick_launcher) {
									components.push("Quick Launcher");

									if(jsonData.themedata[version].quick_launcher.images) {
										for(var i = 0; i < jsonData.themedata[version].quick_launcher.images.length; i++) {
											if(jsonData.themedata[version].quick_launcher.images[i].path == "/usr/palm/sysmgr/images/launcher3/quicklaunch-bg.png")							
												preview["Quick Launcher"] = "/media/internal/.themes/" + themeDirs[dirIdx] + "/" + jsonData.themedata[version].quick_launcher.images[i].file;
										}							
									}
								}

								if(jsonData.themedata[version].status_bar) {
									components.push("Status Bar");

									if(jsonData.themedata[version].status_bar.images) {
										for(var i = 0; i < jsonData.themedata[version].status_bar.images.length; i++) {
											if(jsonData.themedata[version].status_bar.images[i].path == "/usr/palm/sysmgr/images/statusBar/status-bar-background.png")							
												preview["Status Bar"] = "/media/internal/.themes/" + themeDirs[dirIdx] + "/" + jsonData.themedata[version].status_bar.images[i].file;
										}							
									}
								}

								if(jsonData.themedata[version].system_menus)
									components.push("System Menus");
			
								if(jsonData.themedata[version].wallpapers) {
									components.push("Wallpapers");

									if((jsonData.themedata[version].wallpapers.images) && (jsonData.themedata[version].wallpapers.images.length > 0)) {
										preview["Wallpapers"] = "/media/internal/.themes/" + themeDirs[dirIdx] + "/" + jsonData.themedata[version].wallpapers.images[0].file;								
									}						
								}
							}

							for(var i = 0; i < themes.length; i++) {
								if(themes[i].id == themeDirs[dirIdx]) {
									themes.splice(i, 1);
									break;
								}
							}

							themes.push({
								id: themeDirs[dirIdx],
								removable: removable,
								name: jsonData.name,
								version: jsonData.version,
								versions: versions,
								devices: jsonData.devices,
								description: jsonData.description,
								creator: jsonData.creator,
								website: jsonData.website,
								donations: jsonData.donations,
								preview: preview,
								components: components,
								screenshots: screenshots
							});
						}
					}
				}
			}

			future.result = { returnValue: true, themes: themes, errors: errors };
		}.bind(this, future));
	} else {
		future.result = { returnValue: false, errorText: "No device or version given!" };	
	}
}

ControlAssistant.prototype.applyTheme = function(future, args) {
	if((args.theme) && (args.device) && (args.version)) {
		if(this.controller.service.assistant.busy == true) {
			future.result = { returnValue: false, busy: true };

			return;
		}

		this.controller.service.assistant.busy = true;

		var fs = IMPORTS.require('fs');

		var exec = IMPORTS.require('child_process').exec;

		var files = [];
		var patch = [];
		var wallpaper = "";

		for(var component in args.theme.components) {
			if((args.theme.components[component].theme != "default") &&
				(args.theme.components[component].state == true))
			{
				var themeDir = "/media/internal/.themes/" + args.theme.components[component].theme + "/";
			
				var stat = fs.statSync(themeDir);

				if((stat) && (stat.isDirectory())) {		
					var fileData = fs.readFileSync(themeDir + 'theme.json', 'utf8');

					try { var jsonData = JSON.parse(fileData); } catch(error) { var jsonData = {} }	

					if((!jsonData.devices) || (jsonData.devices.indexOf(args.device) == -1))
						continue;

					var version = args.version;

					if((jsonData.themedata) && (jsonData.themedata[version]) &&
						(jsonData.themedata[version].alias != undefined))
					{
						version = jsonData.themedata[version].alias;
					}
					
					if((jsonData.themedata == undefined) || (jsonData.themedata[version] == undefined))
						continue;

					if((jsonData.name == undefined) || (jsonData.version == undefined) || 
						(jsonData.description == undefined) || (jsonData.creator == undefined) ||
						(jsonData.website == undefined) || (jsonData.screenshots == undefined) ||
						(jsonData.name == "Default WebOS Theme") || (jsonData.name == "Custom Theme"))
					{
						continue;
					}
					
					var componentId = component.toLowerCase().replace(" ", "_");
		
					if(jsonData.themedata[version][componentId]) {
						if(jsonData.themedata[version][componentId].images) {
							for(var i = 0; i < jsonData.themedata[version][componentId].images.length; i++) {
								if((jsonData.themedata[version][componentId].images[i].path) &&
									(jsonData.themedata[version][componentId].images[i].file))
								{
									var path = jsonData.themedata[version][componentId].images[i].path;
									var file = jsonData.themedata[version][componentId].images[i].file;

									if((i == 0) && (componentId == "wallpapers"))
										wallpaper = path;

									if((path.slice(-4).toLowerCase() == ".jpg") || (path.slice(-4).toLowerCase() == ".png"))											
										files.push({sourcePath: themeDir + file, targetPath: path});
								}
							}
						}

						if(jsonData.themedata[version][componentId].sounds) {
							for(var i = 0; i < jsonData.themedata[version][componentId].sounds.length; i++) {
								if((jsonData.themedata[version][componentId].sounds[i].path) &&
									(jsonData.themedata[version][componentId].sounds[i].file))
								{
									var path = jsonData.themedata[version][componentId].sounds[i].path;
									var file = jsonData.themedata[version][componentId].sounds[i].file;
					
									if((path.slice(-4).toLowerCase() == ".mp3") || (path.slice(-4).toLowerCase() == ".wav"))
										files.push({sourcePath: themeDir + file, targetPath: path});
								}
							}
						}
				
						if(jsonData.themedata[version][componentId].patches) {
							for(var i = 0; i < jsonData.themedata[version][componentId].patches.length; i++) {
								if((jsonData.themedata[version][componentId].patches[i].path) &&
									(jsonData.themedata[version][componentId].patches[i].file))
								{
									var path = jsonData.themedata[version][componentId].patches[i].path;
									var file = jsonData.themedata[version][componentId].patches[i].file;

									if((path.slice(-4).toLowerCase() == ".css") || (path.slice(-5).toLowerCase() == ".json") || 
										(path.slice(-11).toLowerCase() == "/index.html"))
									{
										patch.push({sourcePath: themeDir + file, targetPath: path});
									}
								}
							}
						}
					}
				}
			}
		}

		var fd = fs.openSync("/media/internal/.themes/.org.webosinternals.thememanager-theme/theme.cfg", "w", 0644);
		
		for(var i = 0; i < files.length; i++) {
			var line = "files " + files[i].sourcePath + " " + files[i].targetPath + "\n";
		
			fs.writeSync(fd, line, null, null);
		}

		for(var i = 0; i < patch.length; i++) {
			var line = "patch " + patch[i].sourcePath + " " + patch[i].targetPath + "\n";
		
			fs.writeSync(fd, line, null, null);
		}
		
		fs.closeSync(fd);

		var cmd = "sh /media/cryptofs/apps/usr/palm/services/org.webosinternals.thememanager.srv/sh-scripts/update";

		exec(cmd, function(future, wallpaper, error, stdout, stderr) {
			this.controller.service.assistant.busy = false;

			if(error !== null) {
				console.error("DEBUG - Update exception: " + JSON.stringify(error));

				console.error("DEBUG - Update output: " + stdout);

				error.errorCode = error.code;
				
				future.exception = error;
			} else {
				future.result = { returnValue: true, wallpaper: wallpaper, stdout: stdout };
			}
		}.bind(this, future, wallpaper));
	} else {
		future.result = { returnValue: false, errorText: "No theme, device or version given!" };
	}
}

ControlAssistant.prototype.removeTheme = function(future, args) {
	if(args.dir) {
		var exec = IMPORTS.require('child_process').exec;

		var cmd = "sh /media/cryptofs/apps/usr/palm/services/org.webosinternals.thememanager.srv/sh-scripts/remove";

		exec(cmd + " " + args.dir, function(future, error, stdout, stderr) {
			if(error !== null) {
				console.error("DEBUG - Remove exception: " + JSON.stringify(error));
				
				error.errorCode = error.code;
				
				future.exception = error;
			} else {
				future.result = { returnValue: true, stdout: stdout };
			}
		}.bind(this, future));
	} else {
		future.result = { returnValue: false, errorText: "No directory given!" };
	}
}

ControlAssistant.prototype.installThemes = function(future, args) {
	if(args.files) {
		var exec = IMPORTS.require('child_process').exec;

		var cmd = "sh /media/cryptofs/apps/usr/palm/services/org.webosinternals.thememanager.srv/sh-scripts/install";

		var files = args.files.toString().replace(/,/g, " ");

		exec(cmd + " " + files, function(future, error, stdout, stderr) {
			if(error !== null) {
				console.error("DEBUG - Install exception: " + JSON.stringify(error));
				
				error.errorCode = error.code;
				
				future.exception = error;
			} else {
				future.result = { returnValue: true, stdout: stdout };
			}
		}.bind(this, future));
	} else {
		future.result = { returnValue: false, errorText: "No files given!" };
	}
}

