/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
var fs = require('fs');

/**
 * defaultViewMiddleware: This middleware check if there is a html file in the view
 * folder corresponding to the file in the path of request. If the file exists in
 * the views folder, it renders the file applying the default view layout
 * @param {string} viewsFolder - the path of the folder containing the views files
 */
module.exports = function(viewsFolder) {

   return function(req, res, next) {
      var reqPath = req.path ? req.path.trim() : "";

      //chech only html files
      if(reqPath.endsWith('.html')) {
         //does the file exist ?
         fs.stat(viewsFolder + reqPath, function(err, stats) {
            if(!err) {
               //render the file applying the layout

               //to pass the file to method render it's needed to
               //remove the / character from the path if it exists
               if(reqPath.length > 0 && reqPath[0] === '/') {
                  res.render(reqPath.substring(1));
               }else {
                  res.render(reqPath);
               }
            }else {
               next(); //file doesn't exist
            }
         });
      }else {
         next(); //not a html file
      }
   }

}

//for test purposes
module.exports._setFs = function(_fs) {
   fs = _fs;
}
