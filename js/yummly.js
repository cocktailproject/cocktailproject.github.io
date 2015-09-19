library = {};

$( document ).ready(function() {
    //add hover states
    $( ".col-md-3" ).hover(
  function() {
    $(this).find("img").addClass( "hover" );
    $(this).find(".center-block").css("visibility", "visible");
  }, function() {
    $(this).find("img").removeClass( "hover" );
    $(this).find(".center-block").css("visibility", "hidden");
  }
);
    
    var a = getSearchResults("cosmopolitan");
    console.log(a);
});
function getSearchResults(keyword){
    //fetch search results from Yummly
    var searchResults = []; //should be a list of objects whose courses match
    $.ajax({
    url: "https://api.yummly.com/v1/api/recipes?_app_id=07f4518d&_app_key=e01c2ebffc266def77849ec9d8417da8",
    type: "GET",
    data: {
        q:keyword,
        allowedCourse:"course^course-Cocktails"
    },
        dataType: "json",
        success: function(json){
            $.each(json.matches, function(i, item){
                var obj = {name: item.recipeName,
                          ingredients: item.ingredients,
                          rating: item.rating};
                searchResults.push(obj);
            })
        addToLibrary(searchResults);
        }
})
}

function addToLibrary(searchResults){
    sortResults(searchResults, function(i){
        var name = i.name;
        library[name] = i.ingredients;
        console.log(library);
    });
}

function sortResults(searchResuts,fn){
    var best = 0; //objects from success async
    for (i = 0; i<searchResuts.length; i++){
        var match = searchResuts[i];
        if (match.rating > best){
            best = match;
        }
    }
    fn(best);
}
