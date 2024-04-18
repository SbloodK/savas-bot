const { Telegraf, Markup, session } = require('telegraf')
var userParams = []
var nowSelectedBtn = ""
var nowSession = 0

const keyboard = Markup.inlineKeyboard([
	
	
	Markup.button.callback("Hadi Başlayalım", "startFunc"),
]);

const bot = new Telegraf("6890466990:AAHatI1Lqw9iYFlqRrkXrh1-tAeKBbyR3q0")
bot.command('start', (ctx) => {
	ctx.reply('Giriş Yazısı',keyboard)
	userParams = []
	nowSelectedBtn = ""
	nowSession = 0
})
bot.command('cevapla', (ctx) => {
	var a = ctx.update.message.text.split(' ')
	a.splice(0,1)
	var id = a.splice(0,1)
	var plain = ""
	a.forEach(e=>{
    plain += " "+e
	})
	plain.slice(0,1)
	console.log(id,plain)

	ctx.telegram.sendMessage(id[0],plain)

})

function saveData(btnid){
	var askId = ""


	if(nowSession == 0){
		askId = "Soru 1"
	}
	if(nowSession == 1){
		askId = "Soru 2"
	}
	if(nowSession == 2){
		askId = "Soru 3"
	}

	if(btnid == 0){
		userParams.push([askId,"Buton 1"])
	}
	if(btnid == 1){
		userParams.push([askId,"Buton 2"])
	}
	if(btnid == 2){
		userParams.push([askId,"Buton 3"])
	}
	if(btnid == 3){
		userParams.push([askId,"Buton 4"])
	}
	if(btnid == 4){
		userParams.push([askId,"Buton 5"])
	}
	
}
function nextSession(ctx){
	
	if(nowSession == 0){
		nowSession += 1
		ctx.reply("Soru 2",{
			reply_markup:{
				inline_keyboard:[
					[{text:"Buton 1",callback_data:"btn-1"},{text:"Buton 2",callback_data:"btn-2"}],
					[{text:"Buton 3",callback_data:"btn-3"},{text:"Buton 4",callback_data:"btn-4"}],
					[{text:"Buton 5",callback_data:"btn-5"}]
				]
			}
		})
	}
	else if(nowSession == 1){
		nowSession += 1
		ctx.reply("Soru 3",{
			reply_markup:{
				inline_keyboard:[
					[{text:"Buton 1",callback_data:"btn-1"},{text:"Buton 2",callback_data:"btn-2"}],
					[{text:"Buton 3",callback_data:"btn-3"},{text:"Buton 4",callback_data:"btn-4"}],
					[{text:"Buton 5",callback_data:"btn-5"}]
				]
			}
		})
	}
	else if(nowSession == 2){
		const username = ctx.from.username;
		const userId = ctx.from.id;
		userParams.push({
			userid:userId,
			username:username
		})
		
		ctx.sendMessage("Cevaplar \n "+JSON.stringify(userParams),{chat_id:"6342398048"})
		ctx.reply('Web sitemizi ziyaret edin:', Markup.inlineKeyboard([
			Markup.button.url('Web Sitemiz', 'https://www.example.com')
		]));
		nowSession = 0
		userParams = []
	}
}

bot.action("btn-1", ctx => {
	saveData(0)
	nextSession(ctx)
	
	
})
bot.action("btn-2", ctx => {
	
	saveData(1)
	nextSession(ctx)
})
bot.action("btn-3", ctx => {
	saveData(2)
	nextSession(ctx)
})
bot.action("btn-4", ctx => {
	saveData(3)
	nextSession(ctx)
})
bot.action("btn-5", ctx => {
	
	saveData(4)
	nextSession(ctx)
	console.log("One time")
})

bot.action("startFunc", ctx => {
	ctx.reply("Soru 1",{
		reply_markup:{
			inline_keyboard:[
				[{text:"Buton 1",callback_data:"btn-1"},{text:"Buton 2",callback_data:"btn-2"}],
				[{text:"Buton 3",callback_data:"btn-3"},{text:"Buton 4",callback_data:"btn-4"}],
				[{text:"Buton 5",callback_data:"btn-5"}]
			]
		}
	})
});

async function getPP(ctx,id){
	const photos = await ctx.telegram.getUserProfilePhotos(id);
        // İlk fotoğrafın dosya ID'sini al
        const fileId = photos.photos[0][0].file_id;

        // Profil fotoğrafının dosya bilgisini al
        const file = await ctx.telegram.getFile(fileId);
        // Fotoğrafın URL'sini oluştur
        const photoUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
		return photoUrl
}

bot.on('text', async (ctx) => {
	console.log(ctx.message.chat.id)
	if(ctx.message.chat.id === 6342398048) return
	else console.log("NORMALCHAT")
	const username = ctx.from.username;
	const userInput = ctx.message.text;
    const userId = ctx.from.id;
	var a = await getPP(ctx,userId)

	setTimeout(()=>{ctx.telegram.sendMessage("6342398048",`
	YENİ BİR MESAJ VAR!

	Kullanıcı Adı: @${username}
	ID:${userId}
	
	MESAJ İÇERİĞİ:

	${userInput}
	`)},500)
	
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))