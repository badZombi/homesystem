/**
 *		Homejobs plugin addon written and integrated by BadZombi for HomeSystem V1.9.3 (DreTaX) 
 *  	-- 
 */
var HomeSystem = {
	name: 		'HomeSystem',
	author: 	'DreTaX',
	version: 	'2.0.0',
};
var BZHJ = {
	name: 		'Home Jobs',
	author: 	'BadZombi',
	version: 	'0.1.0',
	DStable: 	'BZjobs',
	addJob: function(callback, xtime, params){
		//Server.Broadcast('AddJobs called');
		//Server.Broadcast(params);
		var jobData = {};
			jobData.callback = String(callback);
			jobData.params = String(params);
		//Server.Broadcast(iJSON.stringify(jobData));
		//Server.Broadcast('xtime: '+xtime);
		var epoch = Plugin.GetTimestamp();
		//Server.Broadcast('epoch: '+epoch);
		var exectime = parseInt(epoch) + parseInt(xtime);
		//Server.Broadcast('exectime: '+exectime);
		DataStore.Add(this.DStable, exectime, iJSON.stringify(jobData));
		//Server.Broadcast('mark 2');
		this.startTimer();
	},
	killJob: function(job){
		Datastore.Remove(this.DStable, job);
	},
	startTimer: function(){
		//Server.Broadcast('mark 3');
		try{
			
			var gfjfhg = Data.GetConfigValue("HomeSystem", "Settings", "run_timer") * 1000;
			//Server.Broadcast("timer: "+gfjfhg);
			if(!Plugin.GetTimer("JobTimer")){
				Plugin.CreateTimer("JobTimer", gfjfhg).Start();
			}
		} catch(err){
			//Server.Broadcast(err.message);
		}
	},
	stopTimer: function(P) {
		Plugin.KillTimer("JobTimer");
	},
	clearTimers: function(P){
		P.MessageFrom('meh', "Erasing all example timers.");
		Datastore.Flush(this.DStable);
	}
}

function On_PluginInit() { 
	Util.ConsoleLog(BZHJ.name + " v" + BZHJ.version + " loaded.", true);
	Util.ConsoleLog(HomeSystem.name + " v" + HomeSystem.version + " loaded.", true);
}

