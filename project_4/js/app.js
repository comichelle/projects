//Creating a global variable app
var weatherTrends = {};

//Shopstyle PID
weatherTrends.key = 'uid2225-38810415-14';

// weatherUnder.key = "9f8b7656a3bd0886";
weatherTrends.apiUrl = "http://api.wunderground.com/api/9f8b7656a3bd0886/conditions/q/";

// weatherTrends.itemsMen = [];
// weatherTrends.itemsFemale = [];
weatherTrends.temp_c = 0;
var temp = 0;
var gender = '';

/////////////////////////////////////////
//Initialize
////////////////////////////////////////


weatherTrends.init = function() {  
	// this.getWeather();
	this.events();
};


/////////////////////////////////////////
//Arrow Down button
////////////////////////////////////////

$('.btn').on('click', function(b) {
	$('html, body').animate({
          scrollTop: $("#gender__scroll").offset().top
        }, 1000);
});


/////////////////////////////////////////
//Top button and reset app
////////////////////////////////////////
$('.top__btn').on('click', function(b) {
	$('html, body').animate({
          scrollTop: $("#gender__scroll").offset().top
        }, 1000);
});



/////////////////////////////////////////
//Drop down list/ Button Submit EVENTS
////////////////////////////////////////

var gender = '';

weatherTrends.events = function() {

	//Calling in the Men's Clothing for button
	$('.buttonMale').on('click', function(m) {
		//weatherTrends.getJacketsMen();
		gender = 'male';
		//set location to display inline for location section to appear
		$('.get__location').show();
		$('.top').show();
		$('html, body').animate({
          scrollTop: $("#location__scroll").offset().top
        }, 1000);
	});

	//Calling in the Women's Clothing for button
	$('.buttonFemale').on('click', function(w) {
		//weatherTrends.getJacketsWomenCold();
		//weatherTrends.getJacketsWomenHot();
		gender = 'female';
		$('.get__location').show();
		$('.top').show();
		$('html, body').animate({
          scrollTop: $("#location__scroll").offset().top
        }, 1000);
	});


	//Calling in the Current weather in selected country/state and city
	$('form').on('submit', function(e) {
		e.preventDefault();
		let usersProvince = $('#provinces').val();
		let userCity = $('.city__input').val();
		weatherTrends.getWeather(usersProvince, userCity);
		$('.results').show();
		$('.clear').empty();
		$('form').get(0).reset();
		// $('.clothing__desc').empty();
		$('html, body').animate({
          scrollTop: $("#results__scroll").offset().top
        }, 1000);
	});
	
};







/***********************************************
 WEATHER START
 **********************************************/

/////////////////////////////////////////
//Get Current Weather in Specified City
////////////////////////////////////////


weatherTrends.getWeather = function(usersProvince, userCity) {
	// make an ajax request to get the current weather for Toronto
	$.ajax({
		url: weatherTrends.apiUrl + usersProvince + '/'+ userCity + '.json',
		method: 'GET',
		dataType: 'json'
	}).then(function(data) {
		// console.log(data);
		//current_observation is name of array
		var weatherInfo = data.current_observation; 
		weatherTrends.displayWeather(weatherInfo);
		temp = weatherInfo.temp_c;
		
		if(gender === 'male'){
			weatherTrends.getJacketsMen();
			
		}else{ 
			// console.log(temp);
			weatherTrends.getJacketsWomen();
		}
	}) 
};



/////////////////////////////////////////
//Display Weather
////////////////////////////////////////

weatherTrends.displayWeather = (weatherInfo) => {
	// console.log(weatherInfo);
	$('.weather__icon').attr('src', weatherInfo.icon_url);
	$('.weather__string').text(weatherInfo.weather);
	$('.city__name').text(weatherInfo.display_location.city);
	$('.date__time').text(weatherInfo.observation_time);
	$('.temp__c').text(weatherInfo.temp_c);
	weatherTrends.temp_c = weatherInfo.temp_c;
};




/***********************************************
 COATS START
 **********************************************/


 ////////////////////////////////////////
//Get Mens Jackets
////////////////////////////////////////

