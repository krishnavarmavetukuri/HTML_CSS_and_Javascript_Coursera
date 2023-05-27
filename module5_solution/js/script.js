$(function () { // Same as document.addEventListener("DOMContentLoaded"...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
    // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  });
});

(function (global) {

var dc = {};

var categoryHtml = "snippets/category-snippet.html";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";

var homeHtmlUrl = "snippets/home-snippet.html";

var menuItemHtml = "snippets/menu-item.html";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";


var insertHtml = function (selector, html) {
// Convenience function for inserting innerHTML for 'select'
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};


var showLoading = function (selector) {
// Show loading icon inside element identified by 'selector'.
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};


var insertProperty = function (string, propName, propValue) {
// Return substitute of '{{propName}}'
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
// with propValue in given 'string'
  return string;
};

var switchMenuToActive = function () {
// Remove the class 'active' from home and switch to Menu button
  var classes = document.querySelector("#navHomeButton").className;
// Remove 'active' from home button
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
// Add 'active' to menu button if not already there
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

document.addEventListener("DOMContentLoaded", function (event) {
// On page load (before images or CSS)

// TODO: STEP 0: Look over the code from
// *** start *** to
// *** finish *** below.
// We changed this code to retrieve all categories from the server instead of simply requesting home HTML snippet. We now also have another function
// called buildAndShowHomeHTML that will receive all the categories from the server and process them: choose random category, retrieve home HTML snippet, insert that
// random category into the home HTML snippet, and then insert that snippet into our main page (index.html).
//
// TODO: STEP 1: Substitute [...] below with the *value* of the function buildAndShowHomeHTML, so it can be called when server responds with the categories data.
// STEP1: 
// *** start ***  On first load, show home view

showLoading("#main-content");
$ajaxUtils.sendGetRequest(
  allCategoriesUrl,
   // ***** <---- TODO: STEP 1: Substitute [...] ******
  buildAndShowHomeHTML,
  // Explicitly setting the flag to get JSON from server processed into an object literal
  true); 
});
// *** finish **



function buildAndShowHomeHTML (categories) {
// Builds HTML for the home page based on categories array
  $ajaxUtils.sendGetRequest(
    // returned from the server.
    homeHtmlUrl,
    // Load home snippet page
    function (homeHtml) {

      // TODO: STEP 2: Here, call chooseRandomCategory, passing it retrieved 'categories'
      var chosenCategoryShortName = chooseRandomCategory (categories)
      // Pay attention to what type of data that function returns vs what the chosenCategoryShortName
      var shortnamewithquotes = "'" + chosenCategoryShortName.short_name + "'" 
      // variable's name implies it expects.
      console.log("Short name: " + shortnamewithquotes)

      //TODO: STEP 3: Substitute {{randomCategoryShortName}} in the home html snippet with the chosen category from STEP 2. 
      //Use existing insertProperty function for that purpose.
      //Look through this code for an example of how to do use the insertProperty function.
      //WARNING! You are inserting something that will have to result in a valid Javascript syntax because the substitution of {{randomCategoryShortName}} becomes an argument being passed into the $dc.loadMenuItems function. 
      //Think about what that argument needs to look like. 
      var homeHtmlToInsertIntoMainPage = insertProperty (
          homeHtml,
          "randomCategoryShortName",
          shortnamewithquotes)
      console.log("homeHtml..." + homeHtmlToInsertIntoMainPage)
      // For example, a valid call would look something like this: $dc.loadMenuItems('L')
      //Hint: you need to surround the chosen category short name with something before inserting it into the home html snippet.
      //
      insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
      //TODO: STEP 4: Insert the produced HTML in STEP 3 into the main page
      //Use the existing insertHtml function for that purpose. Look through this code for an example of how to do that.

    },
    // False here because we are getting just regular HTML from the server, so no need to process JSON.
    false); 

}



function chooseRandomCategory (categories) {
  // Given array of category objects, returns a random category object.
  var randomArrayIndex = Math.floor(Math.random() * categories.length);
  // Choose a random index into the array (from 0 inclusively until array length (exclusively))
  return categories[randomArrayIndex];
  // return category object with that randomArrayIndex
}


dc.loadMenuCategories = function () {
  showLoading("#main-content");
// Load the menu categories view
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};



dc.loadMenuItems = function (categoryShort) {
  // Load the menu items view
  showLoading("#main-content");
  // 'categoryShort' is a short_name for a category
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort + ".json",
    buildAndShowMenuItemsHTML);
};


function buildAndShowCategoriesHTML (categories) {
  // Builds HTML for the categories page based on the data
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    // from the server
    function (categoriesTitleHtml) {
      // Load title snippet of categories page
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        // Retrieve single category snippet
        function (categoryHtml) {
          switchMenuToActive();
          // Switch CSS class active to menu button
          

          var categoriesViewHtml =
            buildCategoriesViewHtml(categories,
                                    categoriesTitleHtml,
                                    categoryHtml);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);
}

function buildCategoriesViewHtml(categories,
                                 categoriesTitleHtml,
                                 categoryHtml) {
// Using categories data and snippets html
  var finalHtml = categoriesTitleHtml;
// build categories view HTML to be inserted into page
  finalHtml += "<section class='row'>";
  for (var i = 0; i < categories.length; i++) {
    // Loop over categories
    var html = categoryHtml;
    var name = "" + categories[i].name;
    
    var short_name = categories[i].short_name;
    html = insertProperty(html, "name", name);
    // Insert category values
    html =
      insertProperty(html,
                     "short_name",
                     short_name);
    finalHtml += html;
  }
  finalHtml += "</section>";
  return finalHtml;
}


function buildAndShowMenuItemsHTML (categoryMenuItems) {
  // Builds HTML for the single category page based on the data
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    // from the server
    function (menuItemsTitleHtml) {
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
            // Load title snippet of menu items page
        function (menuItemHtml) {
          switchMenuToActive();
          // Retrieve single menu item snippet
          var menuItemsViewHtml =
            buildMenuItemsViewHtml(categoryMenuItems,
                                   menuItemsTitleHtml,
                                   menuItemHtml);
          // Switch CSS class active to menu button
          insertHtml("#main-content", menuItemsViewHtml);
        },
        false);
    },
    false);
}



function buildMenuItemsViewHtml(categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemHtml) {
// Using category and menu items data and snippets html
  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "name",
                   categoryMenuItems.category.name);
    // build menu items view HTML to be inserted into page
  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "special_instructions",
                   categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  
  var menuItems = categoryMenuItems.menu_items;
  // Loop over menu items
  var catShortName = categoryMenuItems.category.short_name;
  for (var i = 0; i < menuItems.length; i++) {
    
    var html = menuItemHtml;
    // Insert menu item values
    html =
      insertProperty(html, "short_name", menuItems[i].short_name);
    html =
      insertProperty(html,
                     "catShortName",
                     catShortName);
    html =
      insertItemPrice(html,
                      "price_small",
                      menuItems[i].price_small);
    html =
      insertItemPortionName(html,
                            "small_portion_name",
                            menuItems[i].small_portion_name);
    html =
      insertItemPrice(html,
                      "price_large",
                      menuItems[i].price_large);
    html =
      insertItemPortionName(html,
                            "large_portion_name",
                            menuItems[i].large_portion_name);
    html =
      insertProperty(html,
                     "name",
                     menuItems[i].name);
    html =
      insertProperty(html,
                     "description",
                     menuItems[i].description);

    
    if (i % 2 !== 0) {
      
      html +=
        "<div class='clearfix visible-lg-block visible-md-block'></div>";

    }
// Add clearfix after every second menu item
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}

function insertItemPrice(html,
                         pricePropName,
                         priceValue) {
  // Appends price with '$' if price exists
  if (!priceValue) {
    return insertProperty(html, pricePropName, "");
  }

  priceValue = "$" + priceValue.toFixed(2);
  // If not specified, replace with empty string
  html = insertProperty(html, pricePropName, priceValue);
  return html;
}


function insertItemPortionName(html,
                               portionPropName,
                               portionValue) {
  // Appends portion name in parens if it exists
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }
  
  portionValue = "(" + portionValue + ")";
  // If not specified, return original string
  html = insertProperty(html, portionPropName, portionValue);
  return html;
}
global.$dc = dc;
})(window);
