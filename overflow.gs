// Overflows remote library
// Tailor this to your specific exploit
// Syntax:
// overflow 127.0.0.1 80 0xFFFFFFF the_value
// overflow 127.0.0.1 80 0xFFFFFFF the_value extra

metaxploit = include_lib("/lib/metaxploit.so")
if not metaxploit then metaxploit = include_lib("metaxploit.so")
net_session = metaxploit.net_use(params[0], params[1].to_int)
metalib = net_session.dump_lib
if params.len == 4 then
	result = metalib.overflow(params[2], params[3])
else if params.len == 5 then
	result = metalib.overflow(params[2], params[3], params[4])
end if
print("Type: " + typeof(result))
