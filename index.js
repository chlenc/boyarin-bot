const TelegramBot = require("node-telegram-bot-api");
const helpers = require('./helpers');
const TOKEN = '528549200:AAE4uCDX6fo1y7pztwfoOVqemNWz5uZyRuI';
const firebase = require("firebase");
const crm = require('./crm');

//https://www.youtube.com/watch?v=G_FlX41qADE

firebase.initializeApp({
    serviceAccount: "./BarberBot-e312e18148ce.json",
    databaseURL: "https://boyarin-bot.firebaseio.com/"
})

console.log('Bot has been started ....');

const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
});

const homeKey = {
    reply_markup: {
        keyboard: [
            ['💰 Цены', '📝 Запись'],
            [{
                text : '📲 Заказать звонок',
                request_contact: true
            }]
        ]//,
        //one_time_keyboard: true
    }
};
const writeKey = {
    reply_markup: {
        keyboard: [
            [ '📅 Выбор даты','✂️ Выбор мастера'],
            [{
                text : '📲 Заказать звонок',
                request_contact: true
            }, '🔙 Назад' ]
        ],
        // one_time_keyboard: true
    }
};

bot.on('message', msg => {
    console.log(msg)
    const chatId = msg.chat.id;

    if(msg.contact){
        var date = new Date()
        var username = msg.chat.username;
        if (username == undefined)
            username = '';
        else{username='@'+username;}
        bot.sendMessage(-214510409,"Заявка на звонок: \n"+date.getHours()+':'+date.getMinutes()+', '+('0' + date.getDate()).slice(-2) + '.' +
            ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear()+
        '\n'+msg.chat.first_name+'\n'+msg.contact.phone_number+'\n'+username,{})
        bot.sendMessage(msg.chat.id,'Вам перезвонят ✅');
        setTimeout(() => {
            bot.sendMessage(chatId, 'Выберите действие 🤔', homeKey)
        },500)
    }
    else if(msg.text == '💰 Цены') {
        bot.sendMessage(chatId, "СТОИМОСТЬ НАШИХ УСЛУГ\n" +
            "\n" +
            "Мужские стрижки:\n" +
            "Модельная мужская стрижка - 600 руб\n" +
            "Стрижка машинкой с переходом - 450 руб\n" +
            "Детская стрижка (до 10 лет) - 350 руб\n" +
            "Стрижка машинкой экспресс - 300 руб\n" +
            "Мужская укладка - 300 руб\n" +
            "\n" +
            "Моделирование бороды и усов:\n" +
            "Королевское бритье - 500 руб\n" +
            "Моделирование бороды и усов - 500 руб\n" +
            "Тонировка бороды/окрашивание - 700 руб\n" +
            "Мужская депиляция от - 300 руб\n" +
            "\n" +
            "Комплексные услуги:\n" +
            "Стрижка и королевское бритье - 1100 руб\n" +
            "Стрижка и моделирование бороды - 1100 руб\n" +
            'Стрижка "Отец и сын" - 800 руб')
        setTimeout(() => {
            bot.sendMessage(chatId, 'Выберите действие 🤔', homeKey)
         },500)
    }
    else if(msg.text == '📝 Запись') {
        bot.sendMessage(chatId, 'Вы можете записаться на конкретную дату или выбрать мастера и записаться в часы его работы', writeKey)
    }
    else if(msg.text == '🔙 Назад' ) {
        bot.sendMessage(chatId, 'Выберите действие 🤔', homeKey)
    }
    else if(msg.text == '📅 Выбор даты' ) {
        bot.sendMessage(chatId, 'Выберите дату: ', helpers.choice_month_key(new Date()))
    }
    else if(msg.text == '✂️ Выбор мастера' ) {
        var masters;
        try {
            crm.getMastersKey(function (err, masters_keyboard) {
                bot.sendMessage(chatId, 'Выберите мастера:', {
                    reply_markup: {
                        inline_keyboard: masters_keyboard
                    }
                })
            });
        }catch(e){
            bot.sendMessage(chatId, 'Что-то пошло не так 🙄',{})
        }
    }
})

