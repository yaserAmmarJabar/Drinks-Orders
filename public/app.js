// DOM
var blackTeaNumberOfCups = document.getElementById('number_of_cups');
var greenTeaNumberOfCups = document.getElementById('number_of_cups2');
var cinnamonDrinkNumberOfCups = document.getElementById('number_of_cups3');
var coffeNumberOfCups = document.getElementById('number_of_cups4');
var userEnteredBlackTeaNumberOfCups = document.getElementById('number_of_cups6');
var userEnteredGreenTeaNumberOfCups = document.getElementById('number_of_cups7');
var userEnteredCinnamonDrinkNumberOfCups = document.getElementById('number_of_cups8');
var userEnteredCoffeeNumberOfCups = document.getElementById('number_of_cups9');
// Socket io connection
var socket = io('http://localhost:3000/');
/******************************************************************
 Site Functionality
******************************************************************/
var globalVar = 1000;

function substractFromGlobalVar(value) {
  globalVar -= value;
}
/******************************************************************
 Socket Functionality
******************************************************************/
var KitchenArray = [];

function pushToKitchenArray(object) {
  KitchenArray.push(object);
}
var id = 1;

function setObjectForDrink(drink, userEnteredDrinkNumberOfCupsValue) {
  var object = {
    "id": id,
    "drink": drink,
    "number_of_cups": userEnteredDrinkNumberOfCupsValue
  };
  console.log(userEnteredDrinkNumberOfCupsValue);
  // console.log(object);
  pushToKitchenArray(object);
  id += 1;
}
// emitting socket on submit button click
function sendSocket() {
  console.log(KitchenArray);
  socket.emit("data", KitchenArray);
  socket.on('success', function (data) {
    console.log(data);
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var success = data.success;
        console.log(success);
        if (success == true) {
          sendSuccessModal();
        }
        else {
          sendErrorModal();
        }
      }
    }
  });
}

function sendSuccessModal() {
  console.log('in success Function');
  $('#successModal').modal('show');
}

function sendErrorModal() {
  console.log('in error modal function');
  $("#errorModal").modal('show');
}
/*=================================================================
 Socket Functionality (END)
=================================================================*/
/*
*****************************************************************
 Modal POP UP
*****************************************************************
*/
// 1. Global Function
function enablePopupFunctionality(drinkShowingModalButtonId, orderedId /* every drinks gets ordered has the ordered id */ , drinkModalId) {
  $(drinkShowingModalButtonId).on("click", function () {
    if ($(orderedId).length) /* does exist */ {
      // Show the Already Exists Modal
      console.log("it's already there");
      $('#AlreadyExists').modal('show');
    }
    else /* does not exist */ {
      console.log('object has been clicked');
      // Create One
      // 1. Call The Drink Submitter
      $(drinkModalId).modal('show');
    }
  });
}
// 2. Use of function
enablePopupFunctionality("#black_tea_indicator", "#black_tea_ordered", "#blackTeaSubmitter");
enablePopupFunctionality("#green_tea_indicator", "#green_tea_ordered", "#greenTeaSubmitter");
enablePopupFunctionality("#cinnamon_drink_indicator", "#cinnamon_drink_ordered", "#cinnamonDrinkSubmitter");
enablePopupFunctionality("#coffee_indicator", "#coffee_ordered", "#coffeeSubmitter");

