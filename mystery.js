function updateElVars(){
	document.querySelectorAll("#editBox,#editBox [id]").forEach(function(el){
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
	if(e)e.classList.remove("selected");
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
function activateSeEditBox(){
	var selected=document.querySelector(".selected");
	editBox.outerHTML=editBox.outerHTML;
	updateElVars();
	seTitle.value=selected.querySelector(".sHeader h1").textContent;
	seTitle.onkeydown=seTitle.onkeyup=seTitle.onchange=function(){
		selected.querySelector(".sHeader h1").textContent=seTitle.value;
	};
	deleteSe.onclick=function(){
		selected.remove();
		editBox.setAttribute("data-editing","none");
		editBox.outerHTML=editBox.outerHTML;
		updateElVars();
	};
}
function activateElEditBox(){
	var selected=document.querySelector(".selected");
	editBox.outerHTML=editBox.outerHTML;
	updateElVars();
	var type=selected.getAttribute("data-el-type");
	elEditBox.setAttribute("data-edit-type",type);
	editTypeSelect.querySelector('option[selected="selected"]').removeAttribute("selected");
	editTypeSelect.querySelector('option[value="'+type+'"]').setAttribute("selected","selected");
	if(type==="text")elText.value=selected.childNodes[1].textContent;
	editTypeSelect.onchange=function(){
		selected.setAttribute("data-el-type",editTypeSelect.value);
		elEditBox.setAttribute("data-edit-type",editTypeSelect.value);
	};
	elText.onkeydown=elText.onkeyup=elText.onchange=function(){
		document.querySelector(".selected").childNodes[1].textContent=elText.value;
	};
	deleteEl.onclick=function(){
		clickFn.editSe(selected.parentElement.querySelector(".sHeader .material-icons"));
		selected.remove();
	};
}
var clickFn={
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
	clickFn.editSe(document.querySelector(".sHeader .material-icons"));
});