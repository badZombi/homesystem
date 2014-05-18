/**
 * Created by DreTaX on 2014.04.18.. V1.9.3
 * 
 */

function On_Command(Player, cmd, args) {
	switch(cmd) {
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
					}
					else {
						if (calc < 0 || isNaN(calc)) {
							time = Data.AddTableValue("home_cooldown", Player.SteamID, System.Environment.TickCount);
							Player.Message("Your time went negative! Try again!");
							return;
						}
					}
					if (calc >= cooldown) {
						var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
						var params = new ParamsList();
						params.Add(Player.SteamID);
						params.Add(check[0]);
						params.Add(check[1]);
						params.Add(check[2]);
						if (tpdelay == 0) {
							Player.TeleportTo(check[0], check[1], check[2]);
							Data.AddTableValue("home_cooldown", Player.SteamID, System.Environment.TickCount);
							Player.Message("---HomeSystem---");
							Player.Message("Teleported to home!");
							Plugin.CreateTimer("mytestt", 1000 * checkn, params).Start();
						}
						else {
							Data.AddTableValue("home_cooldown", Player.SteamID, System.Environment.TickCount);
							Plugin.CreateTimer("delay", 1000 * tpdelay, params).Start();
							Player.Message("Teleporting you to home in: " + tpdelay + " seconds");
						}
					}
					else
					{
						Player.Notice("You have to wait before teleporting again!");
						var next = calc / 1000;
						var next2 = next / 60;
						var def = cooldown / 1000;
						var def2 = def / 60;
						var done = Number(next2).toFixed(2); 
						var done2 = Number(def2).toFixed(2); 
						Player.Message("Time: " + done + "/" + done2);
					}
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

function mytesttCallback(params) {
	var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
	var _fromPlayer = FindPlayer(params.Get(0));
	if (_fromPlayer != null) {
		_fromPlayer.TeleportTo(params.Get(1), params.Get(2), params.Get(3));
		_fromPlayer.Message("You have been teleported here again for safety reasons in: " + checkn + " secs");
	}
	Plugin.KillTimer("mytestt");
}

function jointpCallback(params) {
	var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
	var joinplayer = FindPlayer(params.Get(0));
	if (joinplayer != null) {
		joinplayer.TeleportTo(params.Get(1), params.Get(2), params.Get(3));
		joinplayer.Message("You have been teleported here again for safety reasons in: " + checkn + " secs");
	}
	Plugin.KillTimer("jointp");
}

function randomtpCallback(params) {
	var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
	var rplayer = FindPlayer(params.Get(0));
	if (rplayer != null) {
		rplayer.TeleportTo(params.Get(1), params.Get(2), params.Get(3));
		rplayer.Message("You have been teleported here again for safety reasons in: " + checkn + " secs");
	}
	Plugin.KillTimer("randomtp");
}

function delayCallback(params) {
	var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
	var _fromPlayer = FindPlayer(params.Get(0));
	if (_fromPlayer != null) {
		_fromPlayer.TeleportTo(params.Get(1), params.Get(2), params.Get(3));
		Plugin.CreateTimer("mytestt", 1000 * checkn, params).Start();
	}
	Plugin.KillTimer("delay");
}

function jointpdelayCallback(params) {
	var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
	var joinplayer = FindPlayer(params.Get(0));
	if (joinplayer != null) {
		joinplayer.TeleportTo(params.Get(1), params.Get(2), params.Get(3));
		Plugin.CreateTimer("jointp", 1000 * checkn, params).Start();
	}
	Plugin.KillTimer("jointpdelay");
}

function randomtpdelayCallback(params) {
	var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
	var rplayer = FindPlayer(params.Get(0));
	if (rplayer != null) {
		rplayer.TeleportTo(params.Get(1), params.Get(2), params.Get(3));
		rplayer.Message("---HomeSystem---");
		rplayer.Message("You have been teleported to a random location!");
		rplayer.Message("Type /setdefaulthome HOMENAME");
		rplayer.Message("To spawn at your home!");
		Plugin.CreateTimer("randomtp", 1000 * checkn, params).Start();
	}
	Plugin.KillTimer("randomtpdelay");
}

function spawndelayCallback(params) {
	var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
	var spawntpplayer = FindPlayer(params.Get(0));
	if (spawntpplayer != null) {
		spawntpplayer.TeleportTo(params.Get(1), params.Get(2), params.Get(3));
		spawntpplayer.Message("You have been teleported here again for safety reasons in: " + checkn + " secs");
	}
	Plugin.KillTimer("spawndelay");
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
				var params = new ParamsList();
				params.Add(Player.SteamID);
				params.Add(home[0]);
				params.Add(home[1]);
				params.Add(home[2]);
				Player.TeleportTo(home[0], home[1], home[2]);
				Player.Message("Spawned at home!");
				Plugin.CreateTimer("spawndelay", 1000 * checkn, params).Start();
			}
		}
	}
}

function On_PlayerConnected(Player) {
	var params = new ParamsList();
	params.Add(Player.SteamID);
	Plugin.CreateTimer("ByPassRoof", 3400, params).Start();
}

function ByPassRoofCallback(params) {
	var antiroof = Data.GetConfigValue("HomeSystem", "Settings", "antiroofdizzy");
	var joinp = FindPlayer(params.Get(0));
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
			Plugin.KillTimer("ByPassRoof");
		}
		if (System.Environment.TickCount > time + cooldown * 1000 || time == null) {
			var randomloc = Data.GetConfigValue("HomeSystem", "Settings", "randomlocnumber");
			Data.AddTableValue("home_joincooldown", joinp.SteamID, null);
			var random = Math.floor((Math.random() * randomloc) + 1);
			var ini = Homes();
			var getdfhome = ini.GetSetting("DefaultHome", params.Get(0));
			var checkn = Data.GetConfigValue("HomeSystem", "Settings", "safetpcheck");
			var tpdelay = Data.GetConfigValue("HomeSystem", "Settings", "jointpdelay");
			var params2 = new ParamsList();
			if (getdfhome != null) {
				var home = HomeOf(joinp, getdfhome);
				params2.Add(joinp.SteamID);
				params2.Add(home[0]);
				params2.Add(home[1]);
				params2.Add(home[2]);
				Plugin.CreateTimer("jointpdelay", 1000 * tpdelay, params2).Start();
			}
			else {
				var ini2 = DefaultLoc();
				var loc = ini2.GetSetting("DefaultLoc", random);
				var c = loc.replace("(", "");
				c = c.replace(")", "");
				var tp = c.split(",");
				params2.Add(joinp.SteamID);
				params2.Add(tp[0]);
				params2.Add(tp[1]);
				params2.Add(tp[2]);
				Plugin.CreateTimer("randomtpdelay", 1000 * tpdelay, params2).Start();
			}
		}
	}
	Plugin.KillTimer("ByPassRoof");
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