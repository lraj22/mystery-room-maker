function updateElVars(){
	document.querySelectorAll("#elEditBox,#elEditBox [id]").forEach(function(el){
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
function deselect(){
	var e=document.body.querySelector(".selected");
	if(e)e.classList.remove("selected");
}
function select(e){
	e.classList.add("selected");
}
function activateElEditBox(){
	var selected=document.querySelector(".selected");
	elEditBox.outerHTML=elEditBox.outerHTML;
	updateElVars();
	var type=selected.getAttribute("data-el-type");
	if(type==="text")elText.value=selected.childNodes[1].textContent;
	editTypeSelect.onchange=function(){
		elEditBox.setAttribute("data-edit-type",editTypeSelect.value);
	};
	elText.onkeydown=elText.onkeyup=elText.onchange=function(){
		document.querySelector(".selected").childNodes[1].textContent=elText.value;
	};
	deleteEl.onclick=function(){
		clickFn.editSe(selected.parentElement);
		selected.remove();
	};
}
var clickFn={
	"editSe":function(e){
		deselect();
		select(e.parentNode.parentNode.parentNode);
	},
	"editEl":function(e){
		deselect();
		var el=e.parentNode.parentNode;
		var type=el.getAttribute("data-el-type");
		select(el);
		activateElEditBox();
		elEditBox.setAttribute("data-edit-type",type);
		document.querySelector('#editTypeSelect option[selected="selected"]').removeAttribute("selected");
		document.querySelector('#editTypeSelect option[value="'+type+'"]').setAttribute("selected","selected");
	},
	"elPlusBottom":function(e){
		var s=e.parentNode.parentNode;
		var part=document.createElement("div");
		part.className="mysteryEl";
		part.setAttribute("data-el-type","text");
		var eo=createEditOption("El");
		part.appendChild(eo);
		var content=document.createElement("div");
		content.className="elContent";
		part.appendChild(content);
		s.insertBefore(part,e.parentNode);
		clickFn.editEl(eo.childNodes[0]);
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
});