// const helpers = require('./helpers');

module.exports = {

    goodDate(num){
        var date = new Date();
        if(num == undefined)
            num = 0;
        var tempDate = new Date;
        var date = new Date(tempDate.getFullYear(), tempDate.getMonth(),(tempDate.getDate()+num));
        // console.log(date)
        return ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
    },

    getWeekDay(num){
        var date = new Date();
        if(num == undefined)
            num = 0;
        return ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][(new Date(date.getFullYear(), date.getMonth(), (date.getDate()+num))).getDay()];
    },

    unique(arr) {
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        var str = arr[i];
        if(arr[i] !='')
            obj[str] = true;
    }
    return Object.keys(obj);
},
    getSheduleByWeekDays(weekdays,name){
        // weekdays = [ 'Ср', 'Сб' ];
        var date =  new Date();
        var arr = [];
        for(var i = 0; i < 29; i++){
            if(weekdays.indexOf(helpgetWeekDay(i)) != -1)
                arr.push([ {
                    text: helpgoodDate(i),
                    callback_data: 'name_date&&'+name+'&&'+helpgoodDate(i)
                }])
        }
        return arr;
    },

    getReservedTimeKey(reserved,date,name){
        var keyboard = [];
        var t1,t2,c1,c2;
        for(var i = 9; i <= 19; i++){
            t1 = i+':00';
            t2 = i+':30';
            c1 = 'time_name&&'+date+'&&'+name+'&&'+t1;
            c2 = 'time_name&&'+date+'&&'+name+'&&'+t2;
            if(reserved.indexOf(t1) != (-1)){
                t1 = 'Занято';
                c1 = '-'
            }
            if(reserved.indexOf(t2) != (-1)){
                t2 = 'Занято';
                c2 = '-'
            }
            keyboard[i-9] = [{
                text: t1,
                callback_data: c1
            },{
                text: t2,
                callback_data: c2
            }]
        }
        return keyboard;
    }


}

function helpgetWeekDay(num){
    var date = new Date();
    if(num == undefined)
        num = 0;
    return ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][(new Date(date.getFullYear(), date.getMonth(), (date.getDate()+num))).getDay()];
}

function helpgoodDate(num){
    if(num == undefined)
        num = 0;
    var tempDate = new Date;
    var date = new Date(tempDate.getFullYear(), tempDate.getMonth(),(tempDate.getDate()+num));

    return ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
}