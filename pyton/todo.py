import telebot
import random

token = '5474685752:AAHnqAQBBU8r-1vYuO6vAHTAaPAp3DtZdFU'

bot = telebot.TeleBot(token)

HELP = """
/help - вывести справку доступных команд.
/add - добавить задачу в список.
/show - напечатать все добавленные задачи.
/random - добовляет случайную задачу на дату сегодня."""

RANDOM_TASKS = ["Записаться на курс Нетологии", "Изучить HTML", "Изучить CSS", "Изучить GIT", "Изучить Python" ]

tasks = {}

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


@bot.message_handler(commands=["help"])
def help(message):
    bot.send_message(message.chat.id, HELP)

@bot.message_handler(commands=["add", "todo"])
def add(message):
  command = message.text.split(maxsplit=2)
  date = command[1].lower()
  task = command[2]
  add_todo(date, task)
  text = "Задача "+ task + " добавлена на дату " + date
  bot.send_message(message.chat.id, text)

@bot.message_handler(commands=["random"])
def random_add(message):
  date = "сегодня"
  task = random.choice(RANDOM_TASKS)
  add_todo(date, task)
  text = "Задача "+ task + " добавлена на дату " + date
  bot.send_message(message.chat.id, text)

@bot.message_handler(commands=["show", "print"])
def show(message): # message.text = /print <date>
  command = message.text.split(maxsplit=1)
  date = command[1].lower()
  text = ""
  if date in tasks:
    text = date.upper()+"\n"
    for task in tasks[date]:
      text = text + "[] " + task + "\n"
  else:
    text = "Ззадач на эту дату нет"
  bot.send_message(message.chat.id, text)

bot.polling(none_stop=True) 