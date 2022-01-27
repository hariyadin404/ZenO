// Módulos e constantes essenciais
// [!] Não remova!
const {
	MessageOptions,
	WAFlag,
	WANode,
	WAMetric,
	ChatModification,
	DisconectReason,
	MessageTypeProto,
    WAConnection,
	WALocationMessage,
	ReconnectMode,
	WAContextInfo,
	proto,
	ProxyAgent,
	waChatKey,
	MimetypeMap,
	MediaPathMap,
	WAContactMessage,
	WAContactsArrayMessage,
	WAGroupInviteMessage,
	WATextMessage,
	WAMessageContent, 
	WAMessage, 
	BaileysError, 
	WA_MESSAGE_STATUS_TYPE, 
	MediaConnInfo, 
	URL_REGEX, 
	WAUrlInfo, 
	WA_DEFAULT_EPHEMERAL, 
	WAMediaUpload,
	mentionedJid,
	processTime,
	Browser,
	MessageType,
	Presence,
	WA_MESSAGE_STUB_TYPES,
	Mimetype,
	relayWAMessage,
    GroupSettingChange
} = require('@adiwajshing/baileys')

const { color, bgcolor } = require('./lib/color')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close, donoHub, linkHub, lucasLiomHub } = require('./lib/functions')
const { fetchJson, fetchText } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const fs = require('fs')
const moment = require('moment-timezone')
const { exec } = require('child_process')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')

// * * * Start Zeno Menus * * * \\

const { menu } = require('./zeno/menus/menu') 

// * * * End Zeno Menus * * * \\

// * * * Settings * * * \\

const setting = JSON.parse(fs.readFileSync('./zeno/clients/settings.json'))

zenoSticker = setting.zenoSticker
zenoName = setting.zenoName
prefix = setting.prefix
verification = setting.verification
blocked = []

// * * * Settings * * * \\

