(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes
lib.webFontTxtInst = {}; 
var loadedTypekitCount = 0;
var loadedGoogleCount = 0;
var gFontsUpdateCacheList = [];
var tFontsUpdateCacheList = [];

// library properties:
lib.properties = {
	width: 1280,
	height: 600,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	webfonts: {},
	manifest: []
};



lib.ssMetadata = [];



lib.updateListCache = function (cacheList) {		
	for(var i = 0; i < cacheList.length; i++) {		
		if(cacheList[i].cacheCanvas)		
			cacheList[i].updateCache();		
	}		
};		

lib.addElementsToCache = function (textInst, cacheList) {		
	var cur = textInst;		
	while(cur != exportRoot) {		
		if(cacheList.indexOf(cur) != -1)		
			break;		
		cur = cur.parent;		
	}		
	if(cur != exportRoot) {	//we have found an element in the list		
		var cur2 = textInst;		
		var index = cacheList.indexOf(cur);		
		while(cur2 != cur) { //insert all it's children just before it		
			cacheList.splice(index, 0, cur2);		
			cur2 = cur2.parent;		
			index++;		
		}		
	}		
	else {	//append element and it's parents in the array		
		cur = textInst;		
		while(cur != exportRoot) {		
			cacheList.push(cur);		
			cur = cur.parent;		
		}		
	}		
};		

lib.gfontAvailable = function(family, totalGoogleCount) {		
	lib.properties.webfonts[family] = true;		
	var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];		
	for(var f = 0; f < txtInst.length; ++f)		
		lib.addElementsToCache(txtInst[f], gFontsUpdateCacheList);		

	loadedGoogleCount++;		
	if(loadedGoogleCount == totalGoogleCount) {		
		lib.updateListCache(gFontsUpdateCacheList);		
	}		
};		

lib.tfontAvailable = function(family, totalTypekitCount) {		
	lib.properties.webfonts[family] = true;		
	var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];		
	for(var f = 0; f < txtInst.length; ++f)		
		lib.addElementsToCache(txtInst[f], tFontsUpdateCacheList);		

	loadedTypekitCount++;		
	if(loadedTypekitCount == totalTypekitCount) {		
		lib.updateListCache(tFontsUpdateCacheList);		
	}		
};
// symbols:



