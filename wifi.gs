// Automatically cracks and connects to
// wireless network with highest strength

crypto = include_lib("/lib/crypto.so")
if not crypto then crypto = include_lib(current_path + "/crypto.so".trim)
pc = get_shell.host_computer
interface = pc.network_devices.split(" ")[0]
max_percentage = 0
max = ""
for network in pc.wifi_networks(interface)
	// Network: bssid, strength, essid
	split_network = network.split(" ")
	list_network = [split_network[0], split_network[1].remove("%").to_int, split_network[2]]
	if(list_network[1] > max_percentage) then
		max_percentage = list_network[1]
		max = list_network
	end if
end for
bssid = max[0]
essid = max[2]
acks = 300000 / max_percentage
crypto.airmon("start", interface)
crypto.aireplay(bssid, essid, acks)
crypto.airmon("stop", interface)
password = crypto.aircrack(current_path + "/file.cap")
print("Password: " + password)
pc.connect_wifi(interface, bssid, essid, password)
pc.File("file.cap").delete
