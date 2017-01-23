function Tab(id)
{
	this.id = id;

	this.fileName = "";

	this.boxes = new Array();
	this.containers = new Array();
	this.allEntities = new Array();

	this.paths = new Array();

	this.boxId = 0;
	this.containerId = 0;
	this.add = function(o)
	{
		this.allEntities.push(o);
		if(startsWith(o.name, "box"))
		{
			this.boxes.push(o);
			this.boxId++;
		}
		else if(startsWith(o.name, "con"))
		{
			this.containers.push(o);
			this.containerId++;
		}
	}
	this.hide = function()
	{
		for(var i = 0; i < this.boxes.length; i++)
		{
			$(this.boxes[i].b).hide();
		}
		for(var i = 0; i < this.paths.length; i++)
		{
			this.paths[i].hide();
		}
	}
	this.show = function()
	{
		for(var i = 0; i < this.boxes.length; i++)
		{
			$(this.boxes[i].b).show();
		}
		if($("#menu-path-toggle a").text() == "Hide Paths")
		{
			for(var i = 0; i < this.paths.length; i++)
			{
				this.paths[i].show();
			}
		}
	}

	function startsWith(s1, s2)
	{
		if(s1.lastIndexOf(s2,0) === 0)
			return true;
		return false;
	}
}