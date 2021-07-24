const getLists = "https://localhost:44395/api/boards/6089796c27952b1ac618b338/lists";
const getCards = "https://localhost:44395/api/lists/";
function updateListSortables() {
  $(".sortable").sortable({
    connectWith: ".sortable",
    items: ":not(.nodrag)",
    placeholder: "sortable-placeholder",
    change: function () {
      var list = $(this).closest('.sortable');
      var anchorBottom = $(list).find('.anchorBottom');
      $(list).append($(anchorBottom).detach());
    }
  });

  // key listener to add new list items
  $('input[name="newlistitem"]').unbind().keyup(function (event) {
    if (event.key == "Enter" || event.keycode == "13") {
      $(this).before('<div class="card-item">' + $(this).val() + '</div>');
      $(this).val('');
    }
  });
}

async function getApi(url) {

  // Storing response
  const response = await fetch(url);

  // Storing data in form of JSON
  var data = await response.json();
  // show lists
  showLists(data);
  return data;
}

function showLists(data) {
  let lst = "";
  for (var i = 0; i < data.length; i++) {
    lst += '<div id="' + data[i]["id"] + '" class="sortable"><h5 class="nodrag list-header">' + data[i]["name"] + '</h5>';
    let cards = "";
    // NEED TO FIX IT
    // fetch(getCards + data[i]["id"] + "/cards")
    //   .then(response => response.json())
    //   .then(dt => {
    //     for (let i = 0; i < dt.length; i++) {
    //       cards += '<div class="card-item">' + dt[i]["name"] + '</div>';
    //     }
    //     console.log(dt) // Prints result from `response.json()` in getRequest
    //     console.log(cards);
    //   })
    //   .catch(error => console.error(error));
    
    lst += cards;
    lst += '<input type="text" class="nodrag anchorBottom newlistitem" name="newlistitem" placeholder="New List Item..." /></div>';
  }
  newlstinput = $(".newlistinput");
  newlstinput.before(lst);
}

$(document).ready(function () {
  getApi(getLists);
  $(".oversort").sortable(
    {
      items: ":not(.nodrag)", placeholder: "sortable-placeholder"
    }
  );

  // key listener to add new lists
  $('input[name="newlistname"]').keyup(function (event) {
    if (event.key == "Enter" || event.keycode == "13") {
      $(this).before('<div class="sortable"><h5 class="nodrag list-header">' + $(this).val() + '</h5><input type="text" class="nodrag anchorBottom newlistitem" name="newlistitem" placeholder="New List Item..." /></div>')
      $(this).val('');
      updateListSortables();

      var oversort = $(this).closest('.oversort');
      // $(oversort).scrollLeft($(oversort).prop("scrollWidth") - $(oversort).width());
    }
  });

});