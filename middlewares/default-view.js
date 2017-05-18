/*****************************************************************************
*************************** DEPENDENCIES SECTION *****************************
******************************* (LIBS MODULES) *******************************
/*****************************************************************************/
var fs = require('fs');

/**
 * This middleware check if there is a html file in the view
 * folder corresponding to the file in the path of request. If the file exists in
 * the views folder, it renders the file applying the default view layout
 * @param {string} viewsFolder - the path of the folder containing the views files
 */
module.exports = function(viewsFolder) {

   return function(req, res, next) {
      //chech only html files
      if(req.path.endsWith('.html'))
      {
         //does the file exist ?
         fs.stat(viewsFolder + req.path, function(err, stats) {
            if(!err) {
               //render the file applying the layout

               //to pass the file to method render it's needed to
               //remove the / character from the path if it exists
               if(req.path.length > 0 && req.path[0] === '/') {
                  res.render(req.path.substring(1));
               }else {
                  res.render(req.path);
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
