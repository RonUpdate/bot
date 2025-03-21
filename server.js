const { Telegraf } = require('telegraf');
const { OpenAIApi, Configuration } = require('openai');

// Настройка Telegram-бота
const bot = new Telegraf('7953930520:AAHfK3RHiw5UNWxrBqkeqak1-9VuQ73O4tg'); // Замените на свой токен

// Настройка OpenAI API
const openai = new OpenAIApi(new Configuration({
  apiKey: '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', // Замените на свой API ключ
}));

// Команда /start — приветствие
bot.command('start', (ctx) => {
  ctx.reply('Привет! Чем могу помочь?');
});

// Обработка текста — генерируем ответ с помощью OpenAI
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;  // Получаем сообщение от пользователя

  try {
    // Отправляем запрос к OpenAI API для генерации ответа
    const response = await openai.createCompletion({
      model: 'text-davinci-003', // Выбираем модель
      prompt: userMessage, // Передаём сообщение в качестве запроса
      max_tokens: 150, // Ограничиваем количество токенов
    });

    // Отправляем ответ пользователю
    ctx.reply(response.data.choices[0].text);
  } catch (error) {
    console.error('Ошибка:', error);
    ctx.reply('Произошла ошибка. Попробуй снова.');
  }
});

// Запускаем бота
bot.launch();
