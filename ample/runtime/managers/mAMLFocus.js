/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Properties
var oAMLFocus_focusGroup	= null;

//
function fAMLFocus_focus(oElement) {
	if (oElement != oAMLFocus_focusGroup) {
		if (oAMLFocus_focusGroup)
			fAMLFocus_blur(oAMLFocus_focusGroup);

		// Set active element
		oAMLFocus_focusGroup	= oElement;

		// Set document active element
		oElement.ownerDocument.activeElement	= oElement;

		var oEvent	= new cAMLUIEvent;
		oEvent.initUIEvent("focus", false, false, window, null);
		fAMLNode_dispatchEvent(oElement, oEvent);

		var oEvent	= new cAMLUIEvent;
		oEvent.initUIEvent("DOMFocusIn", true, false, window, null);
		fAMLNode_dispatchEvent(oElement, oEvent);
	}
};

function fAMLFocus_blur(oElement) {
	if (oElement == oAMLFocus_focusGroup) {
		// Unset active element
		oAMLFocus_focusGroup	= null;

		// Unset document active element
		oElement.ownerDocument.activeElement	= null;

		var oEvent	= new cAMLUIEvent;
		oEvent.initUIEvent("blur", false, false, window, null);
		fAMLNode_dispatchEvent(oElement, oEvent);

		var oEvent	= new cAMLUIEvent;
		oEvent.initUIEvent("DOMFocusOut", true, false, window, null);
		fAMLNode_dispatchEvent(oElement, oEvent);
	}
};

/* Focus Group */
function fAMLFocus_getFocusGroupNext(oElement) {
	for (var oParent = oElement, oFocusGroup; oParent; oParent = oParent.parentNode)
		if (oParent == oElement &&(oFocusGroup = fAMLFocus_getFocusGroupNextChild(oParent.firstChild)))
			return oFocusGroup;
		else
		if (oFocusGroup = fAMLFocus_getFocusGroupNextChild(oParent.nextSibling))
			return oFocusGroup;
};

function fAMLFocus_getFocusGroupNextChild(oElement) {
	for (var oSibling = oElement, oFocusGroup; oSibling; oSibling = oSibling.nextSibling)
		if (oSibling.tabIndex >= 0 && oSibling.$isAccessible() && fAMLFocus_isVisible(oSibling))
			return oSibling;
		else
		if (oFocusGroup = fAMLFocus_getFocusGroupNextChild(oSibling.firstChild))
			return oFocusGroup;
};

function fAMLFocus_getFocusGroupPrevious(oElement) {
	for (var oParent = oElement, oFocusGroup; oParent; oParent = oParent.parentNode)
		if (oParent != oElement && oParent.tabIndex >= 0 && oParent.$isAccessible() && fAMLFocus_isVisible(oParent))
			return oParent;
		else
		if (oFocusGroup = fAMLFocus_getFocusGroupPreviousChild(oParent.previousSibling))
			return oFocusGroup;
};

function fAMLFocus_getFocusGroupPreviousChild(oElement) {
	for (var oSibling = oElement, oFocusGroup; oSibling; oSibling = oSibling.previousSibling)
		if (oFocusGroup = fAMLFocus_getFocusGroupPreviousChild(oSibling.lastChild))
			return oFocusGroup;
		else
		if (oSibling.tabIndex >= 0 && oSibling.$isAccessible() && fAMLFocus_isVisible(oSibling))
			return oSibling;
};

function fAMLFocus_isVisible(oElement) {
	// Algorythm 2 (faster but ignores visibility:hidden and will fail if this style was used)
	for (var oElementDOM; oElement.nodeType != cAMLNode.DOCUMENT_NODE; oElement = oElement.parentNode)
		if (oElementDOM = oElement.$getContainer())
			return oElementDOM.offsetHeight > 0;

	// Algorythm 1
//	for (var oElementDOM = oElement.$getContainer(); oElementDOM.nodeType != cAMLNode.DOCUMENT_NODE; oElementDOM = oElementDOM.parentNode)
//		if (fAML_getComputedStyle(oElementDOM).display == "none")
//			return false;
	return true;
};

