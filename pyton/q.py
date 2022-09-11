command = "/add 28.07.2022 task to Do how"
splitted_command = command.split(maxsplit=2)
print(splitted_command)
date = splitted_command[1]
print(date)
task = splitted_command[2]
print(date, task)
task2 = splitted_command[2]
print(date, task2)
print(splitted_command[2])