#Доработка программы
import random
HELP = """
help - напечатать справку по программе.
add - добавить задачу в список.
show - напечатать все добавленные задачи.
random - добовляет случайную задачу на дату сегодня."""

RANDOM_TASKS = ["Записаться на курс Нетологии", "Изучить HTML", "Изучить CSS", "Изучить GIT", "Изучить Python" ]

tasks = {}

run = True

def add_todo(date, task):
    if date in tasks:
        # Дата есть в словаре
        # Добавляем в список задачу
        tasks[date].append(task)
    else:
        # Даты нет в словаре
        # Создаем запись с ключем date
        tasks[date]=[]
        tasks[date].append(task)
    print("задача", task, "добавлена на дату", date)

while run:
    command = input("Введите команду: ")

    if command.lower() == "help":
        print(HELP)
    elif command.lower() == "show":
        date = input("Введите дату для отображения списка задач: ")
        if date in tasks:
            for task in tasks[date]:
                print('- ', task)
        else:
            print("Такой даты нет")
    elif command.lower() == "show all":
        for date in tasks:
            print(tasks)

    elif command.lower() == "add":
        date = input("Введите дату для добавления задачи: ")
        task = input("ВВедите название задачи: ")
        add_todo(date, task)
            
    elif command.lower() == "random":
        task = random.choice(RANDOM_TASKS)
        add_todo("Сегодня", task)

    else:
        if command.lower() == "exit":

            print("Спасибо за использование!")
            
        else:
            print("Неизвестная команда!")
            break
print("До свидания!")

