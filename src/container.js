function Container(x, y, readFlow, tab)
{
	this.tab = tab;
	this.id = this.tab.containerId;
	this.name = "container" + this.id;
	this.peels = [];
	
	// add a box to the container
	this.addPeel = function(peel)
	{
		for(var i = 0; i <this.peels.length; i++)
		{
			if(this.peels[i].p == peel.p)
			{
				this.peels.splice(i, 1);
			}
		}
		this.peels.push(peel);
	}

	//clone, append to doc
	this.c = $("#container").clone();
	this.c.attr("id", this.name).appendTo(document.body);
	this.runnerContainer = $(this.c).find("#runner-container");

	//css on container
	$(this.c).css({position:"absolute", left: x, top: y});
	$(this.c).css({width: "auto", height: "auto", minWidth: "128px", minHeight: "128px", padding:"0em", cssFloat: "left", margin: "0 0px 0px 0", webkitBorderRadius: "6px",mozBorderRadius: "6px",borderRadius: "6px", zIndex: -1});

	//make container draggable
	$(this.c).draggable($.proxy({
		create: function()
		{
			this.addPeel = function(peel)
			{
				for(var i = 0; i <this.peels.length; i++)
				{
					if(this.peels[i].p == peel.p)
					{
						this.peels.splice(i, 1);
					}
				}
				this.peels.push(peel);
			}

			this.removeLostPeel = function()
			{
				for(var i = 0; i < this.peels.length; i++)
				{
					var p = this.peels[i].p;
					if(p.offset().left < $(this).offset().left || p.offset().left + p.width()/2 > $(this).offset().left + $(this).width()
						|| p.offset().top < $(this).offset().top || p.offset().top + p.height()/2 > $(this).offset().top + $(this).height())
					{
						this.peels.splice(i, 1);
					}
				}
			}

			this.getMaxPos = function()
			{
				var maxX = 0, maxY = 0;
				
				for(var i = 0; i < this.peels.length; i++)
				{
					var p = this.peels[i].p;
					if(p.offset().left + p.width() > maxX)
						maxX = p.offset().left + p.width();
					if(p.offset().top + p.height() > maxY)
						maxY = p.offset().top + p.height();
				}

				var result = {
					left: maxX - $(this).offset().left,
					top: maxY - $(this).offset().top
				};

				return result;
			}
		},
		revert: "valid"
	},this))
	.droppable({accept: ".droppable"}).resizable({

	}).show();

	

	//drag
	$("#" + this.name).on("drag", $.proxy(function(e, ui)
	{
		for(var i = 0; i < this.peels.length; i++)
		{
			this.peels[i].p.offset({left: $("#" + this.name).offset().left + this.peels[i].xOff, top: $("#" + this.name).offset().top + this.peels[i].yOff});
		}
		alert(this.tab)
		updateSpinners(readFlow, this.tab);
	}),this);

	// droping into container
	$("#" + this.name).on("drop", function(e, ui)
	{
		$(this).addClass("ui-state-highlight");
		var peel = {
			p: ui.draggable,
			xOff: ui.offset.left - $(this).offset().left,
			yOff: ui.offset.top - $(this).offset().top
		};

		peel.p.container = $(this);

		var right = $(this).offset().left + $(this).width();
		if(peel.p.offset().left + peel.p.width() > right)
		{
			peel.xOff = $(this).width() - peel.p.width();
		}

		var bottom = $(this).offset().top + $(this).height();
		if(peel.p.offset().top + peel.p.height() > bottom)
		{
			peel.yOff = $(this).height() - peel.p.height();
		}

		if(peel.xOff < 0)
			peel.xOff = 0;

		if(peel.yOff < 0)
			peel.yOff = 0;

		peel.p.animate({left: $(this).offset().left + peel.xOff, top: $(this).offset().top + peel.yOff});

		if(peel.p.width() > $(this).width())
			$(this).width(peel.p.width() + 32);

		if(peel.p.height() > $(this).height())
			$(this).height(peel.p.height() + 32);

		addPeel(peel);
	}).on("dropout", function(e, ui){
		this.removeLostPeel();

		if(this.peels.length <= 0)
			$(this).removeClass("ui-state-highlight");
	}).on("resize", function(e, ui)
	{
		var max = this.getMaxPos();

		if(max.left >= $(this).width())
			$(this).width(max.left);

		if(max.top - 10 >= $(this).height())
			$(this).height(max.top);
	});
	this.tab.add(this);
}
