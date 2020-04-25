const TOKEN = process.env.TELEGRAM_TOKEN || '1013712671:AAF0AzZ0zGawEY6X11SkGfXU5C_S70ld6lI';
const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const debug = require('./helpers');
const options = {
  webHook: {
    port: process.env.PORT
  }
};

const url = process.env.APP_URL || 'https://li1n-bot.herokuapp.com:443';
const bot = new TelegramBot(TOKEN, options);
bot.setWebHook(`${url}/bot${TOKEN}`);


bot.onText(/\/key/, function (msg) {
  var fromId = msg.from.id; 
    bot.sendMessage(fromId, 'Клавіатура', {
    reply_markup: {
      keyboard: [
        [{
          text: 'Location',
          request_location: true
        },
        {
          text: 'My phone number',
          request_contact: true
        }],
      ],
      one_time_keyboard: true
    },
  });

});



bot.onText(/\json/, function (msg) {

  const html = `
<strong>Hello, ${msg.from.first_name}</strong>

<pre>${debug(msg)}</pre>
`;
    var fromId = msg.from.id; // Получаем ID отправителя
         bot.sendMessage(fromId, html, {parse_mode: 'HTML'});
});

bot.onText(/\/curse/, function (msg) {
  var fromId = msg.from.id; // Получаем ID отправителя
      
       bot.sendMessage(fromId, 'Яка валюта вас цікавить?', {
         reply_markup: {
           inline_keyboard: [
             [
               {
                 text: '€ - EUR',
                 callback_data: 'EUR'
               },
               {
                text: '$ - USD',
                callback_data: 'USD'
              },
              {
                text: '₿ - BTC',
                callback_data: 'BTC'
              },
              {
                text: '₽ - RUR',
                callback_data: 'RUR'
              },

             ]
           ]
         }
       });
});

bot.on('callback_query', query => {
  const id = query.message.chat.id;

  request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', 
  function(error, response, body){
    const data = JSON.parse(body);
    const result = data.filter(item => item.ccy === query.data)[0];
    const flag = {
      'EUR': '🇪🇺',
      'USD': '🇺🇸',
      'RUR': '🇷🇺',
      'BTC': '₿',
      'UAH': '🇺🇦',
    }
    let md = `
      *${flag[result.ccy]} ${result.ccy} 💱 ${result.base_ccy} ${flag[result.base_ccy]}*

      Buy:  ${result.buy}
      Sale: ${result.sale}
    `;
    bot.answerCallbackQuery(query.id, `${flag[result.ccy]}`);
    bot.sendMessage(id, md, {parse_mode: 'Markdown'});
    
  }
  );
})

bot.on('inline_query', query => {

  results = [
    {
      type: "photo",
      id : "1",
      photo_url :"https://images.theconversation.com/files/319375/original/file-20200309-118956-1cqvm6j.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop",
      thumb_url :"https://images.theconversation.com/files/319375/original/file-20200309-118956-1cqvm6j.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop",
      title : "TestTitle",
      photo_width: 40,
      photo_height: 40
   },
   {
    type: "photo",
    id : "2",
    photo_url :"https://images.theconversation.com/files/319375/original/file-20200309-118956-1cqvm6j.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop",
    thumb_url :"https://images.theconversation.com/files/319375/original/file-20200309-118956-1cqvm6j.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop",
    title : "TestTitle2",
    photo_width: 40,
    photo_height: 40
 }
  ]



  bot.answerInlineQuery(query.id, results, {
    cache_time: 0
  })
})