function JobTimerCallback(){
	//Server.Broadcast('JTC');
	var epoch = Plugin.GetTimestamp();
	if(Datastore.Count(BZHJ.DStable) >= 1){
		var pending = Datastore.Keys(BZHJ.DStable);
		for (var p in pending){
			//Server.Broadcast("checking "+p+" : " + epoch);
			
			if(epoch >= parseInt(p)){
				//Server.Broadcast("executing "+p);
				// execute job
				var jobData = Datastore.Get(BZHJ.DStable, p);
					//Server.Broadcast("jobData: "+jobData);
				var jobxData = iJSON.parse(jobData);
					//Server.Broadcast("params: "+jobData.params);
				var params = iJSON.parse(jobxData.params);
				switch(jobxData.callback){
					case "jointpdelay":
						var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
						var joinplayer = FindPlayer(params[0]);
						if (joinplayer != null) {
							joinplayer.TeleportTo(params[1], params[2], params[3]);
							BZHJ.addJob( 'jointp', checkn, jobData.params );
						}
					break;

					case "jointp":
						var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
						var joinplayer = FindPlayer(params[0]);
						if (joinplayer != null) {
							joinplayer.TeleportTo(params[1], params[2], params[3]);
							joinplayer.Message("You have been teleported here again for safety reasons in: " + checkn + " secs");
						}
					break;

					case "mytestt":
						var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
						var _fromPlayer = FindPlayer(params[0]);
						if (_fromPlayer != null) {
							_fromPlayer.TeleportTo(params[1], params[2], params[3]);
							_fromPlayer.Message("You have been teleported here again for safety reasons in: " + checkn + " secs");
						}
					break;

					case "randomtp":
						var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
						var rplayer = FindPlayer(params[0]);
						if (rplayer != null) {
							rplayer.TeleportTo(params[1], params[2], params[3]);
							rplayer.Message("You have been teleported here again for safety reasons in: " + checkn + " secs");
						}
					break;

					case "delay":
						//Server.Broadcast("hit");
						var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
						var _fromPlayer = FindPlayer(params[0]);
						if (_fromPlayer != null) {
							_fromPlayer.TeleportTo(params[1], params[2], params[3]);
							//BZHJ.addJob( 'mytestt', checkn, jobData.params );
						}
					break;

					case "randomtpdelay":
						var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
						var rplayer = FindPlayer(params[0]);
						if (rplayer != null) {
							rplayer.TeleportTo(params[1], params[2], params[3]);
							rplayer.Message("---HomeSystem---");
							rplayer.Message("You have been teleported to a random location!");
							rplayer.Message("Type /setdefaulthome HOMENAME");
							rplayer.Message("To spawn at your home!");
							BZHJ.addJob( 'randomtp', checkn, jobData.params );
						}
					break;

					case "spawndelay":
						var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
						var spawntpplayer = FindPlayer(params[0]);
						if (spawntpplayer != null) {
							spawntpplayer.TeleportTo(params[1], params[2], params[3]);
							spawntpplayer.Message("You have been teleported here again for safety reasons in: " + checkn + " secs");
						}
					break;

					case "ByPassRoof":
						var antiroof = Data.GetConfigValue("HomeSystem", "Settings", "antiroofdizzy");
						var joinp = FindPlayer(params[0]);
						if (antiroof == 1 && joinp != null) {
							var cooldown = Data.GetConfigValue("HomeSystem", "Settings", "rejoincd");
							var time = Data.GetTableValue("home_joincooldown", joinp.SteamID);
							var calc = System.Environment.TickCount - time;
							if (time == undefined || time == null) {
								if (calc < 0 || isNaN(calc)) {
									time = Data.AddTableValue("home_cooldown", Player.SteamID, System.Environment.TickCount);
								}
							}
							else {
								if (calc < 0 || isNaN(calc)) {
									time = Data.AddTableValue("home_cooldown", Player.SteamID, System.Environment.TickCount);
								}
							}
							if (System.Environment.TickCount <= time + cooldown * 1000){
								var calc2 = cooldown * 1000;
								var calc3 = (calc2 - calc) / 1000;
								var done = Number(calc3).toFixed(2);
								joinp.Message("There is a " + cooldown + " cooldown at join. You can't join till: " + done + " more seconds.");
								joinp.Disconnect();
								// I THINK this will work. removing the current job rather than killing the timer.
								// Plugin.KillTimer("ByPassRoof");
								BZHJ.killJob(x);
							}
							if (System.Environment.TickCount > time + cooldown * 1000 || time == null) {
								var randomloc = Data.GetConfigValue("HomeSystem", "Settings", "randomlocnumber");
								Data.AddTableValue("home_joincooldown", joinp.SteamID, null);
								var random = Math.floor((Math.random() * randomloc) + 1);
								var ini = Homes();
								var getdfhome = ini.GetSetting("DefaultHome", params[0]);
								var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
								var tpdelay = Data.GetConfigValue("HomeSystem", "Settings", "jointpdelay");
								
								if (getdfhome != null) {
									var home = HomeOf(joinp, getdfhome);
									// first test of jobs:
									var jobParams = [];
										jobParams.push(String(joinp.SteamID));
										jobParams.push(String(home[0]));
										jobParams.push(String(home[1]));
										jobParams.push(String(home[2]));
									
									BZHJ.addJob( 'jointpdelay', tpdelay, iJSON.stringify(jobParams) );
								}
								else {
									var ini2 = DefaultLoc();
									var loc = ini2.GetSetting("DefaultLoc", random);
									var c = loc.replace("(", "");
									c = c.replace(")", "");
									var tp = c.split(",");
									
									var jobParams = [];
										jobParams.push(String(joinp.SteamID));
										jobParams.push(String(tp[0]));
										jobParams.push(String(tp[1]));
										jobParams.push(String(tp[2]));

									BZHJ.addJob( 'randomtpdelay', tpdelay, iJSON.stringify(jobParams) );
								}
							}
						}
					break;

				}
				
				Datastore.Remove(BZHJ.DStable, p)
			} else {
				//Server.Broadcast('not yet...');
			}
				
		}

	} else {
		BZHJ.stopTimer();
	}

}

/**
 * Created by DreTaX on 2014.04.18.. V2.0.1
 * 
 */

