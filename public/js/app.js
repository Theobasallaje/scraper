// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].user + "</p>");
    // $("#articles").append(`<p data-id='${data[i]._id}'>Title: ${data[i].title}<br /> Link: ${data[i].link}<br /> User: ${data[i].user}</p>`);
    $("#articles").append(`
    <br/><br/>
    <div class="w3-container">
      <div class="w3-card-4" style="width:5=100%;">
        <header class="w3-container w3-blue">
          <h1 data-id='${data[i]._id}'>${data[i].title}</h1>
        </header>
      <div class="w3-container">
        <p><a href="${data[i].link}">Go to the Article!</a></p>
      </div>
      <footer class="w3-container w3-blue">
        <h3>By: ${data[i].user}</h3>
      </footer>
  </div>
</div>
`
    );
  }
  // console.log(data[0]);
});

//notes id is in data.note._id -- data and notes are arrays


// Whenever someone clicks a p tag
$(document).on("click", "h1", function () {
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
      $("#header").append(`<h2 id='commentTitle'>Comments for ${data.title}</h2>`);
      // // An input to enter a new title
      // $("#notes").append("<input id='titleinput' name='title' >");
      if (data.note) {
        for (var i = 0; i < data.note.length; i++) {
          $("#comments").append(`<div data-id="${data.note[i]._id}" article-id="${thisId}" class="commentData" id="comment${data.note[i]._id}"><h3>${data.note[i].body}</h3> 
                                <button data-id="${data.note[i]._id}" article-id="${thisId}" id='deletenote'>Delete
                                </button></div>`); // adding delete button here
        }
      }
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<div id='commentButtonDiv'><button data-id='" + data._id + "' id='savenote'>Add Comment</button></div>");
      // $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Comment</button>");
      // If there's a note in the article
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  var articleId = $(this).attr("data-id");
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
      $("#comments").append(`<div data-id="${thisId}" article-id="${articleId}" class="commentData" id="comment${thisId}"><h3>${$("#bodyinput").val()}</h3> 
      <button data-id="${thisId}" article-id="${articleId}" id='deletenote'>Delete
      </button></div>`);
      $("#bodyinput").val("");
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
});

$(document).on("click", "#deletenote", function () {
  var commentId = $(this).attr("data-id");
  // var deleteId = $(this).attr("delete-id");
  var articleId = $(this).attr("article-id");
  var thisId = $(this).attr("data-id");
  // $.ajax({
  //   type: "PUT",
  //   url: "/comments/" + articleId + "/note/" + commentId
  // })
  //   .then(function () {
  //     $(`#comment${commentId}`).empty();
  //     $.ajax({
  //       method: "GET",
  //       url: "/articles/" + thisId
  //     })
  //       .then(function (data) {
  //         console.log(thisId);
  //         if (data.note) {
  //           for (var i = 0; i < data.note.length; i++) {
  //             $("#comments").append(`<div data-id="${data.note[i]._id}" article-id="${thisId}" class="commentData" id="comment${data.note[i]._id}"><p>${data.note[i].body}</p> 
  //                                   <button data-id="${data.note[i]._id}" article-id="${thisId}" id='deletenote'>Delete
  //                                   </button></div>`); // adding delete button here
  //           }
  //         }
  //       });
  //   });
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function (data) {
      console.log(thisId);

    });
  $.ajax({
    type: "PUT",
    url: "/comments/" + articleId + "/note/" + commentId
  })
    .then(function () {
      $(`#comment${commentId}`).empty();
    });
  // if (data.note) {
  //   for (var i = 0; i < data.note.length; i++) {
  //     $("#comments").append(`<div data-id="${data.note[i]._id}" article-id="${thisId}" class="commentData" id="comment${data.note[i]._id}"><p>${data.note[i].body}</p> 
  //                           <button data-id="${data.note[i]._id}" article-id="${thisId}" id='deletenote'>Delete
  //                           </button></div>`); // adding delete button here
  //   }
  // }
});
