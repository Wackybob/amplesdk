/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_page	= function(){};
cXULElement_page.prototype	= new cXULElement;
cXULElement_page.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_page.attributes	= {};
cXULElement_page.attributes.orient	= "vertical";
cXULElement_page.attributes.width	= "100%";
cXULElement_page.attributes.height	= "100%";

// Element Renders
cXULElement_page.prototype.$getTagOpen	= function()
{
    return '<div class="xul-page' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '" style="width:100%;height:100%;overflow:hidden;">';
};

// Element Render: close
cXULElement_page.prototype.$getTagClose	= function()
{
    return '</div>';
};

// Register Element with language
oXULNamespace.setElement("page", cXULElement_page);
