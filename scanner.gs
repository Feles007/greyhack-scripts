// Scans libraries for exploits
// Syntax:
// scanner n 127.0.0.1 80
// scanner p /path/to/lib

metaxploit = include_lib("/lib/metaxploit.so")
if params[0] == "n" then
	net_session = metaxploit.net_use(params[1], params[2].to_int)
	metalib = net_session.dump_lib
else if params[0] == "p" then
	metalib = metaxploit.load(params[1])
end if
print("")
print("Name: " + metalib.lib_name)
print("Version: " + metalib.version)
addresses = metaxploit.scan(metalib)
for address in addresses
	print("----------------------------------------")
	print("Address: " + address)
	print()
	print(metaxploit.scan_address(metalib, address))
end for