//Get the information for the Men's Jackets
weatherTrends.getJacketsMen = function() {
	$.ajax({
		url: 'http://api.shopstyle.com/api/v2/products',
		method: 'GET',
		dataType: 'json',
		data: {
			pid: weatherTrends.key,
			format: 'json',
			cat: 'mens-outerwear',
			limit: 100
		}
	}).then(function(results) {
		// console.log(results.products[46]); 
		// COLD  weather jacket
		var cold = results.products[38];
		// COOL  weather jacket
		var cool = results.products[5];
		// WARM  weather jacket
		var warm = results.products[47];
		// HOT  weather jacket
		var hot = results.products[6];
		//RAIN weather jacket
		// var rain = results.products[16(rain),13,,37,38(winter)];

		//if certain weather show certain jacket 
		if(temp <= -5) {	
			var coldMenImage = $('<img>').attr('src','https://img.shopstyle-cdn.com/pim/f3/6b/f36b05ec97454a8f43ed3c6c19a7d146_best.jpg');
			$('.clothing').append(coldMenImage);
		} else if (temp >= -4 && temp <= 14) {
			var coolMenImage = $('<img>').attr('src','https://img.shopstyle-cdn.com/pim/ba/b9/bab9ede616301647abf4e5aa887b31c4_best.jpg');
			$('.clothing').append(coolMenImage);
		} else if (temp >= 15 && temp <= 24) {
			var warmMenImage = $('<img>').attr('src','https://img.shopstyle-cdn.com/pim/c5/6b/c56b1e45a928f58d1274464dd4358d49_best.jpg');
			$('.clothing').append(warmMenImage);
		} else if (temp >= 25) {
			var hotMenImage = $('<img>').attr('src','https://img.shopstyle-cdn.com/pim/9a/90/9a9093d1d1eb83cc9937f2ddafd8bb35_best.jpg');
			$('.clothing').append(hotMenImage);
		}
	});
};


////////////////////////////////////////
//Get Women's Jackets
////////////////////////////////////////


//Get the information for the WARM, COOL, AND COLD Women's Jackets 
weatherTrends.getJacketsWomen = function() {
	$.ajax ({
		url: 'http://api.shopstyle.com/api/v2/products',
		method: 'GET',
		dataType: 'json',
		data: {
			pid: weatherTrends.key,
			format: 'json',
			cat: 'womens-outerwear',
			limit: 100
		}
	}).then(function(results) {
		$('.clothing').empty("");
		// console.log(results.products[34(rain)/17(cold)/45(cool) /44,19,21(goose)]);
		//COLD weather jacket
		var cold = results.products[19];
		//COOL weather jacket
		var cool = results.products[45];
		//WARM weather jacket
		var warm = results.products[26];
		//RAIN weather jacket
		var rain = results.products[34];

		//if certain weather show certain jacket 
		if(temp <= -5) {	
			var coldWomenImage = $('<img>').attr('src','https://img.shopstyle-cdn.com/pim/74/f6/74f647141c392b43ab56d267f2802077_best.jpg');
			var coldWomenDesc = 'Canada Goose Ladies Trillium Parka'; 
			$('.clothing__desc').append(coldWomenDesc);
			$('.clothing').append(coldWomenImage);
		} else if (temp >= -4 && temp <= 14) {
			var coolWomenImage = $('<img>').attr('src','https://img.shopstyle-cdn.com/pim/ec/4d/ec4d42d0ee3c6dbca4ff00965e27a9d2_best.jpg');
			$('.clothing').append(coolWomenImage);
		} else if (temp >= 15 && temp <= 24) {
			var warmWomenImage = $('<img>').attr('src','https://img.shopstyle-cdn.com/pim/29/2f/292fb69d87638cf362f161ad9108051a_best.jpg');
			$('.clothing').append(warmWomenImage);
		} else if (temp >= 25) {
			var hotWomenImage = $('<img>').attr('src','https://img.shopstyle-cdn.com/pim/30/fe/30febe64ac987f167fd037ab21e7900f_best.jpg');
			var hotWomenDesc = 'Floral Design'; 
			$('.clothing__desc').append(hotWomenDesc);
			$('.clothing').append(hotWomenImage);
		} else {

		}
	});
};



$(function() {
	weatherTrends.init();
});


$(function() {
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});


