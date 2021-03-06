/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_rect	= function(){};
cSVGElement_rect.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	// Implementation for IE

	// handlers
	cSVGElement_rect.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "width":
					case "height":
					case "x":
					case "y":
					case "rx":
					case "ry":
						this.$getContainer().path	= cSVGElement_rect.toPath(this);
						break;
					//
					case "transform":
						cSVGElement.applyTransform(this);
						break;
					//
					default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;

			// Apply gradients
			if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

			// Apply transformations
			cSVGElement.applyTransform(this);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_rect.toPath	= function(oElement) {
		var nX	= oElement.getAttribute("x") * 1,
			nY	= oElement.getAttribute("y") * 1,
			nWidth	= oElement.getAttribute("width") * 1,
			nHeight	= oElement.getAttribute("height") * 1,
			nRx	= oElement.getAttribute("rx") * 1 || 0,
			nRy	= oElement.getAttribute("ry") * 1 || 0;
		if (nRx > nWidth / 2)
			nRx	= nWidth / 2;
		if (nRy > nHeight / 2)
			nRy	= nHeight / 2;
		return ["m", [nX + nRx, nY].map(Math.round),
				"l", [nX + nWidth - nRx, nY].map(Math.round),
				"wa", [nX + nWidth - 2 * nRx, nY, nX + nWidth, nY + 2 * nRy, nX + nWidth - nRx, nY, nX + nWidth, nY + nRy].map(Math.round),
				"l", [nX + nWidth, nY + nHeight - nRy].map(Math.round),
				"wa", [nX + nWidth - 2 * nRx, nY + nHeight - 2 * nRy, nX + nWidth, nY + nHeight, nX + nWidth, nY + nHeight - nRy, nX + nWidth - nRx, nY + nHeight].map(Math.round),
				"l", [nX + nRx, nY + nHeight].map(Math.round),
				"wa", [nX, nY + nHeight - 2 * nRy, nX + 2 * nRx, nY + nHeight, nX + nRx, nY + nHeight, nX, nY + nHeight - nRy].map(Math.round),
				"l", [nX, nY + nRy].map(Math.round),
				"wa", [nX, nY, nX + 2 * nRx, nY + 2 * nRy, nX, nY + nRy, nX + nRx, nY].map(Math.round),
				"x"].join(" ");
	};

	// presentation
	cSVGElement_rect.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-rect' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" \
					style="position:absolute;top:0;left:0;height:100%;width:100%;"\
					path="' + cSVGElement_rect.toPath(this) + '"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_rect.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

// Register Element with language
oSVGNamespace.setElement("rect", cSVGElement_rect);