function kyun(seconds){
	function pad(s){
	  return (s < 10 ? '0' : '') + s;
	}
	var hours = Math.floor(seconds / (60*60));
	var minutes = Math.floor(seconds % (60*60) / 60);
	var seconds = Math.floor(seconds % 60);
	return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
  }
  
  async function starts() {
	  const bot = new WAConnection()
	  
	  bot.logger.level = 'warn'
	  console.log(banner.string, donoHub.string, lucasLiomHub.string, linkHub.string)
	  console.log(color('NÃO REMOVA OS CRÉDITOS\n\n\n', 'red'))
	  bot.on('qr', () => {
		  console.log(color('[','white'), color('!','red'), color(']','white'), color('Escaneie o código QR...'))
	  })
  
	  fs.existsSync('./Zeno.json') && bot.loadAuthInfo('./Zeno.json') // Verifica que já tem um número conectado
	  bot.on('connecting', () => {
		  start('2', 'Conectando com o Zen/O...') // Aguardando para conectar com o numero
	  })
	  bot.on('open', () => {
		  success('2', 'Zen/O Conectado, estamos pronto para começar!') // Número/Bot conectado e funcionando
	  })
	
	await bot.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./Zeno.json', JSON.stringify(bot.base64EncodedAuthInfo(), null, '\t'))

	bot.on('CB:Blocklist', json => {
            if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	bot.on('chat-update', async (mek) => {
		try {
            if (!mek.hasNewMessage) return
            mek = mek.messages.all()[0]
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('America/Sao_Paulo').format('HH:mm:ss')
            body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)

			mess = { 
				wait: '⌛ Aguarde',
				succefull: '✔️ Pronto',
				erro: {
					errorsticker: '❌ Ocorreu um erro ao criar a figurinha',
				},
				only: {
					stickeronly: '﹝❗﹞Marque uma imagem',
					group: '❌ Este comando só pode ser usado em grupos! ❌',
					ownerGroup: '❌ Este comando só pode ser usado pelo proprietário do grupo! ❌',
					ownerBot: '❌ Este comando só pode ser usado pelo dono do bot! ❌',
					adm: '❌ Este comando só pode ser usado por administradores de grupo! ❌',
					botAdm: '❌ Este comando só pode ser usado quando o bot é um administrador!❌ '
				}
			}

			const botNumber = bot.user.jid
			const ownerNumber = [`${setting.ownerNumber}@s.whatsapp.net`]
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await bot.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
            pushname = bot.contacts[sender] != undefined ? bot.contacts[sender].vname || bot.contacts[sender].notify : undefined
			const isOwner = ownerNumber.includes(sender)
			const freply = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": verification, "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync(`assets/botlogo.webp`)} } }
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				bot.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				bot.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? bot.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : bot.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}
						

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			
			// Comandos que aparecem no terminal
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mCOMANDO\x1b[1;37m]', time, color(command), 'de', color(pushname), color(sender.split('@')[0]),'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mCOMANDO\x1b[1;37m]', time, color(command), 'de', color(pushname), color(sender.split('@')[0]), 'grupo', color(groupName), 'args :', color(args.length))

			// Mensagens que aparecem no terminal
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mMENSAGEM\x1b[1;37m]', time, color('Mensagem'), 'de', color(pushname), color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mMENSAGEM\x1b[1;37m]', time, color('Mensagem'), 'de', color(pushname), color(sender.split('@')[0]), 'grupo', color(groupName), 'args :', color(args.length))
			
            let authorname = bot.contacts[from] != undefined ? bot.contacts[from].vname || bot.contacts[from].notify : undefined	
			if (authorname != undefined) { } else { authorname = groupName }	
			
			function addMetadata(packname, author) {	

				if (!packname) packname = 'Zeno'; // Altere aqui o nome que vai aparecer em baixo de sua sticker
				if (!author) author = 'Bot';	


				author = author.replace(/[^a-zA-Z0-9]/g, '');	
				let name = `${author}_${packname}`
				if (fs.existsSync(`./zeno/zenostick/${name}.exif`)) return `./zeno/zenostick/${name}.exif`
				const json = {	
					"sticker-pack-name": packname,
					"sticker-pack-publisher": author,
				}
				const littleEndian = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])	
				const bytes = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00]	

				let len = JSON.stringify(json).length	
				let last	

				// [!] NÃO APAGUE ESSA LINHA
				if (len > 256) {len = len - 256,bytes.unshift(0x01)} else {bytes.unshift(0x00)}if (len < 16) {last = len.toString(16),last = "0" + len} else {last = len.toString(16)}	

				const buff1 = Buffer.from(last, "hex")	
				const buff2 = Buffer.from(bytes)	
				const buff3 = Buffer.from(JSON.stringify(json))	
				const buffer = Buffer.concat([littleEndian, buff1, buff2, buff3])	

				fs.writeFile(`./zeno/zenostick/${name}.exif`, buffer, (err) => {	
					return `./zeno/zenostick/${name}.exif`	
				})
			}

			switch(command) {

				// * * * Start menus * * * \\

				case 'comandos':
				case 'menu':
					bot.sendMessage(from, menu(prefix), text,{quoted: freply})
				break

				// * * * Fim dos menus * * * \\
				

				// * * * Start commands * * * \\

				case 'stiker':
				case 'sticker':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						reply(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await bot.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.erro.error.sticker)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ${addMetadata('Zeno', authorname)} ${ran} -o ${ran}`, async (error) => {
									if (error) return reply(mess.erro.errorsticker)
									bot.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
									fs.unlinkSync(media)	
									fs.unlinkSync(ran)	
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await bot.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`｢❌｣ Falha ao converter ${type} em sticker`)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ${addMetadata('Zeno', authorname)} ${ran} -o ${ran}`, async (error) => {
									if (error) return reply(mess.erro.errorsticker)
									bot.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
									fs.unlinkSync(media)
									fs.unlinkSync(ran)
								})
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await bot.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						reply(mess.wait)
						keyrmbg = 'Your-ApiKey'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return reply('Falha, ocorreu um erro, tente novamente mais tarde. ')
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								if (err) return reply(mess.erro.errorsticker)
								exec(`webpmux -set exif ${addMetadata('BOT', authorname)} ${ranw} -o ${ranw}`, async (error) => {
									if (error) return reply(mess.erro.errorsticker)
									bot.sendMessage(from, fs.readFileSync(ranw), sticker, {quoted: mek})
									fs.unlinkSync(ranw)
								})
							})
						})
					} else {
						reply(mess.only.stickeronly)
					}
					break

				case 'toimg':
				case 'img':
					if (!isQuotedSticker) return reply('｢❌｣ Utilize somente com figurinhas')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await bot.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply(' ｢❌｣ Erro ao converter imagem')
						buffer = fs.readFileSync(ran)
						bot.sendMessage(from, buffer, image, {quoted: mek, caption: '>//<'})
						fs.unlinkSync(ran)
					})
					break
					

				default:											          	
				if (isGroup && !isCmd && budy != undefined) {}
				else {console.log(color('[ERROR]','red'), 'Comando não registrado de', color(sender.split('@')[0]))}}

		} catch (e) { 
			e = String(e) 
			if (e.includes('this.isZero')){return}
			console.log('Error : %s', color(e, 'red')) 
  }
 })
}

starts() // Inicia o seu projeto/bot ----> Não exclua!!