bot.on('callback_query', query => {

    const {chat, message_id, text} = query.message;
    // console.log(query.data);

    if(query.data.split("&&")[0] == 'm'){ //2.1
        var master = query.data.split("&&")[1];
        var id = query.data.split("&&")[2];
        crm.getDatesByMaster(id,master,function(err, key){
            bot.deleteMessage(chat.id,message_id);
            bot.sendMessage(chat.id,'Мастер '+ master +' работает :  ',{
                reply_markup:{
                    inline_keyboard: key
                }
            })
        })
    } //2.1 -> 2.2

    if(query.data.split("&&")[0] == 'md') {//2.2
        var name = query.data.split("&&")[2];
        var date = query.data.split("&&")[1];
        var id = query.data.split("&&")[3];
        crm.getTimeByMasterAndDate(id,date,name,function(err, key) {
            key.push([
                { text: 'Заказ звонка',callback_data: 'request_a_call'},
                { text: 'Назад',callback_data: 'back_to_masters_keyboard'} ]);
            bot.deleteMessage(chat.id,message_id);
            bot.sendMessage(chat.id,'Мастер '+name+' '+date.split('-')[2]+'.'+date.split('-')[1]+'.'+date.split('-')[0]+' свободен в:'  , {
                reply_markup: {
                    inline_keyboard: key
                }
            })
        })
    } //2.2 -> 2.3

    if(query.data.split("&&")[0] == 'mdt'){ //(1)2.4
        var client = chat.first_name;
        var date = query.data.split("&&")[2];
        var time = query.data.split("&&")[3];
        var master = query.data.split("&&")[1];
        var id = query.data.split("&&")[4];
        bot.deleteMessage(chat.id,message_id);

        var username = chat.username;
        if (username == undefined)
            username = '';
        else{username='\n\nСвязаться с клиентом: @'+username;}

        bot.sendMessage(-214510409,"Запись: \n"+client+' записан к  '+master+' '+date.split('-')[2]+'.'+date.split('-')[1]
        +'.'+date.split('-')[0]+' в '+(time+'').substring(0, 2)+':'+(time+'').substring(2)+'.'+username,{})
        bot.sendMessage(chat.id, client+', вы записаны к  '+master+' '+date.split('-')[2]+'.'+date.split('-')[1]
            +'.'+date.split('-')[0]+' в '+(time+'').substring(0, 2)+':'+(time+'').substring(2)+'.'
            +'\nПоделитесь номером телефона чтоб мы могли с вами связаться.', {
            reply_markup:{
                keyboard:[
                    [{
                        text : '📱 Поделитесь номером',
                        request_contact: true,
                    }], ['🔙 Назад' ]
                ]
            }
        })
        // bot.sendMessage(chat.id, 'Выберите действие 🤔', homeKey)
    }

    if(query.data.split("&&")[0] == 'd') { //1.1 -> 2.2
        var date = query.data.split('&&')[1];
        crm.getMastersByDateKey(date, function (err, key) {
            bot.deleteMessage(chat.id, message_id);
            bot.sendMessage(chat.id, date.split('-')[2] + '.' + date.split('-')[1] + '.' + date.split('-')[0] + ' работают следующие мастера:', {
                reply_markup: {
                    inline_keyboard: key
                }
            })
        })
    }

    if(query.data.split("&&")[0] == 'dm') { //1.2 -> 2.3
        var date = query.data.split('&&')[1];
        var name = query.data.split('&&')[2];
        var id = query.data.split('&&')[3];
        crm.getTimeByMasterAndDate(id,date,name,function(err, key) {
            key.push([
                { text: 'Заказ звонка',callback_data: 'request_a_call'},
                { text: 'Назад',callback_data: 'back_to_date_name_key'} ]);
            bot.deleteMessage(chat.id,message_id);
            bot.sendMessage(chat.id,'Мастер '+name+' '+date.split('-')[2]+'.'+date.split('-')[1]+'.'+date.split('-')[0]+' свободен в:'  , {
                reply_markup: {
                    inline_keyboard: key
                }
            })
        })
    }

    switch(query.data){ //1.1
        case 'back_to_date_name_key':
            bot.deleteMessage(chat.id,message_id)
            bot.sendMessage(chat.id, 'Выберите дату: ', helpers.choice_month_key(new Date()))
            break
        case 'back_to_write_key':
            bot.deleteMessage(chat.id,message_id)
            bot.sendMessage(chat.id, 'Вы можете записаться на конкретную дату или выбрать мастера и записаться в часы его работы', writeKey)
            break
        case 'request_a_call':
            bot.deleteMessage(chat.id,message_id)
            bot.sendMessage(chat.id, 'Поделитесь контактом', {
                reply_markup:{
                    keyboard:[
                        [{
                            text : '📲 Заказать звонок',
                            request_contact: true
                        }], ['🔙 Назад' ]
                    ]
                }
            })
            break
        case 'back_to_masters_keyboard':
            var masters;
            try {
                crm.getMastersKey(function (err, masters_keyboard) {
                    bot.sendMessage(chat.id, 'Выберите мастера:', {
                        reply_markup: {
                            inline_keyboard: masters_keyboard
                        }
                    })
                });
            }catch(e){
                bot.sendMessage(chat.id, 'Что-то пошло не так 🙄',{})
            }

            break

    };

    bot.answerCallbackQuery({
        callback_query_id: query.id
    })

})

bot.onText(/\/start/, msg => {
    bot.sendMessage(msg.chat.id, 'Приветствую вас, '+msg.from.first_name+'! '+'\nВыберите действие 🤔', homeKey)
})

bot.onText(/\/help/, msg => {
    bot.sendMessage(msg.chat.id, msg.from.first_name+','+'этот бот может помочь вам записаться приём и ознакомить вас с прайс листом.', homeKey)
})

bot.onText(/\/about/, msg => {
    bot.sendMessage(msg.chat.id, 'Этот бот разработан компанией helpexcel в 2018 году.\n\nРазработчик: +79151272664 (Алексей)'+
    '\n\nБот-помошник: @helpexcel_bot \n\nСайт: http://helpexcel.pro/', homeKey)
})
