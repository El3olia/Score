$(document).ready(function () {
    // Fetch data from Scores.json
    $.getJSON('Scores.json', function (data) {
        // Find the group with Id = 9
        const group = data.find(item => item.Id === 9);

        if (group) {
            // Sort Servants by points in descending order
            group.Servants.sort((a, b) => {
                const pointsA = parseInt(a.Points[1], 10) || 0; // Convert points to integer
                const pointsB = parseInt(b.Points[1], 10) || 0;
                return pointsB - pointsA; // Sort in descending order
            });

            // Get the table element in the DOM
            const $table = $('#leaderboard table');
            $table.empty(); // Clear existing rows

            // Variables to manage ranking with ties
            let displayedRank = 1; // The actual rank displayed
            let lastPoints = null; // Track points of the last ranked servant

            // Render sorted data into the table
            group.Servants.forEach((servant, index) => {
                const name = servant.Points[0]; // Name is assumed to be the first item in Points array
                const points = parseInt(servant.Points[1], 10) || 0; // Convert points to integer

                // Update rank only if the current points differ from the last entry's points
                if (points !== lastPoints) {
                    displayedRank = displayedRank + 1; // Update rank to the current position + 1
                }

                // Medal image based on displayedRank
                const medalImage = displayedRank === 1 ? './Images/Medals/gold.png' :
                                  displayedRank === 2 ? './Images/Medals/silver.png' :
                                  displayedRank === 3 ? './Images/Medals/bronze.png' : null;

                // Build the row HTML
                const $row = $('<tr>');
                $row.append(`<td class="number">${displayedRank}</td>`);
                $row.append(`<td class="name">${name}</td>`);

                if (medalImage) {
                    $row.append(`<td class="points"><img class="gold-medal" src="${medalImage}" alt="medal" /> ${points}</td>`);
                } else {
                    $row.append(`<td class="points">${points}</td>`);
                }

                // Append the row to the table
                $table.append($row);

                // Update tracking variables
                lastPoints = points;
            });
        } else {
            console.error("Group with Id 9 not found.");
        }
    }).fail(function () {
        console.error("Could not load JSON data.");
    });
});

setTimeout(function start (){
  
  $('.bar').each(function(i){  
    var $bar = $(this);
    $(this).append('<span class="count"></span>')
    setTimeout(function(){
      $bar.css('width', $bar.attr('data-percent'));      
    }, i*100);
  });

$('.count').each(function () {
    $(this).prop('Counter',0).animate({
        Counter: $(this).parent('.bar').attr('data-percent')
    }, {
        duration: 2000,
        easing: 'swing',
        step: function (now) {
            $(this).text(Math.ceil(now) +'%');
        }
    });
});

}, 500);
var leaderboard_iso = null;
var local_storage_available = false;
var data            = [];
var emojis          = "🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐵 🙈 🙉 🙊 🐒 🐔 🐧 🐦 🐤 🐣 🐥 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🐛 🦋 🐌 🐞 🐜 🦟 🦗 🕷 🕸 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐡 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🐅 🐆 🦓 🦍 🦧 🐘 🦛 🦏 🐪 🐫 🦒 🦘 🐃 🐂 🐄 🐎 🐖 🐏 🐑 🦙 🐐 🦌 🐕 🐩 🦮 🐕‍🦺 🐈 🐓 🦃 🦚 🦜 🦢 🦩 🐇 🦝 🦨 🦡 🦦 🦥 🐁 🐀 🦔".split(" ");

var test_data = `🐒,Green Monkey,14
🦎,Orange Iguana,13
🦜,Purple Parrot,12
🐟,Blue Barracuda,10
🐆,Red Jaguar,9
🐍,Silver Snake,8`;

var template        = `
<li class="person">
	<p class="icon">{{icon}}</p>
	<p class="nickname">{{nickname}}</p>
	<p class="score">{{score}}</p>
	<ul class="point-btns">
		<li class="point-btn point-btn--5" data-points-value="-5">-5</li>
		<li class="point-btn point-btn--2" data-points-value="-2">-2</li>
		<li class="point-btn point-btn--1" data-points-value="-1">-1</li>
		<li class="point-btn point-btn-1" data-points-value="1">+1</li>
		<li class="point-btn point-btn-2" data-points-value="2">+2</li>
		<li class="point-btn point-btn-5" data-points-value="5">+5</li>
	</ul>
</li>
`;

$( document ).ready(function() {

	// check if local storage is available
	// updates `local_storage_available` variable
	// test_local_storage(); // can't use local storage at codepen, chrome fails

	// some button handlers...
	initialize_basic_btn_listeners();


	// intialize isotope plugin
	leaderboard_iso = $('.leaderboard').isotope({
		// options
		itemSelector: '.person',
		layoutMode: 'vertical',
		getSortData: {
			score: '.score parseInt'
		}
	});
	

	// 1st step:
	// check for data in "URLSearchParams"
	// If the url has data in the query string
	// give priority to this data
	url = new URL((window.location.href));
	query_string = url.searchParams.get("q");
	if (query_string != null) {
		decoded_str = decodeURIComponent(window.atob(query_string));
		data = JSON.parse(decoded_str);

		// save data to local storage
		// refresh without data in the url
		if (local_storage_available) {
			localStorage.setItem('leaderboard_data', JSON.stringify(data));
			window.location.href = [location.protocol, '//', location.host, location.pathname].join('');
		}
		return;
	}

	// 2nd step:
	// check for data in the local storage
	if (local_storage_available) {
		data = JSON.parse(localStorage.getItem('leaderboard_data'));
		
		// add data to the UI
		if (data != null) {
			build_leaderboard();
		} else {
			data = [];
		}
	}
  
  //  codepen example
  $("#tarea").val(test_data);
  $('.edit-popup .ok').trigger('click');
  $("body").toggleClass("show-edit");
  
  $('.person .score').last().parent().toggleClass("open");
  
});

