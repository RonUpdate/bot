const { Telegraf } = require('telegraf');
const { OpenAIApi, Configuration } = require('openai');
require('dotenv').config();  // Подключаем dotenv

// Настройка Telegram-бота
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN); // Получаем токен из переменных окружения

// Настройка OpenAI API
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Получаем API ключ из переменных окружения
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
    ctx.reply(response.data.choices[0].text.trim());
  } catch (error) {
    console.error('Ошибка:', error);
    ctx.reply('Произошла ошибка. Попробуй снова.');
  }
});

// Запуск бота с использованием long polling
bot.launch()
  .then(() => console.log('Бот запущен 🚀'))
  .catch((error) => console.error('Ошибка при запуске бота:', error));

// Грейсфул-шатдаун (по рекомендации Telegraf)
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
