const TelegramBot = require("node-telegram-bot-api");
const helpers = require('./helpers');
const TOKEN = '528549200:AAE4uCDX6fo1y7pztwfoOVqemNWz5uZyRuI';
const firebase = require("firebase");

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
        one_time_keyboard: true
    }
};
const choice_of_the_month_key = {
        reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: helpers.goodDate(),
                            callback_data: 'choice_of_the_month_0'
                        },
                        {
                            text: helpers.goodDate(1),
                            callback_data: 'choice_of_the_month_1'
                        },
                        {
                            text: helpers.goodDate(2),
                            callback_data: 'choice_of_the_month_2'
                        }
                    ],
                    [
                        {
                            text: helpers.goodDate(3),
                            callback_data: 'choice_of_the_month_3'
                        },
                        {
                            text: helpers.goodDate(4),
                            callback_data: 'choice_of_the_month_4'
                        },
                        {
                            text: helpers.goodDate(5),
                            callback_data: 'choice_of_the_month_5'
                        }
                    ],
                    [
                        {
                            text: helpers.goodDate(6),
                            callback_data: 'choice_of_the_month_6'
                        },
                        {
                            text: helpers.goodDate(7),
                            callback_data: 'choice_of_the_month_7'
                        },
                        {
                            text: helpers.goodDate(8),
                            callback_data: 'choice_of_the_month_8'
                        }
                    ],
                    [
                        {
                            text: 'Заказ звонка',
                            callback_data: 'request_a_call'
                        },
                        {
                            text: 'Назад',
                            callback_data: 'back_to_write_key'
                        }
                    ]

                ]
            }
        }

// bot.onText(/\/help/,msg => {
//
// })

