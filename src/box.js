//jquery methods
jQuery.fn.selectText = function(){
	var doc = document;
	var element = this[0];
	console.log(this, element);
	if (doc.body.createTextRange) {
		var range = document.body.createTextRange();
		range.moveToElementText(element);
		range.select();
	} else if (window.getSelection) {
		var selection = window.getSelection();        
		var range = document.createRange();
		range.selectNodeContents(element);
		selection.removeAllRanges();
		selection.addRange(range);
	}
};
	
function Box(x, y, readFlow, paper, tab)
{
	this.tab = tab;
	this.id = this.tab.boxId;
	this.name = "box" + this.id;

	//clone, append to doc
	this.b = $("#box").clone();
	this.b.attr("id", this.name).appendTo(document.body).addClass("ui-widget-content");

	this.handle = this.b.find(".handle");
	this.text = this.b.find(".text");
	this.runner = this.b.find(".runner");
	this.boxSpinner = this.b.find(".box-spinner");

	//change id of handle and text
	/*$("#" + this.name).children().first().attr("id", "handle" + this.id);
	$("#" + this.name).find("#text").attr("id", "text" + this.id);
	$("#" + this.name).find("#box-spinner").attr("id", "box-spinner" + this.id);
	$("#" + this.name).find("#runner").attr("id", "runner" + this.id);*/

	//set handles text to "box (id)"
	$(this.handle).text("Peel " + this.id);
	$(this.handle).dblclick(function(){
		$(this).focus().selectText();
	});
	
	//css of the box, and box handle
	$(this.b).css({position:"absolute", left: x, top: y})
	$(this.b).css({width: "auto", height: "auto", minWidth: "64px", minHeight: "64px", padding:"0em", cssFloat: "left", margin: "0 0px 0px 0", webkitBorderRadius: "6px",mozBorderRadius: "6px",borderRadius: "6px"});
	//$(this.b).css({cursor: "move", webkitBorderRadius: "6px",mozBorderRadius: "6px", borderRadius: "6px"});
	$(this.handle).css({cursor: "move", webkitBorderRadius: "6px",mozBorderRadius: "6px", borderRadius: "6px"});

	//make box draggable, assign handle to handle
	$(this.b).draggable({
		create: function(){
			this.container = null;
		},
		drag: function(e, ui)
		{
			updateSpinners(readFlow, tab);
			drawPath(tab.boxes, paper, tab);
		},
		start: function(e, ui)
		{
			$(this).css("z-index", 1);
		},
		stop: function(e, ui)
		{
			$(this).css("z-index", 0);
			drawPath(tab.boxes, paper, tab)
		},
		handle: this.handle}).show().addClass("droppable");

	//enable selection on text and add events for special keys
	$(this.text).enableSelection();

	//syntax highlight
	//$(b.child(".text")).children().first().attr("id", "paragraph" + this.id);
	var boxForSH = $(this.b.find(".paragraph"))[0];//document.getElementById("paragraph" + this.id);
	this.cm = CodeMirror.fromTextArea(boxForSH, {
		theme: themeName,
		keyMap: "sublime",
		mode: "javascript",
		lineNumbers: true,
		viewportMargin: Infinity,
	});
	this.resetBoxTheme = function(themeName)
	{
		this.cm.setOption("theme", themeName);
	}
	this.setBoxLang = function(lang)
	{
		this.cm.setOption("mode", lang);
	}
	this.setBoxBind = function(bind)
	{
		this.cm.setOption("keyMap", bind);
	}

	//runner
	$(this.runner).click($.proxy(function()
	{
		var s = this.cm.getValue();
		try
		{
			eval(s);
		}
		catch(err)
		{
			$("#dialog-runner-error").text(err).dialog("open");
		}
	}, this));

	//spinner
	$(this.boxSpinner).spinner({
		min:0,
		max:99,
	}).
	disableSelection().bind("keydown", function(e){e.preventDefault()}).focus(function(){$(this).blur()})
	.attr("style", "text-align: right").width(24).spinner("value", this.tab.boxId);
	$(this.boxSpinner).on("spin", function(e, ui) {
		changeValue(ui.value, this);
		$(this).blur();
	});

	changeValue = function(uiVal, box)
	{
		var spinnerIndex, spinner;
		for(var i = 0; i < tab.boxes.length; i++)
		{
			if($(tab.boxes[i].boxSpinner).is((box)))
			{
				spinner = $(tab.boxes[i].boxSpinner);
				spinnerIndex = spinner.spinner("value");
			}
		}

		var change = 0;
		if(uiVal < spinnerIndex)
		{
			change = -1;
		}
		else if(uiVal > spinnerIndex)
		{
			change = 1;
		}
		for(var i = 0; i < tab.boxes.length; i++)
		{
			var s = $(tab.boxes[i].boxSpinner).spinner();
			if(s.spinner("value") == uiVal)
			{
				if(!s.is(spinner))
				{
					var v = s.spinner("value");
					var v0 = spinner.spinner("value");
					s.spinner("value", v - change);
					spinner.spinner("value", v0 + change);
				}
			}
		}
		updateSpinners(readFlow, tab);
		drawPath(tab.boxes, paper, tab)
	}

	//this.tab.add(this);

	updateSpinners = function(readFlow, tab)
	{
		switch(readFlow.str) {
		case "tb":
			//sort
			for(var i = 1; i < tab.boxes.length; i++)
			{
				var j = i;
				while(j > 0 && $(tab.boxes[j - 1].b).offset().top > $(tab.boxes[j].b).offset().top)
				{
					var temp = tab.boxes[j];
					tab.boxes[j] = tab.boxes[j - 1];
					tab.boxes[j - 1] = temp;
					j--;
				}
			}
			break;
		case "rl":
			//sort
			for(var i = 1; i < tab.boxes.length; i++)
			{
				var j = i;
				while(j > 0 && $(tab.boxes[j - 1].b).offset().left > $(tab.boxes[j].b).offset().left)
				{
					var temp = tab.boxes[j];
					tab.boxes[j] = tab.boxes[j - 1];
					tab.boxes[j - 1] = temp;
					j--;
				}
			}
			break;
		case "custom":
			//sort
			for(var i = 1; i < tab.boxes.length; i++)
			{
				var j = i;
				while(j > 0 && $(tab.boxes[j-1].boxSpinner).spinner("value") > $(tab.boxes[j].boxSpinner).spinner("value"))
				{
					var temp = tab.boxes[j];
					tab.boxes[j] = tab.boxes[j - 1];
					tab.boxes[j - 1] = temp;
					j--;
				}
			}
			break;
		}

		for(i = 0; i < tab.boxes.length; i++)
		{
			$(tab.boxes[i].boxSpinner).spinner("option", "max", tab.boxes.length - 1);
			$(tab.boxes[i].boxSpinner).spinner("value", i);

			var red = 247;
			var green = 80;
			var blue = 0;
			if(tab.boxes.length > 0)
			{
				//green = Math.floor((i / tab.boxId) * 255);
				red += (Math.floor((((i / tab.boxId) * (255))) * .4));
				green += (Math.floor((((i / tab.boxId) * (255))) * .4));
				blue += (Math.floor((((i / tab.boxId) * (255))) * .4));
			}
			//var col = "rgba(247," + green + ",0,1)";

			var col = "rgba(" + red + "," + green + "," + blue + ",1)";
			//$("#handle" + tab.boxes[i].id).css({backgroundColor: col});
			$(tab.boxes[i].handle).animate({backgroundColor: col}, 50);
		}
	}
	if(!($("#read-flow :radio:checked + label").text().valueOf() == "Custom"))
	{
		$(this.boxSpinner).spinner("disable");
	}

	updateSpinners(readFlow, this.tab);

	this.tab.add(this);
}

function enableSpinners(tab)
{
	for(i = 0; i < tab.boxes.length; i++)
	{
		$(tab.boxes[i].boxSpinner).spinner("enable");
	}
}

function disableSpinners(tab)
{
	for(i = 0; i < tab.boxes.length; i++)
	{
		$(tab.boxes[i].boxSpinner).spinner("disable");
	}
}