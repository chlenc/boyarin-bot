const request = require('request');
const headers = {
    'X-API-Key': 'boyarin6592kjdfbvr58difuhll3fcbyems'
}
const frases = require('./frases');
const salonId = frases.salonid;
const kb = require('./keyboard-buttons')
const helpers = require('./helpers')
module.exports = {

    getMastersByDateKey(date, callback) {

        var options = {
            url: 'http://api.sonline.su/v1/schedule/' + salonId + '/?date=' + date,
            method: 'GET',
            headers: headers
        }
        request(options, function (error, response, data) {
            try {
                if (!error && response.statusCode == 200) {
                    data = JSON.parse(data);
                    var key = [];
                    var item;
                    for (var i = 1; i < data.length; i++) {
                        item = data[i];
                        key.push([{text: item.name, callback_data: 'dm&&' + date + '&&' + item.name + '&&' + item.id}]);
                    }
                    key.push([
                        {text: 'Заказ звонка', callback_data: 'request_a_call'},
                        {text: 'Назад', callback_data: 'back_to_date_name_key'}]);

                    callback(null, key);
                }
            }
            catch (e) {
                console.log(e.toString())
            }
        })
    },
    getMasters(bot, id, serv) {
        var options = {
            url: 'http://api.sonline.su/v1/salons/' + salonId + '/masters?services=' + serv,
            method: 'GET',
            headers: headers
        }
        request(options, function (error, response, data) {
            try {
                if (!error && response.statusCode == 200) {
                    data = JSON.parse(data);
                    // console.log(data)
                    var masters_keyboard = [];
                    var item;
                    for (var i = 0; i < data.length; i++) {
                        item = data[i]
                        masters_keyboard.push([{
                            text: item.name, callback_data: JSON.stringify({
                                s: serv, t: 'md',
                                m: item.id
                            })
                        }])
                    };
                    masters_keyboard.push([kb.back('Назад 🔙', 'entry')]);
                    bot.sendMessage(id, frases.choose_master, {reply_markup: {inline_keyboard: masters_keyboard}})
                    // console.log(masters_keyboard)
                    //callback(null, masters_keyboard);
                }
            }
            catch (e) {
                console.log(e.toString())
            }
        })
    },
    getDatesByMaster(id, name, callback) {
        var options = {
            url: 'http://api.sonline.su/v1/schedule/' + salonId + '/?days_amount=14&master=' + id,
            method: 'GET',
            headers: headers
        }
        request(options, function (error, response, data) {
            try {
                if (!error && response.statusCode == 200) {
                    data = JSON.parse(data);
                    var dates_keyboard = [];
                    var item;
                    for (var i = 0; i < data.length; i++) {
                        item = data[i]
                        dates_keyboard.push([
                            {
                                text: item.date.split('-')[2] + '.' + item.date.split('-')[1] + '.' + item.date.split('-')[0],
                                callback_data: 'md&&' + item.date + '&&' + name + '&&' + id
                            }])
                    }
                    dates_keyboard.push([
                        {text: 'Заказ звонка', callback_data: 'request_a_call'},
                        {text: 'Назад', callback_data: 'back_to_masters_keyboard'}]);
                    // console.log(dates_keyboard)
                    callback(null, dates_keyboard);
                }
            }
            catch (e) {
                console.log(e.toString())
            }
        })
    },
    getTimeByMasterAndDate(id, date, name, callback) {
        var options = {
            url: 'http://api.sonline.su/v1/schedule/' + salonId + '/?days_amount=14&master=' + id,
            method: 'GET',
            headers: headers
        }
        try {
            request(options, function (error, response, data) {
                if (!error && response.statusCode == 200) {
                    data = JSON.parse(data);
                    var item;
                    for (var j = 0; j < data.length; j++) {
                        item = data[j];
                        if (data[j].date == date) {
                            var temp = data[j].schedule;
                            var key = [];
                            if (temp == undefined) {
                                key.push([
                                    {text: 'Все занято', callback_data: '-'}]);
                                callback(null, key);
                                return
                            }
                            var schedule = temp.filter(function (number) {
                                return number > 0;
                            });
                            temp = [];
                            for (var i = 0; i < schedule.length; i = i + 4) {
                                temp = []
                                if (schedule[i] != undefined)
                                    temp.push({
                                        text: (schedule[i] + '').substring(0, 2) + ':' + (schedule[i] + '').substring(2),
                                        callback_data: 'mdt&&' + name + '&&' + date + '&&' + schedule[i] + '&&' + id
                                    });
                                if (schedule[i + 1] != undefined)
                                    temp.push({
                                        text: (schedule[i + 1] + '').substring(0, 2) + ':' + (schedule[i + 1] + '').substring(2),
                                        callback_data: 'mdt&&' + name + '&&' + date + '&&' + schedule[i + 1] + '&&' + id
                                    });
                                if (schedule[i + 2] != undefined)
                                    temp.push({
                                        text: (schedule[i + 2] + '').substring(0, 2) + ':' + (schedule[i + 2] + '').substring(2),
                                        callback_data: 'mdt&&' + name + '&&' + date + '&&' + schedule[i + 2] + '&&' + id
                                    });
                                if (schedule[i + 3] != undefined)
                                    temp.push({
                                        text: (schedule[i + 3] + '').substring(0, 2) + ':' + (schedule[i + 3] + '').substring(2),
                                        callback_data: 'mdt&&' + name + '&&' + date + '&&' + schedule[i + 3] + '&&' + id
                                    });
                                key.push(temp)
                            }

                            callback(null, key);
                            return
                        }
                    }
                    var key = [];
                    key.push([
                        {text: 'Все занято', callback_data: '-'}]);
                    callback(null, key);
                    return;
                }
            })
        }
        catch (e) {
            console.log(e.toString())
        }
    },
    setAppointment(bot, user, service, date, master, callback) {
        var formData = {
            "salon": salonId,
            // "date": date,//"2018-05-01 13:00:00",
            // "master": master,//139440,
            // "services": [1619506, 1490446],
            "comment": "Заказ был оформлен при помощи чат-бота в telegram,\n" +
            "Для уточнения видов услуг свяжитесь с клиентом по его \nномеру телефона: " + user.phone_number +
            ' \nили напишите ему: tg://user?id=' + user.id,
            "phone": user.phone_number,
            "name": user.first_name
        }

        if (master != undefined && master != '')
            formData.master = master;
        formData.date = helpers.conventDate(date);
        formData.services = [service];
        // console.log(formData)
        var options = {
            method: 'POST',
            url: 'https://api.sonline.su/v1/appointments/',
            headers: headers,
            form: formData
        };

        request(options, function (error, response, data) {
            try {
                // console.log(response.statusCode)
                if (!error && response.statusCode == 200 && data.indexOf('error') == -1) {
                    // console.log(JSON.stringify(data))
                    callback(true, data)
                } else {
                    bot.sendMessage(user.id, frases.error_message, {reply_markup: {inline_keyboard: [[kb.back('Отмена ❌', 'entry')]]}})
                }
            }
            catch (e) {
                console.log(e.toString())
            }
        });
    },
    getPrices(bot, id) {
        var options = {
            method: 'GET',
            url: `https://api.sonline.su/v1/salons/${salonId}/services`,
            headers: headers
        };

        request(options, function (error, response, data) {
            try {
                // console.log(response.statusCode)
                if (!error && response.statusCode == 200) {

                    var data = (JSON.parse(data));
                    var prices = '💈Цены на наши услуги:\n\n';
                    for (var temp2 in data) {
                        for (var temp1 in data[temp2].services) {
                            for (var temp in data[temp2].services[temp1].services) {
                                var service = data[temp2].services[temp1].services[temp];
                                prices += `${service.title}:\nДлительность: ${service.minutes}мин.\nЦена:${service.price}₽\n\n`;
                            }
                        }
                    }
                    bot.sendMessage(id, prices)
                }
            }
            catch (e) {
                console.log(e.toString())
            }
        });
    },
    getServices(bot, id) {
        var options = {
            method: 'GET',
            url: `https://api.sonline.su/v1/salons/${salonId}/services`,
            headers: headers
        };

        request(options, function (error, response, data) {
            try {
                // console.log(response.statusCode)
                if (!error && response.statusCode == 200) {

                    var data = (JSON.parse(data));
                    var prices = [];
                    for (var temp2 in data) {
                        for (var temp1 in data[temp2].services) {
                            for (var temp in data[temp2].services[temp1].services) {
                                var service = data[temp2].services[temp1].services[temp];
                                prices.push([kb.chooseService(service.title, service.id)])
                            }
                        }
                    }

                    bot.sendMessage(id, frases.categories, {
                        reply_markup: {
                            inline_keyboard: prices
                        }
                    })
                }
            }
            catch (e) {
                console.log(e.toString())
            }
        });
    },
    getDates(bot, id, service, master) {
        var today = new Date();
        today = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
        var master_string = (master === undefined || master === '') ? '' : '&master=' + master;
        var options = {
            method: 'GET',
            url: `https://api.sonline.su/v1/getslots/${salonId}/?&services=${service}&date=${today}` + master_string,
            headers: headers
        };

        request(options, function (error, response, data) {
                try {
                    // console.log(response.statusCode)
                    if (!error && response.statusCode == 200) {

                        var data = (JSON.parse(data));
                        // console.log(data)
                        if (!data[0])
                            bot.sendMessage(id, 'Нет информации 🙄', {reply_markup: {inline_keyboard: [[kb.back('Назад 🔙', JSON.stringify({
                                        t:'order',
                                        s:service
                                    }))]]}});
                        else {
                            var schedule_allow_order = data[0].schedule_allow_order;
                            var key = [];
                            var tempkey = [];
                            var date = data[0].date;
                            for (var i = 0; i < schedule_allow_order.length; i = i + 4) {
                                tempkey = [];
                                for (var j = 0; j < 4; j++) {
                                    if ((i + j) < schedule_allow_order.length)
                                        tempkey.push(kb.timeButton(service, date, schedule_allow_order[i + j],master))
                                }
                                key.push(tempkey)
                            }
                            tempkey = [];
                            tempkey.push(kb.back('Назад 🔙', JSON.stringify({t:'order', s:service})));
                            var tomorrow = new Date();
                            tomorrow = tomorrow.getFullYear() + '-' + ('0' + (tomorrow.getMonth() + 1)).slice(-2) + '-' + ('0' + (tomorrow.getDate() + 1)).slice(-2);
                            tempkey.push(kb.toDay('➡️', service, tomorrow,master));
                            key.push(tempkey)
                            bot.sendMessage(id,  'Для выбора другой даты используйте кнопки "⬅️️" и "➡️️️"\n\n'+helpers.formatDate(date) + ' вы можете записаться на:', {reply_markup: {inline_keyboard: key}})
                        }
                    }
                }
                catch (e) {
                    console.log(e.toString())
                }
            }
        );
    },
    getNextDate(bot, id, service, this_date,master) {
        var master_string = (master === undefined || master === '') ? '' : '&master=' + master;
        //var today = this_date.getFullYear() + '-' + ('0' + (this_date.getMonth() + 1)).slice(-2) + '-' + ('0' + this_date.getDate()).slice(-2);
        var today = this_date;
        var options = {
            method: 'GET',
            url: `https://api.sonline.su/v1/getslots/${salonId}/?&services=${service}&date=${today}`+master_string,
            headers: headers
        };
        // console.log(master)
        request(options, function (error, response, data) {
            try {
                // console.log(response.statusCode)
                if (!error && response.statusCode == 200) {

                    var data = (JSON.parse(data));
                    for (var n = 0; n < data.length; n++) {
                        if (data[n].date == this_date) {
                            var schedule_allow_order = data[n].schedule_allow_order;
                            var key = [];
                            var tempkey = [];
                            var date = data[n].date;
                            for (var i = 0; i < schedule_allow_order.length; i = i + 4) {
                                tempkey = [];
                                for (var j = 0; j < 4; j++) {
                                    if ((i + j) < schedule_allow_order.length)
                                        tempkey.push(kb.timeButton(service, date, schedule_allow_order[i + j],master))
                                }
                                key.push(tempkey)
                            }
                            tempkey = [];
                            this_date = new Date(this_date);
                            // console.log(this_date)
                            var next = this_date.getFullYear() + '-' + ('0' + (this_date.getMonth() + 1)).slice(-2) + '-' + ('0' + (this_date.getDate() + 1)).slice(-2);
                            var last = this_date.getFullYear() + '-' + ('0' + (this_date.getMonth() + 1)).slice(-2) + '-' + ('0' + (this_date.getDate() - 1)).slice(-2);
                            var today = new Date();
                            today = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + (today.getDate() - 1)).slice(-2);
                            if ((today) != (last))
                                tempkey.push(kb.toDay('⬅️️', service, last,master));
                            tempkey.push(kb.back('Отмена ❌', 'entry'));
                            tempkey.push(kb.toDay('➡️', service, next,master));
                            key.push(tempkey)
                            bot.sendMessage(id, 'Для выбора другой даты используйте кнопки "⬅️️" и "➡️️️"\n\n'+helpers.formatDate(date) + ' вы можете записаться на:', {reply_markup: {inline_keyboard: key}});
                            return;
                        }
                    }
                    this_date = new Date(this_date);

                    var today = this_date.getFullYear() + '-' + ('0' + (this_date.getMonth() + 1)).slice(-2) + '-' + ('0' + (this_date.getDate() )).slice(-2);
                    var last = this_date.getFullYear() + '-' + ('0' + (this_date.getMonth() + 1)).slice(-2) + '-' + ('0' + (this_date.getDate() - 1)).slice(-2);
                    var next = this_date.getFullYear() + '-' + ('0' + (this_date.getMonth() + 1)).slice(-2) + '-' + ('0' + (this_date.getDate() + 1)).slice(-2);
                    bot.sendMessage(id, today+' все занято или мастер не работает 🤷🏻‍♀️', {reply_markup: {inline_keyboard: [[kb.toDay('⬅️️', service, last,master),kb.back('Назад 🔙', 'entry'),kb.toDay('➡️️️', service, next,master)]]}});
                }
            }
            catch (e) {
                console.log(e.toString())
            }
        });
    },


}

function conventDate(date) {
    var arr = date.split(' ');
    return arr[0] + ' ' + arr[1][0] + arr[1][1] + ':' + arr[1][2] + arr[1][3] + ':00'
}

function debug(obj = {}) {
    return JSON.stringify(obj, null, 4)
}

