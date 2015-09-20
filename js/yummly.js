library = {};
arrNames = [];
// each object is {name:.., title:..}

//get all "name"s from a's
function findAllAs(){
    $('.col-md-3').find('a').each(function(){
        var obj = {name: $(this).attr("name"),
                  title: $(this).attr("title")}
        arrNames.push(obj);
    });
}

function getIngredients(){
    
}

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
    // 1) go through each div and get the names, put in array
    findAllAs();
    // 2) go through names in array, get API search results
    // 3) find best search result, put that id into array
    window.setTimeout(getAllIds,5000,arrNames);
    // 4) loop through array of id's, do api call on each, add ingredient line to library
    window.setTimeout(getIngredients,10000);
    
//    var a = getSearchResults("cosmopolitan");
    
    $('.thumbnail').click(function(){
		$('.modal-body').empty();
		var title = $(this).parent('a').attr("name");
        var id = $(this).parent('a').attr('title');
		$('.modal-title').html(title);
		var newHtml = (
			"<section class='slider-modal'>"+
            "<div class='container-modal' id='testModal'>"+
            "<div style='display: inline-block;'>"+
			getCaption(id) +
			"</div>" + "</section>"
			);
		$(newHtml).appendTo('.modal-body');

		$('#myModal').modal({show:true});
//        $(".grid").css("position","fixed");
        
		currentIndex = 0,
		items = $('#testModal div'),
  		itemAmt = items.length;
    });
    
	$('.close').click(function(){
        $('.modal-dialog').scrollTop(0);
		$(".grid").css("position","relative");
	});
	
	$('#close-btn-bottom').click(function(){
        $('.modal-dialog').scrollTop(0);
		$(".grid").css("position","relative");
	});

    });
    
function getAllIds(array){
    for (i=0;i<array.length;i++){
        var name = array[i].name; //keyword for search
        var title = array[i].title; //actual title for identifying div id
        getSearchResults(name,title);
    }
}
    
function getSearchResults(keyword,title){
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
                var obj = {rating: item.rating,
                          id: item.id, 
                          title: title};
                searchResults.push(obj);
            })
        addToLibrary(searchResults);
        }
})
};

//put results from api to library, should be ingredient lines
function addToLibrary(searchResults){
    sortResults(searchResults, function(bestMatch){
        var id = bestMatch.id;
        //get the ingredient lines for the best one
//        var name = i.title;
//        library[name] = i;
        //add ingredient field to bestMatch, an object,
        //then add to library
        $.ajax({
            url: "https://api.yummly.com/v1/api/recipe/"+id+"?_app_id=07f4518d&_app_key=e01c2ebffc266def77849ec9d8417da8",
            type: "GET",
//    data: {
//        q:keyword,
//    },
            dataType: "json",
            success: function(json){
                var ingLines = json.ingredientLines;
                bestMatch.ingr = ingLines;
                library[bestMatch.title] = bestMatch;
                }
        });
    });
}


//find the best result
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

//find ingredients in library and return lines of ingredients
function getCaption(id){
    return library[id].ingr;
}
