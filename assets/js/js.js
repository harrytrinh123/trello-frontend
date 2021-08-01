const getLists = "https://localhost:44395/api/boards/6089796c27952b1ac618b338/lists";
const getCards = "https://localhost:44395/api/lists/";
const listUrl = "https://localhost:44395/api/lists/";
const cardUrl = "https://localhost:44395/api/cards/";
const boardId = "6089796c27952b1ac618b338";
// SORT ABLE
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
      var listId = $(this).parent();
      createCardFetch(listId, {'name' : $(this).val()});
      $(this).before('<div class="card-item">' + $(this).val() + '</div>');
      $(this).val('');
    }
  });
}

// LOAD LIST AND CARD
async function loadListAndCardData(url) {

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
    var del = 'del-' + data[i]["id"];
    var up = 'up-' + data[i]["id"];
    lst += '<div id="' + data[i]["id"] + '" class="sortable"><h5 onclick="updateList(this.id)" id="'+up+'" class="nodrag list-header">' + data[i]["name"] + '</h5><a onclick="deleteList(this.id)" id="'+del+'" href="#" class="delList"><i class="far fa-trash-alt"></i></a>';
    let cardsText = "";
    let urlGetCards = getCards + data[i]["id"] + '/cards';
    let cards = await fetchCards(urlGetCards);
    cards.forEach(card => {
      cardsText += '<div class="card-item"><p onclick="updateCard(this.id)" id="p-'+card.id+'">' + card.name + '</p><button onclick="deleteCard(this.id)" id="btn-'+card.id+'">X</button></div>';
    });
    
    lst += cardsText;
    lst += '<input type="text" class="nodrag anchorBottom newlistitem" name="newlistitem" placeholder="New List Item..." /></div>';
  }
  newlstinput = $(".newlistinput");
  newlstinput.before(lst);
}

// Create , update, Delete list
async function createList(listName,  boardId) {
  const response = await fetch(listUrl + listName + "&" + boardId, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function deleteListFetch(listId) {
  const response = await fetch(listUrl + listId + "/archive", {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
  });
}

function deleteList(delId) {
  var listId = delId.substring(4, delId.length);
  $('#' + listId).remove();
  deleteListFetch(listId);
}

async function updateListFetch(listId, data = {}) {
  // Default options are marked with *
  const response = await fetch(listUrl + listId, {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function updateList(upId) {
  var valTitle = $('#' + upId).text();
  $('#' + upId).html('<input class="input-edit" value="' + valTitle + '">');
  $('#' + upId + ' input').focus();
  $('.input-edit').keyup(function (e) {
    if (e.keyCode === 13) {
        var upVal = $(this).val();
        $('#' + upId).html('<h5 onclick="updateList(this.id)" id="'+upId+'" class="nodrag list-header">'+upVal+'</h5>');
        var listId = upId.substring(3, upId.length);
        updateListFetch(listId, {'name' : upVal});
    }
});
}

// Create, update, delete card
// NEED TO FIX
var createCardURl = "https://api.trello.com/1/cards?key=07e57a8c0ff7205b8202479a1d9ed50d&token=16a827c827226d35375b00936d65bea64d6c964f8e2e638f87fb9b27143eae7d&idList=";
async function createCardFetch(listId, card = {}) {
  const response = await fetch(createCardURl + listId, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    body: JSON.stringify(card)
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
// Update
async function updateCardFetch(cardId, data = {}) {
  // Default options are marked with *
  const response = await fetch(cardUrl + cardId, {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function updateCard(upId) {
  var valTitle = $('#' + upId).text();
  $('#' + upId).html('<input class="input-edit" value="' + valTitle + '">');
  $('#' + upId + ' input').focus();
  $('.input-edit').keyup(function (e) {
    if (e.keyCode === 13) {
        var upVal = $(this).val();
        $('#' + upId).html(upVal);
        var listId = upId.substring(2, upId.length);
        updateCardFetch(listId, {'name' : upVal});
    }
});
}
// Delete
async function deleteCardFetch(cardId) {
  const response = await fetch(cardUrl + cardId, {
    method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
  });
}

function deleteCard(carIdBtn) {
  var cardId = carIdBtn.substring(4, carIdBtn.length);
  deleteCardFetch(cardId);
  $('#' + carIdBtn).parent().remove();
}


// READY FUNCTION
$(document).ready(function () {
  loadListAndCardData(getLists);
  $(".oversort").sortable(
    {
      items: ":not(.nodrag)", placeholder: "sortable-placeholder"
    }
  );

  // key listener to add new lists
  $('input[name="newlistname"]').keyup(function (event) {
    if (event.key == "Enter" || event.keycode == "13") {
      createList($(this).val(), boardId);
      $(this).before('<div class="sortable"><h5 class="nodrag list-header"><a href="#" class="delList"><i class="far fa-trash-alt"></i></a>' + $(this).val() + '</h5><input type="text" class="nodrag anchorBottom newlistitem" name="newlistitem" placeholder="New List Item..." /></div>')
      $(this).val('');
      updateListSortables();
      var oversort = $(this).closest('.oversort');
      // $(oversort).scrollLeft($(oversort).prop("s)crollWidth") - $(oversort).width());
    }
  });
});