function sort_leaderboard(){
	leaderboard_iso.isotope( 'updateSortData');
	leaderboard_iso.isotope({ sortBy: "score", sortAscending : false });
}



function initialize_basic_btn_listeners() {
	
	// adding a new person listeners
	//
	$('.add-person').on('click',function(){
		scroll_to_top_smooth();
		$("body").toggleClass("show-add-person");
		// pick random animal emoji and clear form
		$('#rand-icon').val(emojis[getRandomInt(0,emojis.length)]);
		$('#nickname').val("");
		$('#score').val("");
	});

	$('.add-person-popup .cancel').on('click',function(){
		$("body").toggleClass("show-add-person");
	});

	$('.add-person-popup .ok').on('click',function(){
		var new_person = {
			icon:    $('#rand-icon').val(),
			nickname: $('#nickname').val(),
			score:    $('#score').val()
		};
		data.push(new_person);
		build_leaderboard();
		$("body").toggleClass("show-add-person");
	});


	// editing
	// 
	$('.edit').on('click',function(){
		scroll_to_top_smooth();
		$("body").toggleClass("show-edit");
		// load data to textarea
		data_str = "";
		data.forEach(function(person) {
			data_str = data_str + (person.icon + "," + person.nickname + "," + person.score + "\n");
		});
		$("#tarea").val(data_str);
	});

	$('.edit-popup .cancel').on('click',function(){
		$("body").toggleClass("show-edit");
	});

	$('.edit-popup .ok').on('click',function(){
		read_data_from_text( $('#tarea').val().trim() );
		build_leaderboard();
		$("body").toggleClass("show-edit");
	});


	// link sharing
	// 
	$('.link').on('click',function(){
		scroll_to_top_smooth();
		$("body").toggleClass("show-link");
		// load data to textarea
		$("#tarea-link").val(generate_share_link());
		$('#tarea-link').select();
	});

	$('.link-popup .close').on('click',function(){
		$("body").toggleClass("show-link");
	});
}



function initialize_person_btn_listeners() {
	$('.person .score').on('click',function(){
		$(this).parent().toggleClass("open");
	});

	// +/- points buttons
	// also updates data[]
	$('.point-btn').on('click', async function(event){
		event.stopPropagation();
		var $li            = $(this).parent().parent();
		var $score         = $li.find('.score');
		var current_score  = parseInt( $score.text() );
		var points_clicked = parseInt($(this).attr('data-points-value'));
		var target_score   = current_score + points_clicked;

		// update UI
		if (target_score > current_score) {
			for (i=current_score ; i<=target_score ; i++) {
				$score.text(i);
				await sleep(150);
			}
		} else {
			for (i=current_score ; i>=target_score ; i--) {
				$score.text(i);
				await sleep(150);
			}
		}
		sort_leaderboard();

		// update data[]
		data.forEach(function(person) {
			if ((person.nickname == $li.find('.nickname').text()) && (person.icon == $li.find('.icon').text())) {
				person.score = target_score;
			}
		})
		// save data to local storage
		// localStorage.setItem('leaderboard_data', JSON.stringify(data));
	});
}

function build_leaderboard() {
	// remove all current list items
	$('.leaderboard').empty();

	if (data.length == 0) return;

	// append all person-list-items
	data.forEach(function(person) {
		$('.leaderboard').append(
			template.replace(/{{icon}}/gm,person.icon)
					.replace(/{{nickname}}/gm,person.nickname)
					.replace(/{{score}}/gm,person.score));
	})

	// reload isotope
	leaderboard_iso.isotope('reloadItems');

	// save data to local storage
	// localStorage.setItem('leaderboard_data', JSON.stringify(data));

	// add button listeners for score +/-
	initialize_person_btn_listeners();
	sort_leaderboard();
}

function read_data_from_text(data_str) {
	data = [];
	if (data_str == "") {return;}
	var lines = data_str.split('\n');
	lines.forEach(function(line) {
		tokens = line.split(',');
		data.push({
			icon:     tokens[0],
			nickname: tokens[1],
			score:    tokens[2]
		});
	});
}





function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate_share_link() {
	// encode to BASE64 the data object
	base64_str = btoa(encodeURIComponent(JSON.stringify(data)));

	share_url = new URL( [location.protocol, '//', location.host, location.pathname].join('') );
	share_url.searchParams.append("q",base64_str)
	return share_url.href;
}

function scroll_to_top_smooth() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
}

function test_local_storage(){
    var test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        local_storage_available = true;
    } catch(e) {
        local_storage_available = false;
    }
}