bot.on('message', msg => {
    // console.log(msg)
    const chatId = msg.chat.id;

    if(msg.contact){
        // firebase.database().ref('calls').push(msg.contact);
        firebase.database().ref('queue/'+msg.chat.id).update({
            name: msg.chat.first_name + ' ' +msg.chat.last_name,
            // username: msg.chat.username,
            phone: msg.contact.phone_number
        })
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
    }else if(msg.text == '📝 Запись') {
        bot.sendMessage(chatId, 'Вы можете записаться на конкретную дату или выбрать мастера и записаться в часы его работы', writeKey)
    }else if(msg.text == '🔙 Назад' ) {
        bot.sendMessage(chatId, 'Выберите действие 🤔', homeKey)
    }
    else if(msg.text == '📅 Выбор даты' ) {
        bot.sendMessage(chatId, 'Выберите дату: ', choice_of_the_month_key)
    }
    else if(msg.text == '✂️ Выбор мастера' ) {
        var allMasters  = [];
        firebase.database().ref('schedule/').on("value", function(snapshot) {
            var values = snapshot.val();
            var temp;
            // console.log(values)
            var weekDaysArray = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
            for(var i = 0; i < weekDaysArray.length; i++ ){
                temp = values[weekDaysArray[i]];
                for(var j = 0; j< temp.length; j++)
                    allMasters.push([temp[j]])
            }
            allMasters = helpers.unique(allMasters)

            var masters_keyboard = [];
            for(var i = 0; i < allMasters.length; i++){
                masters_keyboard[i] = [{
                    text: allMasters[i],
                    callback_data: 'masters&&'+allMasters[i]
                }]
            };
            masters_keyboard[i] = [
                {
                    text: 'Заказ звонка',
                    callback_data: 'request_a_call'
                },
                {
                    text: 'Назад',
                    callback_data: 'back_to_write_key'
                }
            ];
            bot.sendMessage(msg.chat.id,'Выберите мастера:',{
                reply_markup:{
                    inline_keyboard: masters_keyboard
                }
            })

        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
        // console.log(allMasters)
    }

})

bot.on('callback_query', query => {

    const {chat, message_id, text} = query.message;

    // console.log(query.data);

    if(query.data.split("&&")[0] == 'name_date') {//2.2
        var name = query.data.split("&&")[1];
        var date = query.data.split("&&")[2];

        var reserved = [];
        // var flag = true;
        firebase.database().ref('queue/').on("value", function(snapshot) {
            var values = snapshot.val();
            for(var temp in values){
                if((date == values[temp].date)&&(name == values[temp].master))
                    reserved.push(values[temp].time)
            }
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

        var time_name_keyboard = helpers.getReservedTimeKey(reserved,date,name)
        time_name_keyboard[time_name_keyboard.length] = [
            {
                text: 'Заказ звонка',
                callback_data: 'request_a_call'
            },
            {
                text: 'Назад',
                callback_data: 'back_to_masters_keyboard'
            }
        ];

        bot.deleteMessage(chat.id,message_id);
        bot.sendMessage(chat.id,'Мастер '+name+' '+date  +' свободен в:  ',{
            reply_markup:{
                inline_keyboard: time_name_keyboard
            }
        })
    }

    if(query.data.split("&&")[0] == 'masters'){ //2.1

        var master = query.data.split("&&")[1];
        firebase.database().ref('mastersWeekDays/'+master).on("value", function(snapshot) {
            var values = snapshot.val();
            if(values == null || values == 'null'){
                bot.sendMessage(chat.id, 'Что-то пошло не так ', {});
                return
            }
            var key = helpers.getSheduleByWeekDays(values,master);
            key[key.length] = [
                {
                    text: 'Заказ звонка',
                    callback_data: 'request_a_call'
                },
                {
                    text: 'Назад',
                    callback_data: 'back_to_masters_keyboard'
                }]
            // console.log(key);
            bot.deleteMessage(chat.id,message_id);
            bot.sendMessage(chat.id,'Мастер '+ master +' работает :  ',{
                reply_markup:{
                    inline_keyboard: key
                }
            })

        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });


    }

    if(query.data.split("&&")[0] == 'time_name'){ //1.4

        bot.deleteMessage(chat.id,message_id);
        firebase.database().ref('queue/'+chat.id).update({
            name: chat.first_name + ' ' +chat.last_name,
            date: query.data.split("&&")[1],
            time: query.data.split("&&")[3],
            master: query.data.split("&&")[2]
        })
        bot.sendMessage(chat.id, 'Вы записаны к  '
            +query.data.split("&&")[2]+' '+query.data.split("&&")[1]+' в '+query.data.split("&&")[3]+';'
            +'\nПоделитесь номером телефона чтоб мы могли с вами связаться', {
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

    if(query.data.slice(0,9) == 'date_name'){ //1.3
        var date = query.data.split('&&')[2];
        var name = query.data.split('&&')[1];
        // console.log(date)
        // console.log(name)
        var reserved = [];

        firebase.database().ref('queue/').on("value", function(snapshot) {
            var values = snapshot.val();
            for(var temp in values){
                if((date == values[temp].date)&&(name == values[temp].master))
                    reserved.push(values[temp].time)
            }
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

        var time_name_keyboard = helpers.getReservedTimeKey(reserved,date,name)
        time_name_keyboard[time_name_keyboard.length] = [
            {
                text: 'Заказ звонка',
                callback_data: 'request_a_call'
            },
            {
                text: 'Назад',
                callback_data: 'back_to_date_name_key'
            }
        ];

        bot.deleteMessage(chat.id,message_id);
        bot.sendMessage(chat.id,'Мастер '+name+' '+date  +' свободен в:  ',{
            reply_markup:{
                inline_keyboard: time_name_keyboard
            }
        })

        // console.log(reserved)
    }

    if(query.data.slice(0,19) == 'choice_of_the_month'){ //1.2
        var good_date = helpers.goodDate(+query.data.slice(-1));

        var week_day = helpers.getWeekDay(+query.data.slice(-1));
        firebase.database().ref('schedule/'+week_day).on("value", function(snapshot) {
           const masters = snapshot.val();
           if(masters == null || masters == 'null'){
               bot.deleteMessage(chat.id,message_id);
               bot.sendMessage(chat.id, good_date+' не работает ни один мастер.\nВыберите другую дату: ', choice_of_the_month_key);
               return
           }

           var date_name_keyboard = [];
           for(var i = 0; i < masters.length; i++){
               date_name_keyboard[i] = [{
                   text: masters[i],
                   callback_data: 'date_name&&'+masters[i]+'&&'+good_date
               }]
           };
           date_name_keyboard[i] = [
               {
                   text: 'Заказ звонка',
                   callback_data: 'request_a_call'
               },
               {
                   text: 'Назад',
                   callback_data: 'back_to_date_name_key'
               }
           ];

           bot.deleteMessage(chat.id,message_id);
           bot.sendMessage(chat.id,good_date +' работают следующие мастера. Вы можете самостоятельно выбрать мастера.',{
               reply_markup:{
                   inline_keyboard: date_name_keyboard
               }
           })
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    }

    switch(query.data){ //1.1
        case 'back_to_date_name_key':
            bot.deleteMessage(chat.id,message_id)
            bot.sendMessage(chat.id, 'Выберите дату: ', choice_of_the_month_key)
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
            var allMasters  = [];
            firebase.database().ref('schedule/').on("value", function(snapshot) {
                var values = snapshot.val();
                var temp;
                // console.log(values)
                var weekDaysArray = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
                for(var i = 0; i < weekDaysArray.length; i++ ){
                    temp = values[weekDaysArray[i]];
                    for(var j = 0; j< temp.length; j++)
                        allMasters.push([temp[j]])
                }
                allMasters = helpers.unique(allMasters)

                var masters_keyboard = [];
                for(var i = 0; i < allMasters.length; i++){
                    masters_keyboard[i] = [{
                        text: allMasters[i],
                        callback_data: 'masters&&'+allMasters[i]
                    }]
                };
                masters_keyboard[i] = [
                    {
                        text: 'Заказ звонка',
                        callback_data: 'request_a_call'
                    },
                    {
                        text: 'Назад',
                        callback_data: 'back_to_write_key'
                    }
                ];
                bot.deleteMessage(chat.id,message_id);
                bot.sendMessage(chat.id,'Выберите мастера:',{
                    reply_markup:{
                        inline_keyboard: masters_keyboard
                    }
                })

            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
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
    bot.sendMessage(msg.chat.id,'Этот бот разработан компанией helpexcel в 2018 году. \nhttp://helpexcel.pro/', homeKey)
})

