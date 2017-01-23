var spliceCm, st;
var barPath;

function initSplicer()
{
	$("#splicer").hide();

	var spliceText = $("#splice-text")[0];
	spliceCm = CodeMirror.fromTextArea(spliceText, {
			theme: "orange",
			keyMap: "sublime",
			mode: "javascript",
			lineNumbers: true,
			viewportMargin: Infinity,
	});
	$("#splicer-file").find(".CodeMirror").css("margin-top","28px").css("max-height", "500px")
	.css("overflow-y", "auto");

	st = $("#splice-text");
	var splicePaper = new Raphael($("#splicer-raphael")[0], $(st).width(), $(st).height());
	barPath = splicePaper.path("M0 0L0 0").attr(
	{
		stroke: "#f77a00",
		"stroke-width": 7,
	});
}

function splice(file)
{
	var sx = $(window).width()/2 - $("#splicer").width()/2;
	var sy = 90;
	$("#splicer").offset({left: sx, top: sy})

	$("#add-tab").trigger("click");
	
	var reader = new FileReader();
	reader.onload = function(e) {
		spliceCm.setValue(reader.result);
	}
	reader.readAsText(file);
	
	$("#splicer").show();

	setTimeout(function(){spliceCm.refresh();}, 20);

	var x1 = $(st).offset().left;
	var y1 = $(st).offset().top + 4;
	var x2 = $(st).offset().left + $(st).width();
	var y2 = $(st).offset().top + 4;
	barPath.attr({path:"M" + x1 + " " + y1 + "L" + x2 + " " + y2});

	$("#splice-text").focus();
}

function setSpliceBar(e)
{

}