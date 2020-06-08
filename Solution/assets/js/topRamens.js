//A collection of TopRamens per year
var topRamens = {};
var currentYear = '';

//Retrieve the topRamen Data
$.ajax({
  type: 'GET',
  url: 'http://starlord.hackerearth.com/TopRamen',
  success: function(data) {
	processData(data);
    
  },
  error: function() {
	//If the URL goes down, The dataStore kicks in
    console.log(`Data from store!`);
	data = topRamenData;
    processData(data);
  }
});

//==========================Handlers========================

//Click handler on year li's for changing the topRamen data
//corresponding to that year
$('div#years').on('click', 'button', function(event) {
    var text = $(this).text();
    constructRamens(topRamens[text]);

    //Remove active class from all button
    $('div#years button').removeClass('active');
    //Add active class to this button
    $(this).addClass('active');

    //Store the current selected year for search
    currentYear = $(this).text();

    event.stopPropagation();
});

$('button#searchBtn').click(function(event) {
    var val = $('#search').val();
    searchKey(val);
    event.stopPropagation();
});

$('input#search').keypress(function(event) {
    if(event.which === 13) {
        searchKey($(this).val());
    }
    event.stopPropagation();
});

//================FUNCTIONS===================================

//Start processing data
function processData(data) {
	for(var i = 0; i < data.length; i++) {
        var brand = data[i];
        var topTen = brand['Top Ten'];

        //Add each topRamen to the its respective year,
        //if 'Top Ten' property has a value
        if(topTen !== 'NaN') {
            var year = topTen.split(' ')[0];
            var isPresent = Object.keys(topRamens).indexOf(year);
            if(isPresent === -1) {
                topRamens[year] = [];
            }
            addBrand(year, brand);
        }
    }

    //The topRamens of First year in the list
    var brands = null;
    //Create li's for every year
    Object.keys(topRamens).forEach((year) => {
        if(brands == null) {
            brands = topRamens[year];
        }
        $('div#years').append('<button type="button" '
        + 'class="list-group-item list-group-item-action"><strong>'
        + year + '</strong></button>');
    });

    //Make the first button div#years active
    var firstYear = $('div#years button').first();
    firstYear.addClass('active');
    currentYear = firstYear.text();

    //Construct the topRamen details for the first year
    addTopRamens(brands);
}

//Adds the brand at its proper position in sorted array
function addBrand(year, brand) {
    var brands = topRamens[year];
    var bPos = brand['Top Ten'].split(' ')[1];
    bPos = Number(bPos.replace('#', ''));
    var i = 0;
    for(var i = 0; i < brands.length; i++) {
        var b = brands[i];
        var pos = b['Top Ten'].split(' ')[1];
        pos = Number(pos.replace('#', ''));
        if(bPos < pos)
            break;
    }
    brands.splice(i, 0, brand);
    topRamens[year] = brands;
}

//Construts the topRamen data for every topRamen for a year
function constructRamens(brands) {
    $('div#listDiv').children().fadeOut(1000, function() {
        $(this).remove();

        if($('div#listDiv').children().length === 0)
            addTopRamens(brands);
    });
}

function addTopRamens(brands) {
    var ids = [];
    brands.forEach((brand) => {
        var topTen = brand['Top Ten'];
        var place = topTen.split(' ')[1];
        ids.push(place.replace('#', ''));

        $('div#listDiv').append('<div id="' + place.replace('#', '') +'" class="fadeIn col-12 col-md-6 col-lg-3 p-2 mx-2 mb-2 rounded border border-light">'
        + '<h5><strong class="text-danger">Place:</strong> ' + place + '</h4>'
        + '<h5><strong class="text-danger">Brand:</strong> ' + brand['Brand'] + '</h4>'
        + '<h5><strong class="text-danger">Variety:</strong> ' + brand['Variety'] + '</h4>'
        + '<h5><strong class="text-danger">Style:</strong> ' + brand['Style'] + '</h4>'
        + '<h5><strong class="text-danger">Country:</strong> ' + brand['Country'] + '</h4>'
        + '<h5><strong class="text-danger">Stars:</strong> ' + brand['Stars'] + '</h4>'
        + '</div>');
    });

    ids.forEach((id) => {
        $('div#' + id).fadeIn(1000);
    });
}

function searchKey(val) {
    var array = topRamens[currentYear];
    //Remove Highlighted TopRamens
    array.forEach((topRamen) => {
        var place = topRamen['Top Ten'].split(' ')[1];
        $('div' + place).removeClass('d-none');
    });

    if(val === '')
        return;

    //Add Highlighted TopRamens
    array.forEach((topRamen) => {
        var place = topRamen['Top Ten'].split(' ')[1];
        var brand = topRamen['Brand'];
        var variety =  topRamen['Variety'];
        var style = topRamen['Style'];
        var country = topRamen['Country'];
        var stars = topRamen['Stars'];
        
        if(!(brand.indexOf(val) !== -1 || variety.indexOf(val) !== -1
            || style.indexOf(val) !== -1 || country.indexOf(val) !== -1
            || stars == val)) {
            $('div' + place).addClass('d-none');
        }
    });
}