const request = require('request');
const headers = {
    'X-API-Key': 'boyarin6592kjdfbvr58difuhll3fcbyems'
}
module.exports = {

    getMastersByDateKey(date, callback) {

        var options = {
            url: 'http://api.sonline.su/v1/schedule/6592/?date=' + date,
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
    getMastersKey(callback) {

        var options = {
            url: 'http://api.sonline.su/v1/salons/6592/masters',
            method: 'GET',
            headers: headers
        }
        request(options, function (error, response, data) {
            try {
                if (!error && response.statusCode == 200) {
                    data = JSON.parse(data);
                    var masters_keyboard = [];
                    var item;
                    for (var i = 0; i < data.length; i++) {
                        item = data[i]
                        masters_keyboard.push([{text: item.name, callback_data: 'm&&' + item.name + '&&' + item.id}])
                    }
                    ;
                    masters_keyboard.push([
                        {text: 'Заказ звонка', callback_data: 'request_a_call'},
                        {text: 'Назад', callback_data: 'back_to_write_key'}]);
                    callback(null, masters_keyboard);
                }
            }
            catch (e) {
                console.log(e.toString())
            }
        })
    },
    getDatesByMaster(id, name, callback) {
        var options = {
            url: 'http://api.sonline.su/v1/schedule/6592/?days_amount=14&master=' + id,
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
            url: 'http://api.sonline.su/v1/schedule/6592/?days_amount=14&master=' + id,
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
    setAppointment(user, date, master,callback) {
        const formData = {
            "salon":6592,
            "date":date,//"2018-05-01 13:00:00",
            "master":master,//139440,
            "services": [1619506,1490446],
            "comment":"Заказ был оформлен при помощи чат-бота в telegram,\n" +
            "Для уточнения видов услуг свяжитесь с клиентом по его \nномеру телефона: "+user.phone_number+
            ' \nили напишите ему: tg://user?id='+user.id,
            "phone":user.phone_number,
            "name":user.first_name
        }


        var options ={
            method: 'POST',
            url: 'https://api.sonline.su/v1/appointments/',
            headers: headers,
            form : formData
        };


        request(options, function (error, response, data) {
            try{
                console.log(response.statusCode)
                if (!error && response.statusCode == 200) {
                    console.log(JSON.stringify(data))
                    callback(true)
                }
            }
            catch (e){
                console.log(e.toString())
            }
        });
    }

}

function debug(obj = {}) {
    return JSON.stringify(obj, null, 4)
}

