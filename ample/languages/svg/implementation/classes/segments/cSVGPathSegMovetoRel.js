/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

function cSVGPathSegMovetoRel(nX, nY) {
	this.x	= nX;
	this.y	= nY;
};

cSVGPathSegMovetoRel.prototype	= new cSVGPathSeg;

//
cSVGPathSegMovetoRel.prototype.pathSegType	= cSVGPathSeg.PATHSEG_MOVETO_REL;
cSVGPathSegMovetoRel.prototype.pathSegTypeAsLetter	= "m";

// Public Properties
cSVGPathSegMovetoRel.prototype.x	= 0;
cSVGPathSegMovetoRel.prototype.y	= 0;