(lib.Tween14 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#996666").s().p("AhUBVQgjgkAAgxQAAgwAjgkQAegdAngFIAPgBIAQABQAnAFAdAdQAkAkAAAwQAAAxgkAkQgjAjgxAAQgxAAgjgjg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12,-12,24.1,24.1);


(lib.Tween13 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#996666").s().p("AhUBVQgjgkAAgxQAAgwAjgkQAegdAngFIAPgBIAQABQAnAFAdAdQAkAkAAAwQAAAxgkAkQgjAjgxAAQgxAAgjgjg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12,-12,24.1,24.1);


(lib.Tween12 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#996666").s().p("AhUBVQgjgkAAgxQAAgwAjgkQAdgdAogFIAPgBIAQABQAnAFAeAdQAjAkAAAwQAAAxgjAkQgkAjgxAAQgxAAgjgjg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12,-12,24.1,24.1);


(lib.Tween11 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#996666").s().p("AhUBVQgjgkAAgxQAAgwAjgkQAdgdAogFIAPgBIAQABQAnAFAeAdQAjAkAAAwQAAAxgjAkQgkAjgxAAQgxAAgjgjg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12,-12,24.1,24.1);


(lib.Tween8 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#996666").s().p("AhUBUQgjgiAAgyQAAgjASgcQAHgLAKgKQAkgjAwAAQAxAAAkAjQAJAKAIALQASAcAAAjQAAAygjAiQgkAkgxAAQgwAAgkgkg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12,-12,24.1,24.1);


(lib.Tween7 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#996666").s().p("AhUBUQgjgiAAgyQAAgwAjgkQAdgdAogFIAPgBIAQABQAnAFAdAdQAkAkAAAwQAAAygkAiQgiAkgyAAQgwAAgkgkg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12,-12,24.1,24.1);


(lib.Symbol1copy3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.text = new cjs.Text("COMPONENT 2", "17px 'Times New Roman'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 21;
	this.text.lineWidth = 166;
	this.text.parent = this;
	this.text.setTransform(84.9,30.6);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#669999").ss(1,1,1).p("AtSmZIalAAIAAMzI6lAAg");
	this.shape.setTransform(85.1,41.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#AC8BED").s().p("AtSGaIAAszIalAAIAAMzg");
	this.shape_1.setTransform(85.1,41.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape},{t:this.text}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,172.3,84.1);


(lib.Symbol1copy2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.text = new cjs.Text("COMPONENT 4", "17px 'Times New Roman'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 21;
	this.text.lineWidth = 166;
	this.text.parent = this;
	this.text.setTransform(84.9,30.6);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#669999").ss(1,1,1).p("AtSmZIalAAIAAMzI6lAAg");
	this.shape.setTransform(85.1,41.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#AC8BED").s().p("AtSGaIAAszIalAAIAAMzg");
	this.shape_1.setTransform(85.1,41.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape},{t:this.text}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,172.3,84.1);


(lib.Symbol1copy = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.text = new cjs.Text("COMPONENT 3", "17px 'Times New Roman'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 21;
	this.text.lineWidth = 166;
	this.text.parent = this;
	this.text.setTransform(84.9,30.6);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#669999").ss(1,1,1).p("AtSmZIalAAIAAMzI6lAAg");
	this.shape.setTransform(85.1,41.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#AC8BED").s().p("AtSGaIAAszIalAAIAAMzg");
	this.shape_1.setTransform(85.1,41.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape},{t:this.text}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,172.3,84.1);


(lib.Symbol1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.text = new cjs.Text("cacheService.createLayer({name:'test'})\n.cacheLayer.putItem({key:'your-key', \ndata: 'your-data')", "10px 'Times New Roman'");
	this.text.lineHeight = 10;
	this.text.lineWidth = 175;
	this.text.parent = this;
	this.text.setTransform(0.2,82.6);

	this.text_1 = new cjs.Text("COMPONENT 1", "17px 'Times New Roman'", "#FFFFFF");
	this.text_1.textAlign = "center";
	this.text_1.lineHeight = 21;
	this.text_1.lineWidth = 166;
	this.text_1.parent = this;
	this.text_1.setTransform(84.9,30.6);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#669999").ss(1,1,1).p("AtSmZIalAAIAAMzI6lAAg");
	this.shape.setTransform(85.1,41.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#AC8BED").s().p("AtSGaIAAszIalAAIAAMzg");
	this.shape_1.setTransform(85.1,41.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape},{t:this.text_1},{t:this.text}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.8,-1,179.1,146.2);


(lib.Symbol3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.instance = new lib.Symbol1();
	this.instance.parent = this;
	this.instance.setTransform(126.7,61.1,1.487,1.487,0,0,0,85.2,41.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2.7,-0.7,266.4,216.6);


// stage content:
(lib.index = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 11
	this.text = new cjs.Text("Observable: cacheService.getLayer('test').getItemObservable('your-key').subscribe(item => {})\nSync: cacheService.getLayer('test').getItem('your-key');", "17px 'Times New Roman'");
	this.text.lineHeight = 21;
	this.text.lineWidth = 893;
	this.text.parent = this;
	this.text.setTransform(384.5,549.9);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(253));

	// comunication
	this.instance = new lib.Tween13("synched",0);
	this.instance.parent = this;
	this.instance.setTransform(610,130);
	this.instance._off = true;

	this.instance_1 = new lib.Tween14("synched",0);
	this.instance_1.parent = this;
	this.instance_1.setTransform(610,130);
	this.instance_1._off = true;

	this.instance_2 = new lib.Tween11("synched",0);
	this.instance_2.parent = this;
	this.instance_2.setTransform(1040,400);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(100).to({_off:false},0).to({_off:true},4).wait(149));
	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(100).to({_off:false},4).wait(1).to({startPosition:0},0).to({_off:true,x:1040,y:400},55).wait(93));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(105).to({_off:false},55).wait(87).to({startPosition:0},0).to({alpha:0},5).wait(1));

	// comunication
	this.instance_3 = new lib.Tween13("synched",0);
	this.instance_3.parent = this;
	this.instance_3.setTransform(610,130);
	this.instance_3._off = true;

	this.instance_4 = new lib.Tween14("synched",0);
	this.instance_4.parent = this;
	this.instance_4.setTransform(610,130);
	this.instance_4._off = true;

	this.instance_5 = new lib.Tween11("synched",0);
	this.instance_5.parent = this;
	this.instance_5.setTransform(770,400);
	this.instance_5._off = true;

	this.instance_6 = new lib.Tween12("synched",0);
	this.instance_6.parent = this;
	this.instance_6.setTransform(770,400);
	this.instance_6.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_3}]},100).to({state:[{t:this.instance_4}]},4).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},55).to({state:[{t:this.instance_5}]},87).to({state:[{t:this.instance_6}]},5).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(100).to({_off:false},0).to({_off:true},4).wait(149));
	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(100).to({_off:false},4).wait(1).to({startPosition:0},0).to({_off:true,x:770,y:400},55).wait(93));
	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(105).to({_off:false},55).wait(87).to({startPosition:0},0).to({_off:true,alpha:0},5).wait(1));

	// comunication
	this.instance_7 = new lib.Tween13("synched",0);
	this.instance_7.parent = this;
	this.instance_7.setTransform(610,130);
	this.instance_7._off = true;

	this.instance_8 = new lib.Tween14("synched",0);
	this.instance_8.parent = this;
	this.instance_8.setTransform(610,130);
	this.instance_8._off = true;

	this.instance_9 = new lib.Tween11("synched",0);
	this.instance_9.parent = this;
	this.instance_9.setTransform(470,400);
	this.instance_9._off = true;

	this.instance_10 = new lib.Tween12("synched",0);
	this.instance_10.parent = this;
	this.instance_10.setTransform(470,400);
	this.instance_10.alpha = 0;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_7}]},100).to({state:[{t:this.instance_8}]},4).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},55).to({state:[{t:this.instance_9}]},87).to({state:[{t:this.instance_10}]},5).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(100).to({_off:false},0).to({_off:true},4).wait(149));
	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(100).to({_off:false},4).wait(1).to({startPosition:0},0).to({_off:true,x:470,y:400},55).wait(93));
	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(105).to({_off:false},55).wait(87).to({startPosition:0},0).to({_off:true,alpha:0},5).wait(1));

	// Layer 1
	this.instance_11 = new lib.Tween7("synched",0);
	this.instance_11.parent = this;
	this.instance_11.setTransform(240.1,399.1);
	this.instance_11.alpha = 0;
	this.instance_11._off = true;

	this.instance_12 = new lib.Tween8("synched",0);
	this.instance_12.parent = this;
	this.instance_12.setTransform(610.1,129.1);
	this.instance_12._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(33).to({_off:false},0).to({alpha:1},5).wait(1).to({startPosition:0},0).to({_off:true,x:610.1,y:129.1},31).wait(183));
	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(39).to({_off:false},31).wait(24).to({startPosition:0},0).to({startPosition:0},5).to({_off:true},1).wait(153));

	// Layer 10
	this.instance_13 = new lib.Symbol1copy2();
	this.instance_13.parent = this;
	this.instance_13.setTransform(1036.5,487.1,1,1,0,0,0,85.1,41.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(161).to({regX:85.2,scaleX:1.24,scaleY:1.24,x:1036.7,y:487.2},13).wait(70).to({regX:85.1,scaleX:1,scaleY:1,x:1036.5,y:487.1},8).wait(1));

	// Layer 9
	this.instance_14 = new lib.Symbol1copy();
	this.instance_14.parent = this;
	this.instance_14.setTransform(762.1,487.1,1,1,0,0,0,85.1,41.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(161).to({regX:85.2,scaleX:1.27,scaleY:1.27,x:762.3,y:487.2},13).wait(70).to({regX:85.1,scaleX:1,scaleY:1,x:762.1,y:487.1},8).wait(1));

	// Layer 8
	this.instance_15 = new lib.Symbol1copy3();
	this.instance_15.parent = this;
	this.instance_15.setTransform(469.7,487.1,1,1,0,0,0,85.1,41.1);

	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(161).to({regX:85.2,scaleX:1.27,scaleY:1.27,x:469.8,y:487.2},13).wait(70).to({regX:85.1,scaleX:1,scaleY:1,x:469.7,y:487.1},8).wait(1));

	// c1
	this.instance_16 = new lib.Symbol1();
	this.instance_16.parent = this;
	this.instance_16.setTransform(193.3,487.1,1,1,0,0,0,85.1,41.1);

	this.instance_17 = new lib.Symbol3();
	this.instance_17.parent = this;
	this.instance_17.setTransform(193.3,487.1,1,1,0,0,0,126.6,61.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_16}]}).to({state:[{t:this.instance_16}]},20).to({state:[{t:this.instance_17}]},1).to({state:[{t:this.instance_16}]},123).to({state:[{t:this.instance_16}]},16).wait(93));
	this.timeline.addTween(cjs.Tween.get(this.instance_16).to({regX:85.2,scaleX:1.49,scaleY:1.49,x:193.4},20).to({_off:true},1).wait(123).to({_off:false},0).to({regX:85.1,scaleX:1,scaleY:1,x:193.3},16).wait(93));

	// Layer 7
	this.text_1 = new cjs.Text("CACHE SERVICE", "17px 'Times New Roman'", "#FFFFFF");
	this.text_1.textAlign = "center";
	this.text_1.lineHeight = 21;
	this.text_1.lineWidth = 166;
	this.text_1.parent = this;
	this.text_1.setTransform(619.7,47.4);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#669999").ss(1,1,1).p("AtSmZIalAAIAAMzI6lAAg");
	this.shape.setTransform(619.9,57.9);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#AC8BED").s().p("AtSGaIAAszIalAAIAAMzg");
	this.shape_1.setTransform(619.9,57.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape},{t:this.text_1}]}).wait(253));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(746.4,315.9,1173.6,596.6);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, createjs, ss;