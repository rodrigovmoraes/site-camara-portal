//function to share content using facebook account
function fbs_click() {
   var u = location.href;
   window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(u),'sharer','toolbar=0,status=0,width=626,height=436');
}