function On_Command(Player, cmd, args) {
	switch(cmd) {
		case "cleartimers":
			BZHJ.clearTimers(Player);
		break;
		case "home":
			if (args.Length == 0) {
				Player.Message("---HomeSystem---");
				Player.Message("/home name - Teleport to Home");
				Player.Message("/sethome name - Save Home");
				Player.Message("/delhome name - Delete Home");
				Player.Message("/setdefaulthome name - Default Spawn Point");
				Player.Message("/homes - List Homes");
				Player.Message("/addfriendh name - Adds Player To Distance Whitelist");
				Player.Message("/delfriendh name - Removes Player From Distance Whitelist");
				Player.Message("/listwlh - List Players On Distance Whitelist");
			}
			else if (args.Length > 0) {
				var home = args[0];
				var check = HomeOf(Player, home);
				var id = Player.SteamID;
				if (check == null) {
					Player.Message("You don't have a home called: " + home);	
				}
				else {
					//try{
						var cooldown = Data.GetConfigValue("HomeSystem", "Settings", "Cooldown");
						var time = Data.GetTableValue("home_cooldown", Player.SteamID);
						var tpdelay = Data.GetConfigValue("HomeSystem", "Settings", "tpdelay");
						var calc = System.Environment.TickCount - time;
						if (time == undefined || time == null) {
							if (calc < 0 || isNaN(calc)) {
								time = Data.AddTableValue("home_cooldown", Player.SteamID, System.Environment.TickCount);
								Player.Message("Your time went negative! Try again!");
								return;
							}
						} else {
							if (calc < 0 || isNaN(calc)) {
								time = Data.AddTableValue("home_cooldown", Player.SteamID, System.Environment.TickCount);
								Player.Message("Your time went negative! Try again!");
								return;
							}
						}

						if (calc >= cooldown) {
							//Player.Message("c0: "+check[0]);
							var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
							//Player.Message("c: "+checkn);
							var jobParams = [];
								jobParams.push(String(Player.SteamID));
								jobParams.push(String(check[0]));
								jobParams.push(String(check[1]));
								jobParams.push(String(check[2]));
								
							if (tpdelay == 0) {
								Player.TeleportTo(check[0], check[1], check[2]);
								Data.AddTableValue("home_cooldown", Player.SteamID, System.Environment.TickCount);
								Player.Message("---HomeSystem---");
								Player.Message("Teleported to home!");
								//BZHJ.addJob( 'mytestt', checkn, iJSON.stringify(jobParams) );
							}
							else {
								//Player.Message(3);
								Data.AddTableValue("home_cooldown", Player.SteamID, System.Environment.TickCount);
								BZHJ.addJob( 'delay', tpdelay, iJSON.stringify(jobParams) );

								Player.Message("Teleporting you to home in: " + tpdelay + " seconds");
							}
						} else {
							Player.Notice("You have to wait before teleporting again!");
							var next = calc / 1000;
							var next2 = next / 60;
							var def = cooldown / 1000;
							var def2 = def / 60;
							var done = Number(next2).toFixed(2); 
							var done2 = Number(def2).toFixed(2); 
							Player.Message("Time: " + done + "/" + done2);
						}
					//} catch(err){
					//	Player.Message(err.message+" : "+err.description);
					//}
				}
			}
		break;
		case "sethome":
			if (args.Length > 0){
				var home = args[0];
				var ini = Homes();
				var id = Player.SteamID;
				var homel = ini.EnumSection(id);
				var maxh = Data.GetConfigValue("HomeSystem", "Settings", "Maxhomes");
				var checkforit = Data.GetConfigValue("HomeSystem", "Settings", "DistanceCheck");
				var count = homel.Length;
				var parsed = parseInt(count); 
				var parsedd = parseInt(maxh); 
				var checkwall = Data.GetConfigValue("HomeSystem", "Settings", "CheckCloseWall");
				if (parsed >= parsedd) {
					Player.Message("You reached the max home limit. (" + maxh + ")");
					return;
				}
				else {
					if (checkforit == 1) {
						var checkdist = ini.EnumSection("HomeNames");
						var counted = checkdist.Length;
						var i = 0;
						var maxdist = Data.GetConfigValue("HomeSystem", "Settings", "Distance");
						maxdist = parseInt(maxdist); 
						if (checkwall == 1) {
							for (var entity in World.Entities) {
								if (entity.Name == "MetalWall" || entity.Name == "WoodWall") {
									var loc = Util.CreateVector(entity.X, entity.Y, entity.Z);
									var distance = Util.GetVectorsDistance(loc, Player.Location);
									if (distance <= 1.50) {
										Player.Message("---HomeSystem---");
										Player.Message("You can't set home near walls!");
										return;
									}
								}
							}
						}
						for (var idof in checkdist) {
							i++; 
							var homes = ini.GetSetting("HomeNames", idof);
							if (homes != null) {
								homes = homes.replace(",", "");
								var check = HomeOfID(idof, homes);
								var vector = Util.CreateVector(check[0], check[1], check[2]);
								var dist = Util.GetVectorsDistance(vector, Player.Location);
								if (dist <= maxdist && !FriendOf(idof, id)) {
									Player.Message("There is a home within: " + maxdist + "m!");
									return;
								}
								if (i == counted) {
									var homes = ini.GetSetting("HomeNames", id, home);
									var n = homes + "" + home + ",";
									ini.AddSetting(id, home, Player.Location.toString());
									ini.AddSetting("HomeNames", id, n.replace("undefined", ""));
									ini.Save();
									Player.Message("---HomeSystem---");
									Player.Message("Home Saved");
								}
							}
						}
					}
					else {
						if (checkwall == 1) {
							for (var entity in World.Entities) {
								if (entity.Name == "MetalWall" || entity.Name == "WoodWall") {
									var loc = Util.CreateVector(entity.X, entity.Y, entity.Z);
									var distance = Util.GetVectorsDistance(loc, Player.Location);
									if (distance <= 1.50) {
										Player.Message("---HomeSystem---");
										Player.Message("You can't set home near walls!");
										return;
									}
								}
							}
						}
						var homes = ini.GetSetting("HomeNames", id, home);
						var n = homes + "" + home + ",";
						ini.AddSetting(id, home, Player.Location.toString());
						ini.AddSetting("HomeNames", id, n.replace("undefined", ""));
						ini.Save();
						Player.Message("---HomeSystem---");
						Player.Message("Home Saved");
					}
				}
			}
			else {
				Player.Message("---HomeSystem---");
				Player.Message("Usage: /sethome name");
			}
		break;
		case "setdefaulthome":
			if (args.Length > 0){
				var home = args[0];
				var check = HomeOf(Player, home);
				var id = Player.SteamID;
				if (check == null) {
					Player.Message("---HomeSystem---");
					Player.Message("You don't have a home called: " + home);	
					return;
				}
				var ini = Homes();
				ini.AddSetting("DefaultHome", id, home);
				ini.Save();
				Player.Message("---HomeSystem---");
				Player.Message("Default Home Set!");
			}
			else {
				Player.Message("---HomeSystem---");
				Player.Message("Usage: /setdefaulthome name");
			}
		break;
		case "delhome":
			if (args.Length > 0){
				var home = args[0];
				var ini = Homes();
				var id = Player.SteamID;
				var check = ini.GetSetting(id, home);
				var ifdfhome = ini.GetSetting("DefaultHome", id, home);
				if (check != null) {
					if (ifdfhome != null) {
						ini.DeleteSetting("DefaultHome", id);
					}
					var homes = ini.GetSetting("HomeNames", id);
					ini.DeleteSetting(Player.SteamID, home);
					ini.DeleteSetting("HomeNames", id, homes.replace(home+",", ""));
					ini.Save();
					Player.Message("Home: " + home + " Deleted");
				}
				else {
					Player.Message("Home: " + home + " doesn't exists!");
				}
			}else{
				Player.Message("Usage: /delhome name");
			}
		break;
		case "homes":
			var ini = Homes();
			var id = Player.SteamID;
			if(ini.GetSetting("HomeNames", id) != null) {
				var homes = ini.GetSetting("HomeNames", id).split(',');
				for(var h in homes) {
					Player.Message("Homes: " + homes[h]);
				}
			}
			else{
				Player.Message("You don't have homes!");
			}
		break;	
		case "deletebeds":
			var antihack = Data.GetConfigValue("HomeSystem", "Settings", "Antihack");
			if (Player.Admin && antihack == "1") {
				for (var x in World.Entities) {
					if (x.Name == "SleepingBagA" || x.Name == "SingleBed") {	
						x.Destroy();
						Player.Message("Deleted one");
					}
				}
			}
		break;
		case "addfriendh":
			if (args.Length == 0) {
				Player.Message("---HomeSystem---");
				Player.Message("Usage: /addfriendh playername");
				return;
			}
			else if (args.Length > 0) {
				var playertor = GetPlayer(args[0]);
				if (playertor != null && playertor != Player) {
					var ini = Wl();
					var id = Player.SteamID;
					ini.AddSetting(id, playertor.SteamID, playertor.Name);
					ini.Save();
					Player.Message("---HomeSystem---");
					Player.Message("Player Whitelisted");
				}
				else {
					Player.Message("---HomeSystem---");
					Player.Message("Player doesn't exist, or you tried to add yourself!");
				}
			}
		break;
		case "delfriendh":
			if (args.Length == 0) {
				Player.Message("---HomeSystem---");
				Player.Message("Usage: /delfriendh playername");
				return;
			}
			else if (args.Length > 0) {
				var name = args[0];
				var ini = Wl();
				var id = Player.SteamID;
				var players = ini.EnumSection(id);
				var i = 0;
				var counted = players.Length;
				name = Data.ToLower(name);
				for (var playerid in players) {
					i++;
					var nameof = ini.GetSetting(id, playerid);
					var lowered = Data.ToLower(nameof);
					if (lowered == name) {
						ini.DeleteSetting(id, playerid);
						ini.Save();
						Player.Message("---HomeSystem---");
						Player.Message("Player Removed from Whitelist");
						return;
					}
					if (i == counted) {
						Player.Message("---HomeSystem---");
						Player.Message("Player doesn't exist!");
						return;
					}
				}
			}
		break;
		case "listwlh":
			var ini = Wl();
			var id = Player.SteamID;
			var players = ini.EnumSection(id);
			for (var playerid in players) {
				var nameof = ini.GetSetting(id, playerid);
				Player.Message("Whitelisted: " + nameof);
			}
		break;
	}
}

