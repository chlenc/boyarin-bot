const kb = require('./keyboard-buttons')
module.exports = {
    order(service) {
        return {
            reply_markup: {
                inline_keyboard: [
                    [kb.chooseDate(service)],
                    [kb.chooseMaster(service)]
                ]
            }
        }
    },
    submit(query){
        return{
            reply_markup:{
                inline_keyboard:[[kb.submit(query)],[kb.back('Отмена ❌', 'entry')]]
            }
        }
    }
}