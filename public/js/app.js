// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].user + "</p>");
  }
  // console.log(data[0]);
});

//notes id is in data.note._id -- data and notes are arrays


// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  $("#header").empty();
  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // // The title of the article
      // $("#notes").append("<h2>" + data.title + "</h2>");
      // commenmts section
      $("#header").append(`<h2>Comments for ${data.title}</h2>`);
      // // An input to enter a new title
      // $("#notes").append("<input id='titleinput' name='title' >");
      if (data.note) {
        for (var i = 0; i < data.note.length; i++) {
          $("#comments").append(`<div data-id="${data.note[i]._id}" article-id="${thisId}" class="commentData" id="comment${data.note[i]._id}"><p>${data.note[i].body}</p> 
                                <button data-id="${data.note[i]._id}" article-id="${thisId}" id='deletenote'>Delete
                                </button></div>`); // adding delete button here
        }
      }
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Add Comment</button>");
      // $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Comment</button>");
      // If there's a note in the article
    });
});

// When you click the savenote button
var i = 0;
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  // $("#comments").append(`<p>${$("#bodyinput").val()}</p>`);
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // // Value taken from title input
      // title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      $("#comments").append(`<div data-id="${data.note[i]._id}" article-id="${thisId}" class="commentData" id="comment${data.note[i]._id}"><p>${$("#bodyinput").val()}</p> 
      <button data-id="${data.note[i]._id}" article-id="${thisId}" id='deletenote'>Delete
      </button></div>`);
      // Log the response
      // var data = JSON.stringify(data);
      console.log(data);
      // for (var i=0; i < data.note.length; i++) {
      //   console.log(`data for index ${i} ${$("#bodyinput").val()}`);
      //   // console.log(`data for index ${i} ${(data.note[i].body)}`);
      // }
      // Empty the notes section
      // $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  // $("#titleinput").val("");
  // $("#bodyinput").val("");
  i++;
});

$(document).on("click", "#deletenote", function () {
  var commentId = $(this).attr("data-id");
  // var deleteId = $(this).attr("delete-id");
  var articleId = $(this).attr("article-id");
  $.ajax({
    type: "PUT",
    url: "/comments/" + articleId + "/note/" + commentId
  })
    .then(function (data) {
      $(`#comment${commentId}`).empty();
    });
});