function check() {
  if ($("#black_tea_ordered").length) {
    console.log("it exists");
  }
  else {
    console.log("it does'nt exist");
  }
}
// 1. adding to menu
function addItemToMenuIfClicked(drinkName, drinkAddingButton, drinkOrderedWithHT, drinkOrderedWithoutHT, drinkModalIdInCreation, drinkNumberOfCups, userEnteredDrinkNumberOfCupsValue, drinkEditInputId /* with hashtag */ , drinkIndicator /* For Popup Functionality */ , currentModal, containerIdInCreation, drinkBadgeClass, drinkModalApplyButton, imageURL) {
  $(drinkAddingButton).on("click", function () {
    // Numbers Test
    if (drinkNumberOfCups.value >= 1 && drinkNumberOfCups.value <= 100) {
      $(currentModal).modal("hide");
      console.log("drink adder clicked");
      // double check that everything is well organized
      if ($(drinkOrderedWithHT).length) { // if drink already exist's
        $(drinkModalIdInCreation).modal("hide");
        console.log("drink is already ordered");
        $("#AlreadyExists").modal("show");
      }
      else {
        var drinkValue = drinkNumberOfCups.value;
        if (drinkValue.length == 0) {
          alert("please Enter a value for the input");
        }
        else {
          $(drinkModalIdInCreation).modal("hide");
          var drinkElementString = "<button class='imgButton' id='" + containerIdInCreation + "' data-toggle='modal' data-target='" + drinkModalIdInCreation + "'><img class='img' id='" + drinkOrderedWithoutHT + "' src='" + imageURL + "'></button>";
          var drinkImage = $(drinkElementString);
          var badgeString = "<span class='badge sized " + drinkBadgeClass + "'>" + drinkNumberOfCups.value + "</span>";
          var badgeImage = $(badgeString);
          userEnteredDrinkNumberOfCupsValue.value = drinkNumberOfCups.value;
          $("#box").append(drinkImage);
          $("#box").append(badgeImage);
          $(".submit").removeAttr("disabled");
          setObjectForDrink(drinkName, userEnteredDrinkNumberOfCupsValue.value);
          // when the apply button is clicked
          $(drinkModalApplyButton).on('click', function () {
            console.log("click is triggered");
            var value = $(drinkEditInputId).val();
            $('.' + drinkBadgeClass).text(value);
          });
        }
        enablePopupFunctionality(drinkIndicator, drinkOrderedWithHT, drinkModalIdInCreation);
        drinkNumberOfCups.value = "";
      }
    }
    else {
      console.log('it doesnt works');
      handleExtraNumbers(drinkNumberOfCups);
    }
  });
}

function handleExtraNumbers(element) {
  var animationName = 'animated shake border-red';
  var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  $(element).addClass(animationName).one(animationEnd, function () {
    $(this).removeClass(animationName);
  });
  console.log('Number problem handle function');
}
// 2. Use of function
addItemToMenuIfClicked("black tea", "#black_tea_adding_button", "#black_tea_ordered", "black_tea_ordered", "#BlackTeaEdit", blackTeaNumberOfCups, userEnteredBlackTeaNumberOfCups, '#number_of_cups6', "#black_tea_indicator", "#blackTeaSubmitter", "bt_container", 'blackTea_added_badgeStyle', "#apply_button", "https://www.colourbox.com/preview/2770483-cup-of-black-tea-isolated-on-black-background.jpg");
addItemToMenuIfClicked("green tea", "#green_tea_adding_button", "#green_tea_ordered", "green_tea_ordered", "#GreenTeaEdit", greenTeaNumberOfCups, userEnteredGreenTeaNumberOfCups, '#number_of_cups7', '#green_tea_indicator', '#greenTeaSubmitter', "gt_container", 'greenTea_added_badgeStyle', "#apply_button2", "http://i.ndtvimg.com/i/2015-04/green-tea_650x379_51430317406.jpg");
addItemToMenuIfClicked("cinnamon drink", "#cd_adder", "#cinnamon_drink_ordered", "cinnamon_drink_ordered", "#CinnamonDrinkEdit", cinnamonDrinkNumberOfCups, userEnteredCinnamonDrinkNumberOfCups, "#number_of_cups8", '#cinnamon_drink_indicator', '#cinnamonDrinkSubmitter', "cd_container", 'cinnamonDrink_added_badgeStyle', "#apply_button3", "http://amorettiblog.com/wp-content/uploads/2012/10/cider-550px.jpg");
addItemToMenuIfClicked("coffee", "#coffee_adding_button", "#coffee_ordered", "coffee_ordered", "#CoffeeEdit", coffeNumberOfCups, userEnteredCoffeeNumberOfCups, "#number_of_cups9", "#coffee_indicator", "#coffeeSubmitter", "cf_container", "coffee_added_badgeStyle", "#apply_button4", "http://cdn-mf1.heartyhosting.com/sites/mensfitness.com/files/styles/photo_gallery_full/public/coffee_rotator.jpg?itok=XPPK4n41");
/*=================================================================
 Modal POP UP (END)
=================================================================*/
/******************************************************************
 JQUERY (deleting)
******************************************************************/
// $("#black_tea_deleter"/* the button */).on("click", function() {
//   $("#bt_container").remove();/* remove the whole container */
//   console.log("removed");
// });
/*=================================================================
 JQUERY Deleting (END)
=================================================================*/
// Only numbers are allowed in inputs
$(document).ready(function () {
  // Key System
  $("#number_of_cups").keydown(function (e) {
    // Allow: backspace, delete, tab, escape and enter
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode == 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode == 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode == 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });
});
