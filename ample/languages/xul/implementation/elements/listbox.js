/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listbox	= function()
{
    // Collections
    this.items  = new AMLNodeList;
	this.selectedItems	= new AMLNodeList;
};
cXULElement_listbox.prototype    = new cXULSelectElement;
// Accessibility
cXULElement_listbox.prototype.tabIndex	= 0;
cXULElement_listbox.prototype.$selectable	= false;

//
cXULElement_listbox.prototype.head	= null; // Reference to oXULElement_listhead
cXULElement_listbox.prototype.body	= null; // Reference to oXULElement_listitems

// Public Methods
cXULElement_listbox.prototype.setAttribute   = function(sName, sValue)
{
    if (sName == "disabled")
    {
        // TODO
    }
    else
    if (sName == "type")
    {
        // TODO
        // walk through the table and change command elements
    }
    else
    if (sName == "seltype")
    {

    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_listbox.prototype.sort   = function(nCell, bDir)
{
    // correct for different types
    if (this.attributes["type"] != "radio" && this.attributes["type"] != "checkbox")
        nCell++;

    if (this.items.length)
    {
		var aElements	= [];
		for (var nIndex = 0; nIndex < this.items.length; nIndex++)
			aElements.push(this.items[nIndex]);
		aElements.sort(function(oElement1, oElement2){return oElement1.cells[nCell-1].attributes["label"] > oElement2.cells[nCell-1].attributes["label"] ? bDir ? 1 :-1 : oElement1.cells[nCell-1].attributes["label"] == oElement2.cells[nCell-1].attributes["label"] ? 0 : bDir ?-1 : 1;});
		this.items	= new AMLNodeList;
		for (var nIndex = 0; nIndex < aElements.length; nIndex++)
			this.items.$add(aElements[nIndex]);

        var oElementDOM	= this.body.$getContainer("gateway");
        for (var nIndex = 0; nIndex < this.items.length; nIndex++)
        {
            oElementDOM.appendChild(this.items[nIndex].$getContainer());
            if (this.items[nIndex].attributes["selected"] == "true")
                this.items[nIndex].setAttribute("selected", "true");
        }
    }
    // Move focus selection
    if (this.currentItem)
    	this.currentItem.focus();
};

// Class Events Handlers
cXULElement_listbox.handlers	= {
	"keydown":	function(oEvent) {
	    if (this.currentItem)
	    {
	        if (oEvent.keyIdentifier == "Up")
	        {
	            // Key: Up
	            var nIndex  = this.selectedItems[this.selectedItems.length-1].$getContainer().rowIndex;
	            if (nIndex > 0)
	            {
	                if (oEvent.shiftKey)
	                {
	                    // Jump over the only selected item
	                    if (this.selectedItems.length > 1)
	                        if (this.currentItem.$getContainer().rowIndex > this.selectedItems[0].$getContainer().rowIndex)
	                            nIndex++;

	                    this.toggleItemSelection(this.items[nIndex-1]);
	                }
	                else
	                    this.selectItem(this.items[nIndex-1]);

	                // Scroll to item if not visible
	                this.scrollToIndex(nIndex-1);
	            }

	            // Forbid vertical scrolling
	            oEvent.preventDefault();
	        }
	        else
	        if (oEvent.keyIdentifier == "Down")
	        {
	            // Key: Down
	            var nIndex  = this.selectedItems[this.selectedItems.length-1].$getContainer().rowIndex;
	            if (nIndex < this.items.length-1)
	            {
	                if (oEvent.shiftKey)
	                {
	                    // Jump over the only selected item
	                    if (this.selectedItems.length > 1)
	                        if (this.currentItem.$getContainer().rowIndex < this.selectedItems[0].$getContainer().rowIndex)
	                            nIndex--;

	                    this.toggleItemSelection(this.items[nIndex+1]);
	                }
	                else
	                    this.selectItem(this.items[nIndex+1]);

	                // Scroll to item if not visible
	                this.scrollToIndex(nIndex+1);
	            }

	            // Forbid vertical scrolling
	            oEvent.preventDefault();
	        }
    	}
	}
};

// Element Render: open
cXULElement_listbox.prototype.$getTagOpen		= function()
{
    return '<table class="xul-listbox' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '" cellpadding="0" cellspacing="0" border="0" height="' +(this.attributes["height"] ? this.attributes["height"] : '100%')+ '" width="' +(this.attributes["width"] ? this.attributes["width"] : '100%')+ '"' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"' : '')+ '>\
    			<tbody class="xul-listbox--gateway">';
};

// Element Render: close
cXULElement_listbox.prototype.$getTagClose	= function()
{
    return 		'</tbody>\
    		</table>';
};

// Register Element with language
oXULNamespace.setElement("listbox", cXULElement_listbox);