function Homes(){
	if(!Plugin.IniExists("Homes")) {
		var homes = Plugin.CreateIni("Homes");
		homes.Save();
	}
	return Plugin.GetIni("Homes");
}

function FriendOf(id, selfid){
	var ini = Wl();
	var check = ini.GetSetting(id, selfid);
	if (check != null) {
		return true;
	}
	return false;
}

function Wl(){
	if(!Plugin.IniExists("WhiteListedPlayers")) {
		var homes = Plugin.CreateIni("WhiteListedPlayers");
		homes.Save();
	}
	return Plugin.GetIni("WhiteListedPlayers");
}

function DefaultLoc(){
	if(!Plugin.IniExists("DefaultLoc")) {
		var loc = Plugin.CreateIni("DefaultLoc");
		loc.Save();
	}
	return Plugin.GetIni("DefaultLoc");
}

function HomeOf(Player, Home){
	var ini = Homes();
	var check = ini.GetSetting(Player.SteamID, Home);
	if (check != null){
		var c = check.replace("(", "");
		c = c.replace(")", "");
		return c.split(",");
	}
	return null;
}

function HomeOfID(id, Home){
	var ini = Homes();
	var check = ini.GetSetting(id, Home);
	if (check != null){
		var c = check.replace("(", "");
		c = c.replace(")", "");
		return c.split(",");
	}
	return null;
}

