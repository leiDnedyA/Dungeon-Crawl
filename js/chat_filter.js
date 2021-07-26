const bannedWordsList = require('../banned_words.json')
const replaceWordsList = require('../replace_words.json')

const charLimit = 250;

//vv This thing is a fucking beast vv
const nwordRegex = /(n|i){1,32}.{0,20}((g{2,32}|q){1,32}|[gq]{2,32})[ae3r]{1,32}/ig;

const getReplaceWord = ()=>{
	let pos = Math.floor(Math.random() * replaceWordsList.length)
	return replaceWordsList[pos];
}

class ChatFilter {
	constructor(){

		this.filter = (player, message)=>{
			let newMessage = message;
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
			return newMessage;

		}
	
	}
}

module.exports = ChatFilter;