// const helpers = require('./helpers');
const firebase = require("firebase");
const frases = require('./frases')

firebase.initializeApp({
    serviceAccount: "./BarberBot-e312e18148ce.json",
    databaseURL: "https://boyarin-bot.firebaseio.com/"
});
const applicationChatId = '-214510409'//'-253287629'


module.exports = {
    applicationChatId: applicationChatId,
    start(msg) {
        firebase.database().ref('users/' + msg.chat.id).set(msg.chat);
    },
    addContact(bot, msg) {
        var chatId = msg.chat.id;
        firebase.database().ref('users/' + chatId).update({
            phone_number: msg.contact.phone_number
        });
        bot.sendMessage(
            applicationChatId,
            `${getDateTime()}\n<b>Новый клиент:</b>\n\nИмя: <a href="tg://user?id` +
            `=${msg.chat.id}">${msg.chat.first_name}</a>\nНомер: ${msg.contact.phone_number}`,
            {parse_mode: 'HTML'});

        bot.sendMessage(chatId, frases.welcome(msg.chat.first_name), {
            reply_markup: {
                remove_keyboard: true
            }
        }).then(function () {
            setTimeout(function () {
                bot.sendMessage(chatId,frases.home,{
                    reply_markup: {
                        keyboard: [['💰 Цены'], ['📝 Запись']]
                    }
                })
            }, 600)

        })
    },
    getUserData(id,callback){
        firebase.database().ref('users/'+id).once('value',function (snapshot) {
            var data = snapshot.val();
            if(snapshot.val() != null){
                callback(data,false)
            }else {
                callback(null,true)
            }
        },function (error) {
            console.log(error)
        })
    },
    choice_month_key(date) {
        return {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear(),
                            callback_data: 'd&&' + date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
                        },
                        {
                            text: ('0' + (date.getDate() + 1)).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear(),
                            callback_data: 'd&&' + date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDate() + 1)).slice(-2)
                        },
                        {
                            text: ('0' + (date.getDate() + 2)).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear(),
                            callback_data: 'd&&' + date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDate() + 2)).slice(-2)
                        }
                    ],
                    [
                        {
                            text: ('0' + (date.getDate() + 3)).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear(),
                            callback_data: 'd&&' + date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDate() + 3)).slice(-2)
                        },
                        {
                            text: ('0' + (date.getDate() + 4)).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear(),
                            callback_data: 'd&&' + date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDate() + 4)).slice(-2)
                        },
                        {
                            text: ('0' + (date.getDate() + 5)).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear(),
                            callback_data: 'd&&' + date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDate() + 5)).slice(-2)
                        }
                    ],
                    [
                        {
                            text: ('0' + (date.getDate() + 6)).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear(),
                            callback_data: 'd&&' + date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDate() + 6)).slice(-2)
                        },
                        {
                            text: ('0' + (date.getDate() + 7)).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear(),
                            callback_data: 'd&&' + date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDate() + 7)).slice(-2)
                        },
                        {
                            text: ('0' + (date.getDate() + 8)).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear(),
                            callback_data: 'd&&' + date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDate() + 8)).slice(-2)
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
    },
    formatDate(date) {
        date = new Date(date);
        return ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
    },
    conventDate(date) {
        var arr = date.split(' ');
        return arr[0] + ' ' + arr[1][0] + arr[1][1] + ':' + arr[1][2] + arr[1][3] + ':00'
    },
    goodDate(num) {
        var date = new Date();
        if (num == undefined)
            num = 0;
        var tempDate = new Date;
        var date = new Date(tempDate.getFullYear(), tempDate.getMonth(), (tempDate.getDate() + num));
        // console.log(date)
        return ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
    },

    getWeekDay(num) {
        var date = new Date();
        if (num == undefined)
            num = 0;
        return ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][(new Date(date.getFullYear(), date.getMonth(), (date.getDate() + num))).getDay()];
    },

    unique(arr) {
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            var str = arr[i];
            if (arr[i] != '')
                obj[str] = true;
        }
        return Object.keys(obj);
    },
    getSheduleByWeekDays(weekdays, name) {
        // weekdays = [ 'Ср', 'Сб' ];
        var date = new Date();
        var arr = [];
        for (var i = 0; i < 29; i++) {
            if (weekdays.indexOf(helpgetWeekDay(i)) != -1)
                arr.push([{
                    text: helpgoodDate(i),
                    callback_data: 'name_date&&' + name + '&&' + helpgoodDate(i)
                }])
        }
        return arr;
    },

    getReservedTimeKey(reserved, date, name) {
        var keyboard = [];
        var t1, t2, c1, c2;
        for (var i = 9; i <= 19; i++) {
            t1 = i + ':00';
            t2 = i + ':30';
            c1 = 'time_name&&' + date + '&&' + name + '&&' + t1;
            c2 = 'time_name&&' + date + '&&' + name + '&&' + t2;
            if (reserved.indexOf(t1) != (-1)) {
                t1 = 'Занято';
                c1 = '-'
            }
            if (reserved.indexOf(t2) != (-1)) {
                t2 = 'Занято';
                c2 = '-'
            }
            keyboard[i - 9] = [{
                text: t1,
                callback_data: c1
            }, {
                text: t2,
                callback_data: c2
            }]
        }
        return keyboard;
    }


}

function helpgetWeekDay(num) {
    var date = new Date();
    if (num == undefined)
        num = 0;
    return ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][(new Date(date.getFullYear(), date.getMonth(), (date.getDate() + num))).getDay()];
}

function helpgoodDate(num) {
    if (num == undefined)
        num = 0;
    var tempDate = new Date;
    var date = new Date(tempDate.getFullYear(), tempDate.getMonth(), (tempDate.getDate() + num));

    return ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
}

function getDateTime() {
    var date = new Date()
    return `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`
}
