$(document).ready(function() {
    "use strict";
    /* -------------------------------------------------------------------------*
    * CALENDAR
    * -------------------------------------------------------------------------*/
    //next events
    var settings = CamaraUtils.camaraConfig('js/config/settings');
    var eventsCalendarUrl = settings.CamaraApi.baseUrlSiteCamaraApi + settings.CamaraApi.eventsCalendarMethodPath;
    var now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    $.get( eventsCalendarUrl, {}, function( data ) {
       var events = data.events

       //map of events indexed by day
       var eventsMap = {};

       var buildDateMapForAgenda =  function(pvents, peventsMap) {
          var i;
          for(i = 0; i < pvents.length; i++) {
             var year = pvents[i].start_date.substr(0, 4);
             var month = pvents[i].start_date.substr(5, 2);
             var day = pvents[i].start_date.substr(8, 2);
             var cdate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
             if (peventsMap[cdate]) {
                peventsMap[cdate].push(pvents[i])
             } else {
                peventsMap[cdate] = [];
                peventsMap[cdate].push(pvents[i])
             }
          }
       };

       //build a map for the next events indexed by day
       buildDateMapForAgenda(events, eventsMap);
       var arrMonthsShort = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Aug", "Set", "Out", "Nov", "Dez"];

       $('#agenda').pickmeup({
         flat: true,
         locale:
          { // Object, that contains localized days of week names and months
             days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
             daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
             daysMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa", "Do"],
             months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
             monthsShort: arrMonthsShort
          },
          formatted: true,
          mode: 'single',
          date:  now,
          render: function(date) {
             var cdate = eventsMap[date];
             if(cdate) {
                return { class_name: 'events-exist' };
             } else {
                return { class_name: 'events-not-exist' };
             }
          },
          change: function () {
             var newDate = $('#agenda').pickmeup('get_date', false);
             var todayEvents = eventsMap[newDate];
             var eventsDay = newDate.getDate();
             var eventsMonth = arrMonthsShort[newDate.getMonth()];
             if(todayEvents) {
                var sHtmlAgendaTitle = 'Eventos do dia ' + eventsDay + '/' + eventsMonth;
                $('#agenda-title').html(sHtmlAgendaTitle);

                var sHtml = '';
                var i;
                for(i = 0; i < todayEvents.length; i++) {
                   var eventId = todayEvents[i].id;
                   var eventDescription = todayEvents[i].title;
                   var eventTimeDescription = todayEvents[i].start_time_description;
                   var eventPlace = todayEvents[i].place;
                   sHtml += '<li>'  +
                            '   <div class="row">'  +
                            '      <div class="col-sm-16  col-md-16 list-item-without-img">'  +
                            '         <h4><a href="javascript:CamaraUtils.openEventCalendar(\'' + eventId + '\');">' + eventDescription + '</a></h4>'  +
                            '         <div class="text-danger sub-info">'  +
                            '            <div class="time"><span class="ion-android-data icon"></span>Início: ' + eventTimeDescription + '</div>'  +
                            (eventPlace ? ('            <div class="place"><span class="ion-location icon"></span>Local: ' + eventPlace + '</div>') : '') +
                            '         </div>'  +
                            '      </div>'  +
                            '   </div>'  +
                            '</li>';
                }
                $('#day_events').html(sHtml);

             }else {
                $('#agenda-title').html('Agenda');
                $('#day_events').html('');
             }
             return true;
          },

       });
    });


   /* -------------------------------------------------------------------------*
    * HOT NEWS
    * -------------------------------------------------------------------------*/
   $('#js-news').ticker();
   // hide the release history when the page loads
   $('#release-wrapper').css('margin-top', '-' + ($('#release-wrapper').height() +
     20) + 'px');
   // show/hide the release history on click
   $('a[href="#release-history"]').toggle(function() {
     $('#release-wrapper').animate({
       marginTop: '0px'
     }, 600, 'linear');
   }, function() {
     $('#release-wrapper').animate({
       marginTop: '-' + ($('#release-wrapper').height() + 20) +
         'px'
     }, 600, 'linear');
   });
   $('#download a').mousedown(function() {
     _gaq.push(['_trackEvent', 'download-button', 'clicked'])
   });

   /* -------------------------------------------------------------------------*
    * OWL CAROUSEL
    * -------------------------------------------------------------------------*/
   $("#banner-thumbs").owlCarousel({
     autoPlay: true, //Set AutoPlay to 3 seconds
     navigation: false,
     stopOnHover: true,
     pagination: false,
     items: 4,
     itemsDesktop: [1199,
       4
     ],
     itemsDesktopSmall: [
       979, 3
     ],
     itemsTablet: [768, 3],
     itemsMobile: [479, 1]
   });

   $("#vid-thumbs").owlCarousel({
     navigation: false,
     pagination: true,
     slideSpeed: 300,
     paginationSpeed: 400,
     singleItem: true,
   });
   $("#owl-lifestyle").owlCarousel({
     autoPlay: false, //Set AutoPlay to 3 seconds
     navigation: true,
     pagination: false,
     items: 3,
     itemsDesktop: [1199,
       3
     ],
     itemsDesktopSmall: [
       979, 2
     ],
     itemsTablet: [768, 2],
     itemsMobile: [479, 1],
   });
   $("#owl-blog").owlCarousel({
     navigation: true,
     pagination: false,
     slideSpeed: 300,
     paginationSpeed: 400,
     singleItem: true,
   });

   var time = 10; // time in seconds
   var $progressBar,
     $bar,
     $elem,
     isPause,
     tick,
     percentTime;
   var rotativeHeadlines = $("#rotativeHeadlines");
   var rotativeHeadlinesSlider = $("#rotativeHeadlinesSlider");
   rotativeHeadlines.owlCarousel({
     autoPlay: true,
     singleItem: true,
     stopOnHover : true,
     slideSpeed: 5000,
     navigation: true,
     pagination: false,
     transitionStyle: "fadeUp",
     afterAction: syncPosition,
     responsiveRefreshRate: 200,
     afterInit: progressBar,
     afterMove: moved,
     startDragging: pauseOnDragging
   });
   rotativeHeadlinesSlider.owlCarousel({
     items: 4,
     itemsDesktop: [1199,4],
     itemsDesktopSmall: [979, 3],
     itemsTablet: [768, 3],
     itemsMobile: [479, 3],
     pagination: false,
     responsiveRefreshRate: 100,
     afterInit: function(el) {
       el.find(".owl-item").eq(0).addClass("synced");
     }
   });

   function syncPosition(el) {
     var current = this.currentItem;
     $("#rotativeHeadlinesSlider").find(".owl-item").removeClass("synced").eq(current).addClass(
       "synced")
     if ($("#rotativeHeadlinesSlider").data("owlCarousel") !== undefined) {
       center(current)
     }
   }
   $("#rotativeHeadlinesSlider").on("click", ".owl-item", function(e) {
     e.preventDefault();
     var number = $(this).data("owlItem");
     rotativeHeadlines.trigger("owl.goTo", number);
   });

   function center(number) {
       var rotativeHeadlinesSliderVisible = rotativeHeadlinesSlider.data("owlCarousel").owl.visibleItems;
       var num = number;
       var found = false;
       for (var i in rotativeHeadlinesSliderVisible) {
         if (num === rotativeHeadlinesSliderVisible[i]) {
           var found = true;
         }
       }
       if (found === false) {
         if (num > rotativeHeadlinesSliderVisible[rotativeHeadlinesSliderVisible.length - 1]) {
           rotativeHeadlinesSlider.trigger("owl.goTo", num - rotativeHeadlinesSliderVisible.length + 2)
         } else {
           if (num - 1 === -1) {
             num = 0;
           }
           rotativeHeadlinesSlider.trigger("owl.goTo", num);
         }
       } else if (num === rotativeHeadlinesSliderVisible[rotativeHeadlinesSliderVisible.length - 1]) {
         rotativeHeadlinesSlider.trigger("owl.goTo", rotativeHeadlinesSliderVisible[1])
       } else if (num === rotativeHeadlinesSliderVisible[0]) {
         rotativeHeadlinesSlider.trigger("owl.goTo", num - 1)
       }
     }
     //Init progressBar where elem is $("#owl-demo")
   function progressBar(elem) {
       $elem = elem;
       //build progress bar elements
       buildProgressBar();
       //start counting
       start();
     }
     //create div#progressBar and div#bar then prepend to $("#owl-demo")
   function buildProgressBar() {
     $progressBar = $("<div>", {
       id: "progressBar"
     });
     $bar = $("<div>", {
       id: "bar"
     });
     $progressBar.append($bar).prependTo($elem);
   }

   function start() {
     //reset timer
     percentTime = 0;
     isPause = false;
     //run interval every 0.01 second
     //tick = setInterval(interval, 10);
   };

   function interval() {
       if (isPause === false) {
         percentTime += 1 / time;
         $bar.css({
           width: percentTime + "%"
         });
         //if percentTime is equal or greater than 100
         if (percentTime >= 100) {
           //slide to next item
           $elem.trigger('owl.next')
         }
       }
     }
     //pause while dragging
   function pauseOnDragging() {
       isPause = true;
     }
     //moved callback
   function moved() {
       //clear interval
       clearTimeout(tick);
       //start again
       start();
     }
   //pause on mouseover
   $elem.on('mouseover', function() {
     isPause = true;
   });
   $elem.on('mouseout', function() {
     isPause = false;
   });
});
