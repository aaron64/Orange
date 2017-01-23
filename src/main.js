$(function() {
	
	$("body").css("display", "none");
	$("body").fadeIn(1000);

	//tabs
	var tabs = new Array();
	var currentTab;
	tabs.push(new Tab(0));

	currentTab = tabs[0];

	//theme
	themeName = "orange";
	setTheme(themeName);

	//raphael
	var paper = Raphael(0,0,$(window).width(),$(window).height());

	//buttons
	$("#tabs").buttonset();
	var tx = $("#tabs").offset().left;
	var ty = $("#tabs").offset().top + 12;
	$("#tabs").offset({left: tx, top: ty}).disableSelection();

	$("#add-tab").button().
	click(function(e){
		$("#tabs").buttonset("destroy");
		var t = $("<input type='radio' id='tab-" + (tabs.length) + "' class='tab' name='tab-name' value='" + (tabs.length) + "'/><label for='tab-" + (tabs.length) + "'>Tab " + (tabs.length) + "</label>");
		$("#tabs").append(t);
		$("#tabs").buttonset();
		var tab = new Tab(tabs.length);
		tabs.push(tab);
		switchTabs(tab.id, tabs.length -1);

		$("#tab-" + (tabs.length - 1)).attr("checked",true).button("refresh");
	});
	$(".tab").dblclick(function(){
		$(this).focus().selectText();
	});
	var atx = $("#add-tab").offset().left;
	var aty = $("#add-tab").offset().top + 10;
	$("#add-tab").offset({left: atx, top: aty}).disableSelection();

	//individual tab handeling
	$(document).delegate(".tab","click",function(e)
	{
		var id = this.id.substring(4);
		for(var i = 0; i < tabs.length; i++)
		{
			if(tabs[i].id == id)
			{
				switchTabs(i, id);
			}
		}
	});
	function switchTabs(i, id)
	{
		if(currentTab.id != id)
		{
			currentTab.hide();
			currentTab = tabs[i];
			currentTab.show();
			$(".file-name-input").val(currentTab.fileName).focus().blur();
		}
	}
	$(".tab").dblclick(function(e)
	{
		alert("dblclicki")
	});

	//menus
		//create
	$("#menu").menu().hide();
	$("#menu-new-box").mousedown(function(e)
	{
		if(e.which == 1)
		{
			new Box(e.pageX, e.pageY, readFlow, paper, currentTab);
			updateSpinners(readFlow, currentTab);
			if(currentTab.boxes.length > 1)
			{
				addPath(paper, currentTab);
				drawPath(currentTab.boxes, paper, currentTab);
			}
		}
	});
	$("#menu-new-container").mousedown(function(e)
	{
		if(e.which == 1)
		{
			Container(e.pageX, e.pageY, readFlow, currentTab);
		}
	});

		//path toggle
	$("#menu-path-toggle").mousedown(function(e){
		if(e.which == 1)
		{
			$(".path").toggle(function(){
				if($("#menu-path-toggle a").text() == "Hide Paths")
					$("#menu-path-toggle a").text('Show Paths');
				else
					$("#menu-path-toggle a").text('Hide Paths');
			});
		}
	});

		//readflow
	var readFlow = {str: "tb"};
	$("#menu-read-flow-tb").addClass("ui-state-highlight");
	$("#menu-read-flow-tb").mousedown(function(e)
	{
		if(e.which == 1)
		{
			readFlow.str = "tb";
			if(currentTab.boxes.length > 0)
			{	
				disableSpinners(currentTab);
				updateSpinners(readFlow, currentTab);
				drawPath(currentTab.boxes, paper, currentTab);
			}

			$("#read-flow li").removeClass("ui-state-highlight");
			$(this).addClass("ui-state-highlight");
			$("#read-flow-title").blur();
		}
	});
	$("#menu-read-flow-lr").mousedown(function(e)
	{
		if(e.which == 1)
		{
			readFlow.str = "rl";
			if(currentTab.boxes.length > 0)
			{	
				disableSpinners(currentTab);
				updateSpinners(readFlow, currentTab);
				drawPath(currentTab.boxes, paper, currentTab);
			}

			$("#read-flow li").removeClass("ui-state-highlight");
			$(this).addClass("ui-state-highlight");
			$("#read-flow-title").blur();
		}
	});
	$("#menu-read-flow-custom").mousedown(function(e)
	{
		if(e.which == 1)
		{
			readFlow.str = "custom";
			if(currentTab.boxes.length > 0)
			{	
				enableSpinners(currentTab);
				updateSpinners(readFlow, currentTab);
				drawPath(currentTab.boxes, paper, currentTab);
			}

			$("#read-flow li").removeClass("ui-state-highlight");
			$(this).addClass("ui-state-highlight");
			$("#read-flow-title").blur();
		}
	});

	//lang
	var commentSyntax = new Array();

	setBoxLang("text/javascript", "js", "c");
	$("#menu-lang-cLike").mousedown(function(e)
	{
		if(e.which == 1)
		{
			setBoxLang("text/x-c++src", "cLike", "c");
		}
	});
	$("#menu-lang-css").mousedown(function(e)
	{
		if(e.which == 1)
		{
			setBoxLang("text/css", "css", "c");
		}
	});
	$("#menu-lang-go").mousedown(function(e)
	{
		if(e.which == 1)
		{
			setBoxLang("text/x-go", "go", "c");
		}
	});
	$("#menu-lang-html").mousedown(function(e)
	{
		if(e.which == 1)
		{
			setBoxLang("text/html", "html", "ml");
		}
	});
	$("#menu-lang-java").mousedown(function(e)
	{
		if(e.which == 1)
		{
			setBoxLang("text/x-java", "java", "c");
		}
	});
	$("#menu-lang-js").mousedown(function(e)
	{
		if(e.which == 1)
		{
			setBoxLang("text/javascript", "js", "c");
		}
	});
	$("#menu-lang-lua").mousedown(function(e)
	{
		if(e.which == 1)
		{
			setBoxLang("text/x-lua", "lua", "lua");
		}
	});
	$("#menu-lang-perl").mousedown(function(e)
	{
		if(e.which == 1)
		{
			setBoxLang("text/x-perl", "perl", "perl");
		}
	});
	$("#menu-lang-php").mousedown(function(e)
	{
		if(e.which == 1)
		{
			setBoxLang("text/x-php", "php", "c");
		}
	});
	$("#menu-lang-py").mousedown(function(e)
	{
		if(e.which == 1)
		{
			setBoxLang("text/x-python", "py", "python");
		}
	});
	$("#menu-lang-ruby").mousedown(function(e)
	{
		if(e.which == 1)
		{
			setBoxLang("text/x-ruby", "ruby", "ruby");
		}
	});
	$("#menu-lang-sql").mousedown(function(e)
	{
		if(e.which == 1)
		{
			setBoxLang("text/x-sql", "sql", "c");
		}
	});
	$("#menu-lang-xml").mousedown(function(e)
	{
		if(e.which == 1)
		{
			setBoxLang("application/xml", "xml", "ml");
		}
	});
	function setBoxLang(lang, id, syntax)
	{
		$("#menu-language li").removeClass("ui-state-highlight");
		$("#menu-lang-" + id).addClass("ui-state-highlight")
		for(var i = 0; i < currentTab.boxes.length; i++)
		{
			currentTab.boxes[i].setBoxLang(lang);
		}
		switch(syntax)
		{
			case "c":
				commentSyntax[0] = "/*";
				commentSyntax[1] = "*/";
				break;
			case "ml":
				commentSyntax[0] = "<!--";
				commentSyntax[1] = "-->";
				break;
			case "perl":
				commentSyntax[0] = "=comment";
				commentSyntax[1] = "=cut";
				break;
			case "ruby":
				commentSyntax[0] = "=begin";
				commentSyntax[1] = "=end";
				break;
			case "python":
				commentSyntax[0] = "...";
				commentSyntax[1] = "...";
				break;
			case "lua":
				commentSyntax[0] = "--[[";
				commentSyntax[1] = "]]";
				break;
		}
	}

	//tab menu
	$("#tab-menu").menu().hide();
	$("#tab-menu-delete").mousedown(function(e)
	{
		if(e.which == 1)
		{
			alert('deleting')
		}
	});
	$("#tab-menu-db-sync").mousedown(function(e)
	{
		if(e.which == 1)
		{
			alert('db')
		}
	});

	//box menu
	$("#box-menu").menu().hide();
	$("#box-menu-delete").mousedown(function(e)
	{
		var mx = $(this).offset().left;
		var my = $(this).offset().top;

		removeSelectedBox(mx, my);
	});
	function removeSelectedBox(mx, my)
	{
		var boxes = currentTab.boxes;
		for(var i = 0; i < boxes.length; i++)
		{
			var x = $(boxes[i].b).offset().left;
			var y = $(boxes[i].b).offset().top;
			var w = $(boxes[i].b).width();
			var h = $(boxes[i].b).height();

			if(mx > x && mx < (x + w) && my > y && my < (y + h))
			{
				$(boxes[i].b).remove();
				boxes.splice(i, 1);
			
				if(currentTab.paths.length > 0)
				{
					currentTab.paths[0].remove();
					currentTab.paths.splice(0,1);
				}
				updateSpinners(readFlow, currentTab);
				drawPath(currentTab.boxes, paper, currentTab);
			}
		}
	}

	//container menu
	$("#container-menu").menu().hide();
	$("#container-menu-delete").mousedown(function(e)
	{
		var mx = $(this).offset().left;
		var my = $(this).offset().top;

		removeSelectedContainer(mx, my);
	});
	function removeSelectedContainer(mx, my)
	{
		var containers = currentTab.containers;
		for(var i = 0; i < containers.length; i++)
		{
			var x = $(containers[i].c).offset().left;
			var y = $(containers[i].c).offset().top;
			var w = $(containers[i].c).width();
			var h = $(containers[i].c).height();

			if(mx > x && mx < (x + w) && my > y && my < (y + h))
			{
				$("#container" + containers[i].id).remove();
				containers.splice(i, 1);
			
				if(paths.length > 0)
				{
					paths[0].remove();
					paths.splice(0,1);
				}
				updateSpinners(readFlow, currentTab);
				drawPath(currentTab.boxes, paper, currentTab);
			}
		}
	}

	$("#menu-bind-emac").mousedown(function(e)
	{
		if(e.which == 1)
		{
			
		}
	});
	$("#menu-bind-sub").mousedown(function(e)
	{
		if(e.which == 1)
		{
			
		}
	});
	$("#menu-bind-vim").mousedown(function(e)
	{
		if(e.which == 1)
		{
			
		}
	});

	//font slider
	$("#font-slider").slider({
		range: "min",
		value: 16,
		min: 12,
		max: 48,
		slide: function(event, ui){
			var i = ui.value;
			$(".CodeMirror").css({fontSize: i + "px"});
		}
	});
	
	//box
	$("#box").hide();

	//container
	$("#container").hide();

	//document
	$(document).bind("contextmenu",function(e){
	    e.preventDefault();
	});
	$(document).bind('keydown', function(e)
	{
		if(e.ctrlKey && (e.which == 83)) {
		    e.preventDefault();
		    save();
  		}
  		if(e.ctrlKey && (e.which == 82)) {
		    e.preventDefault();
		    run();
  		}
	});

	$(document).on("mousedown", function(e)
	{
		if($(e.target).is(".box-click"))
		{
			$(".menu").hide();
			if(e.which == 3)
			{
				$("#box-menu").css({position:"absolute", top:e.pageY, left: e.pageX});
				$("#box-menu").show();
			}
		}
		else if($(e.target).is(".container-click"))
		{
			$(".menu").hide();
			if(e.which == 3)
			{
				$("#container-menu").css({position:"absolute", top:e.pageY, left: e.pageX});
				$("#container-menu").show();
			}
		}
		else
		{
			if(e.which == 1)
			{
				$(".menu, .sub-menu").hide();
			}
			if(e.which == 3)
			{
				$(".menu").hide();
				$("#menu").css({position:"absolute", top:e.pageY, left: e.pageX});
				$("#menu").show();
			}
		}
	});

	$(".bottom").css({width: $(window).width() - 16});
	$(window).on("resize", function()
	{
		$(".bottom").css({width: $(window).width() - 16});
		paper.setSize($(window).width(), $(window).height());
	});

	$(".save-file").tooltip({
		track:true
	});
	$(".run").tooltip({
		track:true
	});
	$(".help-button").button().
	click(function(e){
		e.preventDefault();
	}).tooltip({
		track:true
	});


	//save
	$(".file-name-input").hint().addClass("ui-widget-content")
	.blur(function(){
		currentTab.fileName = $(this).val();
	});
	$(".save-file").button().
	click(function(e){
		e.preventDefault();
		save();
		$(this).blur();
	});

	function save()
	{
		if(currentTab.boxes.length == 0)
		{
			$("#dialog-text").dialog("open");
			return;
		}
		$(".file-name-input").blur();
		var fileName = currentTab.fileName;
		if(!fileName || fileName.length == 0 || fileName.valueOf() == "File name")
		{
			$("#dialog-file").dialog("open");
			return;
		}
		updateSpinners(readFlow, currentTab);
		var text = getFileText();

		var blob = new Blob([text], {type:"text/plain;charset=utf-8"});
		saveAs(blob, fileName + ".js");
	}

	//console
	var consoleVisible = true;

	$(".console-input").hint().addClass("ui-widget-content")
	.bind("keypress", function(e){
		if(e.keyCode == 13)
		{
			console();
		}
	});

	$(".run").button().
	click(function(e){
		e.preventDefault();
		run();
		$(this).blur();
	});

	function console()
	{
		var s = $(".console-input").val();
		if(!s || s.length == 0 || s.valueOf() == "Console")
		{
			return;
		}
		try
		{
			eval(s);
		}
		catch(err)
		{
			$("#dialog-runner-error").text(err).dialog("open");
		}
		$(".console-input").val("");
	}

	function run()
	{
		if(currentTab.boxes.length == 0)
		{
			$("#dialog-text").dialog("open");
			return;
		}

		updateSpinners(readFlow, currentTab);
		var text = "'use strict'; " + getFileText();
		try
		{
			eval(text);
		}
		catch(err)
		{
			$("#dialog-runner-error").text(err).dialog("open");
		}
	}

	dbOptions = {

	    // Required. Called when a user selects an item in the Chooser.
	    success: function(files) {
	        alert("Here's the file link: " + files[0].link)
	    },

	    // Optional. Called when the user closes the dialog without selecting a file
	    // and does not include any parameters.
	    cancel: function() {

	    },

	    // Optional. "preview" (default) is a preview link to the document for sharing,
	    // "direct" is an expiring link to download the contents of the file. For more
	    // information about link types, see Link types below.
	    linkType: "preview", // or "direct"

	    // Optional. A value of false (default) limits selection to a single file, while
	    // true enables multiple file selection.
	    multiselect: false, // or true

	    // Optional. This is a list of file extensions. If specified, the user will
	    // only be able to select files with these extensions. You may also specify
	    // file types, such as "video" or "images" in the list. For more information,
	    // see File types below. By default, all extensions are allowed.
	};

	function getFileText()
	{
		var s = "";
		for(var i = 0; i < currentTab.boxes.length; i++)
		{
			s += commentSyntax[0] + $(currentTab.boxes[i].handle).text() + commentSyntax[1] + '\n';
			s += currentTab.boxes[i].cm.getValue();
			s += '\n' + '\n';
		}
		return s;
	}


	$("#dialog-text").dialog({
		autoOpen: false,
		modal:true,
		close: function(e, ui){
			$(".save-file").blur();
		}
	});
	$("#dialog-file").dialog({
		autoOpen: false,
		modal:true,
		close: function(e, ui){
			$("#help-button").blur();
		}
	});
	$("#dialog-runner-error").dialog(
	{
		autoOpen: false,
		modal:true,
	});

	//splicer
	initSplicer();
	
	/*new Box(100,100);
	new Container(300,100);*/

	function setTheme(s)
	{
		themeName = s;
		$('head').append('<link rel="stylesheet" href="res/themes/' + s + '/jquery-ui-1.10.4.custom.css" type="text/css" />');
		$('head').append('<link rel="stylesheet" href="res/themes/' + s + '/code-mirror.css" type="text/css" />');
		$('head').append('<link rel="stylesheet" href="res/ui.css" type="text/css" />');
		resetBoxTheme();
	}
	function resetBoxTheme()
	{
		for(var i = 0; i < tabs.length; i++)
		{
			for(var j = 0; j < tabs[i].boxes.length; j++)
			{
				tabs[i].boxes[j].resetBoxTheme(themeName);
			}
		}
	}

	//file drop
	$("body").on("dragover", function(e) {
		e.preventDefault();
		e.stopPropagation();
	}).on("dragenter", function(e) {
		e.preventDefault();
		e.stopPropagation();
	});
	$("body").on('drop', function(e) {
		if(e.originalEvent.dataTransfer){
			if(e.originalEvent.dataTransfer.files.length)
			{
				e.preventDefault();
				e.stopPropagation();
				splice(e.originalEvent.dataTransfer.files[0]);
			}
		}
	});
});