function FindPlayer(id) {
	var player = Magma.Player.FindBySteamID(id);
	if (player != null) {
		return player;
	}
	return null;
}

function GetPlayer(name){
	name = Data.ToLower(name);
	for(pl in Server.Players){
		if(Data.ToLower(pl.Name) == name){
			return pl;
		}
	}
	return null;
}

function On_EntityDeployed(Player, Entity) {
	var antihack = Data.GetConfigValue("HomeSystem", "Settings", "Antihack");
	if (antihack == "1") {
		if (Entity.Name == "SleepingBagA") {
			Player.Message("---HomeSystem---");
			Player.Message("Sleeping bags are banned from this server!");
			Player.Message("Use /home");
			Player.Message("We disabled Beds, so players can't hack in your house!");
			Entity.Destroy();
		}
		if (Entity.Name == "SingleBed") {
			Player.Message("---HomeSystem---");
			Player.Message("Beds are banned from this server!");
			Player.Message("Use /home");
			Player.Message("We disabled Beds, so players can't hack in your house!");
			Entity.Destroy();
		}
	}
}

function On_PlayerSpawned(Player, SpawnEvent) {
	var camp = SpawnEvent.CampUsed;
	var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
	if (camp) {
		var cooldown = Data.GetConfigValue("HomeSystem", "Settings", "Cooldown");
		var time = Data.GetTableValue("home_cooldown", Player.SteamID);
		var calc = System.Environment.TickCount - time;
		if (time == undefined || time == null) {
			if (calc < 0 || isNaN(calc)) {
				time = Data.AddTableValue("home_cooldown", Player.SteamID, System.Environment.TickCount);
			}
		}
		else {
			if (calc < 0 || isNaN(calc)) {
				time = Data.AddTableValue("home_cooldown", Player.SteamID, System.Environment.TickCount);
			}
		}
		if (calc >= cooldown) {
			var ini = Homes();
			var check = ini.GetSetting("DefaultHome", Player.SteamID);
			if (check != null) {
				Data.AddTableValue("home_cooldown", Player.SteamID, System.Environment.TickCount);
				var home = HomeOf(Player, check);

				var jobParams = [];
					jobParams.push(String(Player.SteamID));
					jobParams.push(String(home[0]));
					jobParams.push(String(home[1]));
					jobParams.push(String(home[2]));

				Player.TeleportTo(home[0], home[1], home[2]);
				Player.Message("Spawned at home!");
				BZHJ.addJob( 'spawndelay', checkn, iJSON.stringify(jobParams) );
			}
		}
	}
}