function fAMLFocus_onMouseDown(oEvent) {
	// Check if default action is prevented
	if (oEvent.defaultPrevented)
		return;

	// Find new element to focus
	var oFocusGroup	= null;
    for (var oElement = oEvent.target; oElement.nodeType != cAMLNode.DOCUMENT_NODE; oElement = oElement.parentNode)
    	if (oElement.tabIndex >= 0 && oElement.$isAccessible() && fAMLFocus_isVisible(oElement)) {
			oFocusGroup	= oElement;
			break;
    	}

	if (oFocusGroup != oAMLFocus_focusGroup) {
		if (oAMLFocus_focusGroup) {
			// check if current focusable was removed
			if (!oAML_all[oAMLFocus_focusGroup.uniqueID])
				return;

			// blur element otherwise
			fAMLFocus_blur(oAMLFocus_focusGroup);
		}

		if (oFocusGroup)
			fAMLFocus_focus(oFocusGroup);
	}
};

function fAMLFocus_onKeyDown(oEvent) {
	// Check if default action is prevented
	if (oEvent.defaultPrevented)
		return;

	// prevent system tab combinations handling
	if (oEvent.keyIdentifier == "Tab" && (oEvent.altKey || oEvent.ctrlKey))
		return;

	var oFocusGroup	= null;
	if (oEvent.keyIdentifier == "Tab") {
		if (oEvent.shiftKey)
			oFocusGroup	= fAMLFocus_getFocusGroupPrevious(oAMLFocus_focusGroup) || fAMLFocus_getFocusGroupPreviousChild(oAML_modalNode || this.documentElement);
		else
			oFocusGroup	= fAMLFocus_getFocusGroupNext(oAMLFocus_focusGroup) || fAMLFocus_getFocusGroupNextChild(oAML_modalNode || this.documentElement);

		if (oAMLFocus_focusGroup) {
			// check if current focusable was removed
			if (!oAML_all[oAMLFocus_focusGroup.uniqueID])
				return;

			fAMLFocus_blur(oAMLFocus_focusGroup);
		}

		if (oFocusGroup) {
			fAMLFocus_focus(oFocusGroup);
			oEvent.preventDefault();	// FIXME: what is this for?
		}
	}
	else {
		if (oEvent.altKey && oEvent.keyIdentifier != "Alt") {
			var aKey	= oEvent.keyIdentifier.match(/U\+([\dA-F]{4})/),
				sKey	= aKey ? cString.fromCharCode(fParseInt(aKey[1], 16)) : oEvent.keyIdentifier,
				oElement;

			for (var sInstance in oAML_all) {
				oElement	= oAML_all[sInstance];
				if (oElement.tabIndex >= 0 && oElement.accessKey && oElement.accessKey.toUpperCase() == sKey) {
					if (oElement && oElement.$isAccessible() && fAMLFocus_isVisible(oElement)) {
// What is this for?
//						if (oElement.$getContainer().accessKey != sKey)
//							oElement.$getContainer().accessKey	= sKey;

						// Invoke focus on component
						fAMLFocus_focus(oElement);

						// Prevent browser default action
						oEvent.preventDefault();

						// Activate element
//							oElement.$activate();
					}
					break;
				}
			}
		}
	}
};

// Attaching to impementation
cAMLElement.prototype.tabIndex	=-1;
cAMLElement.prototype.accessKey	= null;

cAMLElement.prototype.focus	= function() {
	fAMLFocus_focus(this);
};

cAMLElement.prototype.blur	= function() {
	fAMLFocus_blur(this);
};

cAMLElement.prototype.$isAccessible	= function() {
	return true;
};

// Registering Event Handlers
ample.addEventListener("mousedown",	fAMLFocus_onMouseDown,	false);
ample.addEventListener("keydown",	fAMLFocus_onKeyDown,	false);
