/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

function cSVGPathSegClosePath() {

};

cSVGPathSegClosePath.prototype	= new cSVGPathSeg;

//
cSVGPathSegClosePath.prototype.pathSegType	= cSVGPathSeg.PATHSEG_CLOSEPATH;
cSVGPathSegClosePath.prototype.pathSegTypeAsLetter	= "z";

// Public Properties