function onRun(context) {
	var doc = context.document;
	//doc.showMessage("Hello World!");

	//var selection = context.selection;
	var pB = NSPasteboard.generalPasteboard();
	var pasteBoardStr = pB.stringForType(NSPasteboardTypeString); // believe the result is a NSString
	
	if (pasteBoardStr) {
		
		var jsonStr = '{"height":1020,"width":290,"x":0,"y":0,"children":[{"height":460,"width":10,"x":270,"y":10,"children":[],"type":"Rect"},{"x1":60,"y1":50,"x2":200,"y2":50,"type":"Line"},{"textContent":"Create Report","fontFamily":"Roboto","fontSize":20,"x":70,"y":40,"type":"Text"},{"height":230,"width":230,"x":20,"y":80,"children":[{"textContent":"Date","fontFamily":"Roboto","fontSize":32,"x":100,"y":210,"type":"Text"}],"type":"Rect"},{"height":230,"width":230,"x":20,"y":580,"children":[{"textContent":"Date","fontFamily":"Roboto","fontSize":32,"x":100,"y":710,"type":"Text"}],"type":"Rect"},{"height":230,"width":230,"x":20,"y":330,"children":[{"textContent":"Date","fontFamily":"Roboto","fontSize":32,"x":100,"y":460,"type":"Text"}],"type":"Rect"}],"type":"Rect"}';

		//var jsonTest = JSON.parse('"foo"');
		//var jsonTest = JSON.parse(pasteBoardStr);
		var jsonTest = JSON.parse(jsonStr);

		log(jsonTest); 
		/*
		var jsPasteBoardStr = String(pasteBoardStr);
		
		//doc.showMessage(jsPasteBoardStr); // works
		log(jsPasteBoardStr); // good

		// convert the string to a svg object (........can't do this......')(unable to use the majority of JavaScript libraries and can't' work with the DOM object)
		//var parser = new DOMParser();
		//var resultSVGDoc = parser.parseFromString(jsPasteBoardStr, "image/svg+xml");
		//log(resultSVGDoc)

		// drill down into its components
		var el = document.createElement( 'html' );
		el.innerHTML = jsPasteBoardStr;

		el.getElementsByTagName( 'rect' ); // Live NodeList of your rect elements

		log(el);

		

		//doc.showMessage("string found");
		//char = [htmlStrData characterAtIndex:0];
		//doc.showMessage(char);
		*/
	} else {
		doc.showMessage("nothing found");
	}
};