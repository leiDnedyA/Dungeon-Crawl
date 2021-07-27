const config = require('../config.json');

const nameCharLimit = config.nameCharLimit;
const maxPerIP = config.maxPlayersPerIP;
const hostIP = config.hostIP;

class JoinFilter {
	constructor(banList, clientList){
		this.banList = banList;
		this.clientList = clientList;

		this.filter = (player)=>{
			
			if(player.ip == hostIP){
				return true;
			}

			if(this.banList.hasOwnProperty(String(player.ip))){
				player.kick(`You're banned for reason: ${this.banList[player.ip]}`);
				return false;
			}
			let ipCount = 0;

			for(let i in this.clientList){
				if(this.clientList[i].ip == player.ip){
					ipCount++;
				}
			}

			if(ipCount > maxPerIP){
				player.kick(`Too many players connected from your IP... (max: ${maxPerIP})`);
				return false;
			}

			return true;
		}

		this.filterName = (player)=>{
			for(let i in clientList){
				if(clientList[i].name == player.name && clientList[i] != player){
					if(player.ip == hostIP){
						for(let j in clientList){
							if(clientList[j].name == player.name && clientList[j].ip != player.ip){
								clientList[j].kick(`Ayden stole the name "${player.name}". Choose a different one`);
							}
						}
						// console.log(`The last sorry mufucka named ${player.name} got the boot lol...`);
					}else{
						player.kick(`the name "${player.name}" is already in use... choose a different one`);
						return false;
					}
				}
			}
			return true;
		}
	}
}

module.exports = JoinFilter;