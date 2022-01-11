function updateElVars(){
	document.querySelectorAll("[id]").forEach(function(el){
		window[el.id]=el;
	});
}
function createEditOption(type){
	var eo=document.createElement("div");
	eo.className="editOption";
	var icon=document.createElement("span");
	icon.className="material-icons";
	icon.innerHTML="&#xe3c9;";
	icon.setAttribute("data-click-fn","edit"+type);
	eo.appendChild(icon);
	return eo;
}
function createAddItem(type){
	var eo=document.createElement("div");
	eo.className="addItem";
	var icon=document.createElement("span");
	icon.className="material-icons";
	icon.innerHTML="&#xe145;";
	icon.setAttribute("data-click-fn",type+"PlusBottom");
	eo.appendChild(icon);
	return eo;
}
function deselect(){
	var e=document.body.querySelector(".selected");
	if(e){
		e.classList.remove("selected");
		editBox.setAttribute("data-editing","ex");
		activateExEditBox();
	}
}
function select(e){
	deselect();
	e.classList.add("selected");
}
function getNewSe(){
	var s=document.createElement("div");
	s.className="section";
	var sh=document.createElement("div");
	sh.className="sHeader";
	var eo=createEditOption("Se");
	sh.appendChild(eo);
	sh.appendChild(document.createElement("h1"));
	s.appendChild(sh);
	s.appendChild(createAddItem("el"));
	return s;
}
function getNewEl(){
	var part=document.createElement("div");
	part.className="mysteryEl";
	part.setAttribute("data-el-type","text");
	var eo=createEditOption("El");
	part.appendChild(eo);
	var content=document.createElement("div");
	content.className="elContent";
	part.appendChild(content);
	return part;
}
function onEdit(e,f){
	e.onkeydown=e.onkeyup=e.onchange=f;
}
function activateExEditBox(){
	mysteryTitleInput.value=mysteryTitle.textContent;
	endMessageInput.value=endMessage.textContent;
	onEdit(mysteryTitleInput,function(){
		mysteryTitle.textContent=mysteryTitleInput.value;
	});
	onEdit(endMessageInput,function(){
		endMessage.textContent=endMessageInput.value;
	});
	mysteryUpload.onchange=function(){
		if(mysteryUpload.files.length!==0){
			var file=mysteryUpload.files[0];
			var fr=new FileReader();
			fr.onload=function(){
				var mystery=JSON.parse(fr.result);
				mysteryTitle.textContent=mysteryTitleInput.value=mystery.title;
				endMessage.textContent=endMessageInput.value=mystery.end;
				document.querySelectorAll(".section").forEach(function(section){
					section.remove();
				});
				mystery.content.forEach(function(section){
					var s=getNewSe();
					s.firstElementChild.lastElementChild.textContent=section.header;
					section.elements.forEach(function(element){
						var e=getNewEl();
						e.setAttribute("data-el-type",["text","question","image"][element.type]);
						var content=e.childNodes[1];
						if(element.type===0){
							content.textContent=element.text;
						}else if(element.type===1){
							content.innerHTML='<p></p><input readonly="readonly" data-answer=""/>';
							content.firstElementChild.textContent=element.question;
							content.lastElementChild.setAttribute("data-answer",element.answer);
						}else if(element.type===2){
							content.innerHTML='<img/><p class="caption"></p>';
							content.firstElementChild.src=element.uri;
							content.lastElementChild.textContent=element.caption;
						}
						s.insertBefore(e,s.lastElementChild);
					});
					mysteryView.insertBefore(s,mysteryView.lastElementChild.previousElementSibling);
				});
			};
			fr.readAsText(file);
		}
	};
}
function activateSeEditBox(){
	var selected=document.querySelector(".selected");
	editBox.outerHTML=editBox.outerHTML;
	updateElVars();
	seTitle.value=selected.querySelector(".sHeader h1").textContent;
	onEdit(seTitle,function(){
		selected.querySelector(".sHeader h1").textContent=seTitle.value;
	});
}
function updateEditFromEl(){
	var selected=document.querySelector(".selected");
	var type=selected.getAttribute("data-el-type");
	var content=selected.childNodes[1];
	if(type==="text"){
		elText.value=content.textContent;
	}else if(type==="question"){
		questionText.value=content.firstElementChild.textContent;
		questionAns.value=content.lastElementChild.getAttribute("data-answer");
	}else if(type==="image"){
		imageCaption.value=content.lastElementChild.textContent;
	}
}
function activateElEditBox(){
	var selected=document.querySelector(".selected");
	var content=selected.childNodes[1];
	editBox.outerHTML=editBox.outerHTML;
	updateElVars();
	var type=selected.getAttribute("data-el-type");
	elEditBox.setAttribute("data-edit-type",type);
	editTypeSelect.querySelector('option[selected="selected"]').removeAttribute("selected");
	editTypeSelect.querySelector('option[value="'+type+'"]').setAttribute("selected","selected");
	updateEditFromEl();
	editTypeSelect.onchange=function(){
		var type=editTypeSelect.value;
		selected.setAttribute("data-el-type",type);
		elEditBox.setAttribute("data-edit-type",type);
		if(type==="text")content.innerHTML=elText.value;
		else if(type==="question"){
			content.innerHTML='<p></p><input readonly="readonly" data-answer=""/>';
			content.childNodes[0].textContent=questionText.value;
			content.childNodes[1].setAttribute("data-answer",questionAns.value);
		}else if(type==="image"){
			content.innerHTML='<img/><p class="caption"></p>';
		}
	};
	onEdit(elText,function(){
		selected.childNodes[1].textContent=elText.value;
	});
	onEdit(questionText,function(){
		content.childNodes[0].textContent=questionText.value;
	});
	onEdit(questionAns,function(){
		content.childNodes[1].setAttribute("data-answer",questionAns.value);
	});
	onEdit(imageCaption,function(){
		content.childNodes[1].textContent=imageCaption.value;
	});
	imageFile.onchange=function(){
		if(imageFile.files.length!==0){
			var file=imageFile.files[0];
			var fr=new FileReader();
			fr.onload=function(){
				if(fr.result.slice(0,11)==="data:image/")content.childNodes[0].src=fr.result;
			};
			fr.readAsDataURL(file);
		}
	};
}
var clickFn={
	"promptUploadMystery":function(){
		mysteryUpload.click();
	},
	"downloadMystery":function(){
		var mystery={
			"title":mysteryTitle.textContent,
			"content":[],
			"end":endMessage.textContent
		};
		var sections=document.querySelectorAll(".section");
		sections.forEach(function(section){
			var s={
				"header":section.querySelector(".sHeader h1").textContent,
				"elements":[]
			};
			var elements=section.querySelectorAll(".mysteryEl");
			elements.forEach(function(element){
				var e={
					"type":{"text":0,"question":1,"image":2}[element.getAttribute("data-el-type")]
				};
				var content=element.childNodes[1];
				if(e.type===0)e.text=content.textContent;
				else if(e.type===1){
					e.question=content.firstElementChild.textContent;
					e.answer=content.lastElementChild.getAttribute("data-answer");
				}else if(e.type===2){
					e.uri=content.firstElementChild.src;
					e.caption=content.lastElementChild.textContent;
				}
				s.elements.push(e);
			});
			mystery.content.push(s);
		});
		var dl=document.createElement("a");
		dl.href="data:text/plain;base64,"+btoa(JSON.stringify(mystery));
		dl.download=((mystery.title.replace(/[^a-zA-Z ]/mg,"").split(" ").join("-"))||"Untitled-Mystery")+".escr";
		dl.style.display="none";
		document.body.appendChild(dl);
		dl.click();
		dl.remove();
	},
	"editSe":function(e){
		select(e.parentElement.parentElement.parentElement);
		editBox.setAttribute("data-editing","se");
		activateSeEditBox();
	},
	"editEl":function(e){
		select(e.parentElement.parentElement);
		editBox.setAttribute("data-editing","el");
		activateElEditBox();
	},
	"sePlusBottom":function(e){
		var s=getNewSe();
		e.parentElement.parentElement.insertBefore(s,e.parentElement);
		clickFn.editSe(s.querySelector(".sHeader .material-icons"));
	},
	"elPlusBottom":function(e){
		var s=e.parentElement.parentElement;
		var part=getNewEl();
		s.insertBefore(part,e.parentElement);
		clickFn.editEl(part.childNodes[0].childNodes[0]);
	},
	"insertSeAbove":function(e){
		var selected=document.querySelector(".selected");
		selected.parentElement.insertBefore(getNewSe(),selected);
	},
	"insertSeBelow":function(e){
		var selected=document.querySelector(".selected");
		selected.parentElement.insertBefore(getNewSe(),selected.nextElementSibling);
	},
	"insertElAbove":function(e){
		var selected=document.querySelector(".selected");
		selected.parentElement.insertBefore(getNewEl(),selected);
	},
	"insertElBelow":function(e){
		var selected=document.querySelector(".selected");
		selected.parentElement.insertBefore(getNewEl(),selected.nextElementSibling);
	},
	"moveSeUp":function(){
		var selected=document.querySelector(".selected");
		if(selected.previousElementSibling.className.indexOf("section")!==-1){
			selected.parentNode.insertBefore(selected,selected.previousElementSibling);
		}else{
			selected.parentNode.insertBefore(selected,selected.parentNode.lastElementChild);
		}
		activateSeEditBox();
	},
	"moveSeDown":function(){
		var selected=document.querySelector(".selected");
		if(selected.nextElementSibling.nextElementSibling){
			selected.parentNode.insertBefore(selected,selected.nextElementSibling.nextElementSibling);
		}else{
			selected.parentNode.insertBefore(selected,selected.parentNode.firstElementChild.nextElementSibling);
		}
		activateSeEditBox();
	},
	"moveElUp":function(){
		var selected=document.querySelector(".selected");
		if(selected.previousElementSibling.className.indexOf("mysteryEl")!==-1){
			selected.parentNode.insertBefore(selected,selected.previousElementSibling);
		}else{
			selected.parentNode.insertBefore(selected,selected.parentNode.lastElementChild);
		}
		activateElEditBox();
	},
	"moveElDown":function(){
		var selected=document.querySelector(".selected");
		if(selected.nextElementSibling.nextElementSibling){
			selected.parentNode.insertBefore(selected,selected.nextElementSibling.nextElementSibling);
		}else{
			selected.parentNode.insertBefore(selected,selected.parentNode.firstElementChild.nextElementSibling.nextElementSibling);
		}
		activateElEditBox();
	},
	"deleteSe":function(){
		var selected=document.querySelector(".selected");
		selected.remove();
		editBox.setAttribute("data-editing","ex");
		editBox.outerHTML=editBox.outerHTML;
		updateElVars();
	},
	"deleteEl":function(){
		var selected=document.querySelector(".selected");
		clickFn.editSe(selected.parentElement.querySelector(".sHeader .material-icons"));
		selected.remove();
	},
	"promptImageUpload":function(){
		imageFile.click();
	},
	"deselect":function(){
		deselect();
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
	activateExEditBox();
});