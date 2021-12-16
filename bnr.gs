usage = function()
	exit("Usage:\n-b (disables running)\n-r <root password>\n-u <username> <password>\n-i <source file>\n-o <output folder>\n-n <custom name>\n-p <run params>\nDefault name: xyz.src -> xyz\nCustom name works by renaming,\nso will overwrite the default name.")
end function
if (params == []) or (params[0] == "-h") or (params[0] == "--help") or (params[0] == "-?") then usage()
// Param parsing
login = null
source_file = null
output_folder = null
custom_name = null
should_run = true
run_params = ""
is_run_param = false
i = 0
while true
	if i == params.len then break
	if not is_run_param then
		if params[i] == "-r" then
			if params.len <= i + 1 then usage()
			login = ["root", params[i + 1]]
			i = i + 1
		else if params[i] == "-u" then
			if params.len <= i + 2 then usage()
			login = [params[i + 1], params[i + 2]]
			i = i + 2
		else if params[i] == "-i" then
			if params.len <= i + 1 then usage()
			source_file = params[i + 1]
			i = i + 1
		else if params[i] == "-o" then
			if params.len <= i + 1 then usage()
			output_folder = params[i + 1]
			i = i + 1
		else if params[i] == "-n" then
			if params.len <= i + 1 then usage()
			custom_name = params[i + 1]
			i = i + 1
		else if params[i] == "-b" then
			should_run = false
		else if params[i] == "-p" then
			is_run_param = true
		else
			exit("Unknown token: " + params[i])
		end if
	else
		run_params = run_params + params[i] + " "
	end if
	i = i + 1
end while
// Create objects
if login then shell = get_shell(login[0], login[1]) else shell = get_shell
computer = shell.host_computer
source_file = computer.File(source_file) 
if not source_file then exit("Source file not found")
if output_folder then output_folder = computer.File(output_folder) else output_folder = source_file.parent
if not output_folder then exit("Output folder not found")
// Build
print("Building " + source_file.path + " at " + output_folder.path + "/")
print(shell.build(source_file.path, output_folder.path))
// Get compiled file
name_list = source_file.name.split(".")
name_list.pop
output_file = ""
for i in range(0, name_list.len - 1)
	output_file = output_file + name_list[i]
	if i != name_list.len - 1 then output_file = output_file + "."
end for
output_file = computer.File(output_folder.path + "/" + output_file)
// Rename if custom name is specified
if custom_name then
	output_file.rename(custom_name)
end if
// Run
if should_run then
	print("Running " + output_file.path + "\n")
	shell.launch(output_file.path, run_params.trim)
end if
