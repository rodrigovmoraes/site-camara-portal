$(document).ready(function() {
    "use strict";

    $('#calendar').fullCalendar({
      defaultView: 'month',
      height: 450,
      editable: true,
      header: {
         left: 'prev,next today',
         center: 'title',
         right: 'month, agendaWeek, agendaDay, listWeek'
      },
      buttonText: {
        listWeek: 'Listagem Semanal'
      },
      locale: 'pt-br',
      firstDay: 1,
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',  'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'],
      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      events: function(start, end, timezone, callback) {
          var startDate = new Date(start);
          var endDate = new Date(end);

          var settings = CamaraUtils.camaraConfig('js/config/settings');
          var eventsCalendarUrl = settings.CamaraApi.baseUrlSiteCamaraApi + settings.CamaraApi.eventsCalendarMethodPath;

          $.get( eventsCalendarUrl, {
             fullCalendarFormat: 'true',
             minDate: CamaraUtils.toUTCISOFormat(startDate),
             maxDate: CamaraUtils.toUTCISOFormat(endDate)
          }, function( data ) {
             var events = data.events
             callback(events);
          });
      },
      eventClick: function(calEvent) {
         CamaraUtils.openEventCalendar(calEvent.id);
      }
    });
});
