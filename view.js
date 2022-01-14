function updateElVars(){
	document.querySelectorAll("[id]").forEach(function(el){
		window[el.id]=el;
	});
}
function getNewSe(){
	var s=document.createElement("div");
	s.className="section";
	var sh=document.createElement("div");
	sh.className="sHeader";
	sh.appendChild(document.createElement("h1"));
	s.appendChild(sh);
	return s;
}
function getNewEl(){
	var part=document.createElement("div");
	part.className="mysteryEl";
	part.setAttribute("data-el-type","text");
	var content=document.createElement("div");
	content.className="elContent";
	part.appendChild(content);
	return part;
}
function nextToView(ntv){
	var viewingNow=document.querySelector(".viewingNow");
	if(viewingNow&&(ntv==="next")){
		var allFinished=true;
		var questions=viewingNow.querySelectorAll("input[data-answer");
		if(questions)questions.forEach(function(q){
			if(q.value!==q.getAttribute("data-answer"))allFinished=false;
		});
		if(!allFinished)return;
	}
	window.scrollTo(0,0);
	if(viewingNow){
		viewingNow.classList.remove("viewingNow");
		viewingNow[ntv+"ElementSibling"].classList.add("viewingNow");
	}else{
		mysteryView.querySelector("div").classList.add("viewingNow");
	}
	mysteryView.className="";
	if(mysteryState.pos===mysteryState.total)return;
	if(mysteryState.pos!==0){
		mysteryView.classList.add("allowBack");
	}
	if(mysteryState.pos<(mysteryState.total-1)){
		mysteryView.classList.add("allowForward");
	}
	if(mysteryState.pos===(mysteryState.total-1)){
		mysteryView.classList.add("allowFinish");
	}
}
var mysteryState={
	"pos":-1,
	"total":0
};
function waitForUpload(){
	mysteryUpload.onchange=function(){
		if(mysteryUpload.files.length!==0){
			var file=mysteryUpload.files[0];
			var fr=new FileReader();
			fr.onload=function(){
				var mystery=JSON.parse(fr.result);
				mysteryTitle.textContent=mystery.title;
				endMessage.textContent=mystery.end;
				mystery.content.forEach(function(section){
					var s=getNewSe();
					s.firstElementChild.firstElementChild.textContent=section.header;
					section.elements.forEach(function(element){
						var e=getNewEl();
						e.setAttribute("data-el-type",["text","question","image"][element.type]);
						var content=e.firstElementChild;
						if(element.type===0){
							content.textContent=element.text;
						}else if(element.type===1){
							content.innerHTML='<p></p><input data-answer=""/>';
							content.firstElementChild.textContent=element.question;
							content.lastElementChild.setAttribute("data-answer",element.answer);
						}else if(element.type===2){
							content.innerHTML='<img/><p class="caption"></p>';
							content.firstElementChild.src=element.uri;
							content.lastElementChild.textContent=element.caption;
						}
						s.appendChild(e);
					});
					mysteryView.insertBefore(s,mysteryCompleted);
				});
				mysteryState.total=mystery.content.length;
				clickFn.mysteryForward();
				document.body.className="mysteryMode";
			};
			fr.readAsText(file);
		}
	};
}
var clickFn={
	"promptUpload":function(e){
		e.nextElementSibling.click();
	},
	"mysteryBack":function(){
		if(mysteryState.pos<1)return;
		mysteryState.pos--;
		nextToView("previous");
	},
	"mysteryForward":function(){
		if(mysteryState.pos>=mysteryState.total)return;
		mysteryState.pos++;
		nextToView("next");
	},
	"mysteryFinish":function(){
		clickFn.mysteryForward();
	}
};
window.addEventListener("load",function(){
	updateElVars();
	window.addEventListener("click",function(e){
		var fn=e.target.getAttribute("data-click-fn");
		if(typeof fn==="string"){
			(clickFn[fn]||function(){})(e.target);
		}
	});
	waitForUpload();
});