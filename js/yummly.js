$( document ).ready(function() {
    $( ".col-md-3" ).hover(
  function() {
    $(this).find("img").addClass( "hover" );
    $(this).find(".center-block").css("visibility", "visible");
  }, function() {
    $(this).find("img").removeClass( "hover" );
    $(this).find(".center-block").css("visibility", "hidden");
  }
);
});
 
