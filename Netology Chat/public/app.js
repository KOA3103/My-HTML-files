!(() => {
  // id последнего сообщения
  let lastMessageId = -1;
  // отправка сообщения
  document.addEventListener("submit", (e) => {
    const chatForm = e.target.closest(".chat-form");
    if (!chatForm) {
      return;
    }

    // форма заполнена верно?
    if (!chatForm.checkValidity()) {
      return;
    }
    // отмена действия браузера по умолчанию (обновление страницы)
    e.preventDefault();

    // сначала отображаем сообщение
    const chat = chatForm.closest(".chat");
    const messageInput = chatForm.elements.message;
    const message = messageInput.value;
    const messageContainer = chat.querySelector(".chat__messages");

    renderMessage({
      username: getUserName(),
      message,
      container: messageContainer,
    });

    // сохраняем сообщение на сервере
    sendMessage({
      username: getUserName(),
      message,
    });

    // очищаем форму и даём фокус ввода полю
    chatForm.reset();
    messageInput.focus();
  });

  // получить список сообщений с сервера
  const listMessages = async () => {
    const url = "/?action=list-messages";
    const response = await fetch(url);
    const { data } = await response.json();
    return data;
  };

  // получить список обновлений с сервера
  const getUpdates = async () => {
    const url = "/?action=new-messages&last_update=" + lastMessageId;
    const response = await fetch(url);
    const { data } = await response.json();
    return data;
  };

  // отправить сообщение
  const sendMessage = async (options) => {
    const { message, username } = options;

    const formData = new FormData();
    formData.append("message", message);
    formData.append("username", username);

    const url = "/?action=create-message";
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const { id } = await response.json();

    lastMessageId = id;
  };

  // формирует случайную строку
  const getRandomString = () => Math.random().toString(36).substr(2);

  // получает имя пользователя в системе
  const getUserName = () => {
    let { username } = localStorage;
    if (username) {
      return username;
    }
    username = "user-" + getRandomString();
    localStorage.username = username;

    return username;
  };

  // создаёт DOM-элемент
  const createElement = (tagName, options = {}) =>
    Object.assign(document.createElement(tagName), options);

  // отрисовывает сообщение
  const renderMessage = (options) => {
    const { message, container } = options;

    const isMyMessage = options.username === getUserName();
    const username = isMyMessage ? "Вы" : options.username;

    const messageClassName = isMyMessage
      ? "chat-message chat-message_my"
      : "chat-message chat-message_user";
    const node = createElement("div", {
      className: messageClassName,
    });
    const userNode = createElement("div", {
      className: "chat-message__user",
      textContent: username,
    });
    const textNode = createElement("div", {
      className: "chat-message__text",
      textContent: message,
    });

    node.appendChild(userNode);
    node.appendChild(textNode);

    container.appendChild(node);
  };

  // отрисовка обновлений
  const renderMessages = (options) => {
    const { messages, container } = options;
    messages.forEach((item) => {
      renderMessage({
        ...item,
        container,
      });
    });

    if (messages.length === 0) {
      return;
    }
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      return;
    }
    lastMessageId = lastMessage.id;
  };

  const initUpdates = () => {
    const container = document.querySelector(".chat__messages");

    setInterval(async () => {
      const messages = await getUpdates();

      renderMessages({
        messages,
        container,
      });
    }, 5000);
  };

  const onload = (callback) => {
    if (document.readyState !== "loading") {
      return callback();
    }
    document.addEventListener("DOMContentLoaded", callback);
  };

  // запуск приложения по загрузке DOM
  onload(async () => {
    const container = document.querySelector(".chat__messages");
    if (!container) {
      return;
    }
    const messages = await listMessages();

    renderMessages({
      messages,
      container,
    });

    initUpdates();
  });
})();
