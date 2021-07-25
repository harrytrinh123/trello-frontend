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

async function fetchCards(url) {
  try {
    let res = await fetch(url);
    return await res.json();
  } catch(error) {
    console.log(error);
  }
}

async function showLists(data) {
  let lst = "";
  for (var i = 0; i < data.length; i++) {
    lst += '<div id="' + data[i]["id"] + '" class="sortable"><h5 class="nodrag list-header">' + data[i]["name"] + '</h5>';
    let cardsText = "";
    let urlGetCards = getCards + data[i]["id"] + '/cards';
    let cards = await fetchCards(urlGetCards);
    cards.forEach(card => {
      cardsText += '<div class="card-item">' + card.name + '</div>';
    });
    
    lst += cardsText;
    lst += '<input type="text" class="nodrag anchorBottom newlistitem" name="newlistitem" placeholder="New List Item..." /></div>';
  }
  console.log(lst)
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