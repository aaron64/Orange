function addPath(paper, tab)
{
	var path = paper.path("M" + 0 + " " + 0 + "L" + 0 + " " + 0).attr(
	{
		stroke: "#f77a00",
		"stroke-width": 7,
		"stroke-linecap": "round"
	});
	path.node.setAttribute("class","path");
	path.data("id", "path" + tab.paths.length);
	tab.paths.push(path);
}

function drawPath(boxes, paper, tab)
{
	var length = 50;

	for(var i = 0; i <= boxes.length - 2; i++)
	{
		var b1 = $(boxes[i].b);
		var x1 = b1.offset().left + b1.width()/2;
		var y1 = b1.offset().top + b1.height()/2;

		var b2 = $(boxes[i + 1].b);
		var x2 = b2.offset().left + b2.width()/2;
		var y2 = b2.offset().top + b2.height()/2;

		tab.paths[i].attr("stroke", $(boxes[i].handle).css("backgroundColor"));

		tab.paths[i].animate({path:"M" + x1 + " " + y1 + "L" + x2 + " " + y2}, length);
	}
}