function On_PlayerConnected(Player) {
	var jobParams = [];
		jobParams.push(String(Player.SteamID));
	// Had to set this to 4 since my setup doesnt work with mseconds but rather seconds from epoch
	BZHJ.addJob( 'ByPassRoof', 4, iJSON.stringify(jobParams) );
}

function On_PlayerDisconnected(Player) {
	var antiroof = Data.GetConfigValue("HomeSystem", "Settings", "antiroofdizzy");
	if (antiroof == 1) {
		if (!Player.Admin) {
			var cooldown = Data.GetConfigValue("HomeSystem", "Settings", "rejoincd");
			var time = Data.GetTableValue("home_joincooldown", Player.SteamID);
			if (time == null) {
				Data.AddTableValue('home_joincooldown', Player.SteamID, System.Environment.TickCount);
			}
		}
	}
}

// In Rust We Trust JSON serializer adapted (by mikec) from json2.js 2014-02-04 Public Domain.
// Most recent version from https://github.com/douglascrockford/JSON-js/blob/master/json2.js
var iJSON = {};
(function () {
	'use strict';
	function f(n) {
		return n < 10 ? '0' + n : n;
	}
	var cx,	escapable, gap, indent,	meta, rep;
	function quote(string) {
		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
			var c = meta[a];
			return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' : '"' + string + '"';
	}
	function str(key, holder) {
		var i, k, v, length, mind = gap, partial, value = holder[key];
		if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
			value = value.toJSON(key);
		}
		switch (typeof value) {
		case 'string':
			return quote(value);
		case 'number':
			return isFinite(value) ? String(value) : 'null';
		case 'boolean':
		case 'null':
			return String(value);
		case 'object':
			if (!value) { return 'null'; }
			gap += indent;
			partial = [];
			if (Object.prototype.toString.apply(value) === '[object Array]') {
				length = value.length;
				for (i = 0; i < length; i += 1) {
					partial[i] = str(i, value) || 'null';
				}
				v = partial.length === 0 ? '[]' : gap ? '[ ' + gap + partial.join(', ' + gap) + ' ' + mind + ']' : '[' + partial.join(',') + ']';
				// v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
				gap = mind;
				return v;
			}
			for (k in value) {
				if (Object.prototype.hasOwnProperty.call(value, k)) {
					v = str(k, value);
					if (v) { partial.push(quote(k) + (gap ? ': ' : ':') + v); }
				}
			}
			v = partial.length === 0 ? '{}' : gap ? '{ ' + gap + partial.join(', ' + gap) + ' ' + mind + '}' : '{' + partial.join(',') + '}';
			// v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
			gap = mind;
			return v;
		}
	}	
	if (typeof iJSON.stringify !== 'function') {
		escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
		meta = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\' };
		iJSON.stringify = function (value) { gap = ''; indent = ''; return str('', {'': value}); };
	}
	if (typeof iJSON.parse !== 'function') {
		cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
		iJSON.parse = function (text, reviver) {
			var j;
			function walk(holder, key) {
				var k, v, value = holder[key];
				if (value && typeof value === 'object') {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v;
							} else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}
			text = String(text);
			cx.lastIndex = 0;
			if (cx.test(text)) {
				text = text.replace(cx, function (a) {
					return '\\u' +
						('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});
			}
			if (/^[\],:{}\s]*$/
					.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
						.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
						.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
				j = eval('(' + text + ')');
				return typeof reviver === 'function'
					? walk({'': j}, '')
					: j;
			}
			throw new SyntaxError('JSON.parse');
		};
	}
}());	