
function getEl(el) {
	if (typeof el === 'string' || typeof el === 'number') return el;
	if (WXEnvironment) {
		return el.ref;
	} else {
		return el instanceof HTMLElement ? el : el.$el;
	}
}

function dollFreeFall(ref, complete){
	
	let el = getEl(ref);
	console.log(el)
	console.log(el);
	const bindingX = uni.requireNativePlugin("bindingx");
	let bindingEl = bindingX.bind({
		eventType:'timing',
		exitExpression: 't>800',
		props:[
			{
				element:el,
				property:'transform.translateY',
				expression: 'easeOutBounce(t,0,300,800)',
				// expression: 'cubicBezier(t, 0, 300, 800, 0,1.47,.02,1.33)'
			},
			/* {
				element: el,
				property: 'transform.rotateZ',
				expression: 'easeOutQuint(t,45,0-45,800)'
			} */
		]
	},(result)=>{
		console.log(result);
		if(result.state=='exit'){
			bindingX.unbind({
				token: bindingEl.token,
				eventType: 'timing'
			});
			if(complete){
				complete();
			}
		}
	});
}

export default{
	dollFreeFall
}