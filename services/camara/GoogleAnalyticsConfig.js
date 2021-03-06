/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
//...
//..
//.

/*****************************************************************************
****************************** Flickr API Config  ****************************
/*****************************************************************************/
var _trackingID;//Ex: "UA-14397802-1"

/*****************************************************************************
*************************** Private Methods **********************************
/*****************************************************************************/

/*****************************************************************************
************************** Module Setters and Getters*************************
/*****************************************************************************/
module.exports.setTrackingID = function(trackingID) {
   _trackingID = trackingID;
}

module.exports.getTrackingID = function() {
   return _trackingID;
}
