import $mRouter from './router';
import $mStore from '@/store';
import $mPagesConfig from '../config/pagesConfig';

function urlJump(destination){
	if(!destination || !destination.jumpType){
		return
	}
	if(destination.needAuth && destination.needAuth == true){
		if(!$mStore.getters.hasLogin){
			$mRouter.push({
				route:$mPagesConfig.login
			});
			return;
		}
	}
	let jumpType = destination.jumpType;
	switch(jumpType){
		case 'innerPage':
			$mRouter.push({
				route:{
					path:destination.jumpLink
				},
				query:destination.params
			})
		break;
		case 'innerWebview':
		break;
	}
}

async function initWwjApp(){
	await uni.$api.http.get(uni.$api.apiConfig.serverConf).then(res=>{
		uni.$api.store.commit('setServerConf',res);
	})
	uni.$api.socket.initSocket();
}

function enterGameByMachineId(id){
	let data = {machineId: id}
	uni.$api.store.commit('setLastEnterMachine',data);//为了兼容nvue与nvue之间传递的数据
	uni.$api.router.push({
		route:uni.$api.pagesConfig.game,
		query:{
			machine:encodeURIComponent(JSON.stringify(data))
		}
	});
}

export default{
	urlJump,
	initWwjApp
}