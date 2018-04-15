module.exports = {
    chooseDate(service) {
        return {
            text: '📅 Выбор даты',
            callback_data: JSON.stringify({
                t: 'date',
                s: service
            })
        }
    },
    chooseMaster(service) {
        return {
            text: '✂️ Выбор мастера',
            callback_data: JSON.stringify({
                t: 'mast',
                s: service
            })
        }
    },
    back(text, point) {
        return {
            text: text,
            callback_data: point
        }
    },
    chooseService(title, id) {
        return {
            text: title,
            callback_data: JSON.stringify({
                t: 'order',
                s: id
            })
        }
    },
    timeButton(serv, date, time, master) {
        // console.log(master)
        master = (master === undefined || master === '') ? '' : master;
        var out = {
            text: time[0] + time[1] + ":" + time[2] + time[3],
            callback_data: JSON.stringify({
                t: 'ask',
                s: serv,
                d: date + ' ' + time,
                m: master
            })
        }
        if (master !== '') {
            out.callback_data.m = master
        }
        return out
    },
    toDay(text, serv, date,master) {
        master = (master === undefined || master === '') ? '' : master;
        var out = {
            text: text,
            callback_data: JSON.stringify({
                t: 'nextDay',
                s: serv,
                d: date,
                m:master
            })
        }
        // if (master !== '') {
        //     out.callback_data.m = master
        // }
        // console.log(out)
        return out
    },
    submit(query) {
        return {
            text: 'Подтвердить ✅',
            callback_data: JSON.stringify({
                t: 'rec',
                s: query.s,
                d: query.d,
                m: query.m
            })
        }
    }

}