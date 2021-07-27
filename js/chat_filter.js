const bannedWordsList = require('../banned_words.json')
const replaceWordsList = require('../replace_words.json')
const config = require('../config.json');

const charLimit = parseInt(config.chatCharLimit); //maximum amt of characters
const minWait = parseInt(config.chatMinWait); //minimum time between messages in milliseconds
const maxSpamAttempts = parseInt(config.maxSpamAttempts); //maximum amt of times you can try sending a message within min wait period

//vv This thing is a fucking beast vvvvvvvvvvvvvvv
const nwordRegex = /(n|i){1,32}.{0,20}((g{2,32}|q){1,32}|[gq]{2,32})[ae3r]{1,32}/ig;

const getReplaceWord = ()=>{
	let pos = Math.floor(Math.random() * replaceWordsList.length)
	return replaceWordsList[pos];
}

class ChatFilter {
	constructor(){

		this.filter = (player, message)=>{
			let newMessage = message;
			let sentTime = new Date().getTime();
			if(sentTime - player.lastMessage.time <= minWait){
				player.spamAttempts ++;
				if(player.spamAttempts >= maxSpamAttempts){
					player.kick("spam (sending messages to fast)")
				}
				return false;
			}else{
				player.spamAttempts = 0;
			}


			if(message.length > charLimit){
				return false;
			}
			if(nwordRegex.test(newMessage)){
				newMessage = newMessage.replace(nwordRegex, getReplaceWord());
			}
			for(let i in bannedWordsList){
				let reg = new RegExp(bannedWordsList[i], 'g');
				if(reg.test(newMessage)){
					newMessage = newMessage.replace(reg, getReplaceWord());
				}
			}

			player.setLastMessage(message, sentTime);

			return newMessage;

		}
	
	}
}

module.exports = ChatFilter;