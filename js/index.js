$(function () {
  $(".loading").fadeOut(1000, function () {
    $("body").removeClass("overflow-hidden");
    $("#rowData").removeClass("d-none");
    $(".loading").addClass("d-none");
  });
});
// side nav slider

const navSize = $(".side-nav .hidden-nav").outerWidth(true);
$(".side-nav").css("left", -navSize);
$(".nav-links li").css("top", "300px");

const openIcon = document.getElementById("openIcon");
const closeIcon = document.getElementById("closeIcon");
function showLinks() {
  $(".nav-links li").animate({ top: 0 }, 500);
}
function hideLinks() {
  $(".nav-links li").animate({ top: 300 }, 300);
}

function openSlider() {
  openIcon.classList.add("d-none");
  closeIcon.classList.remove("d-none");

  $(".side-nav").animate({ left: 0 }, 500);
  showLinks();
}
openIcon.addEventListener("click", function () {
  openSlider();
});
function closeSlider() {
  openIcon.classList.remove("d-none");
  closeIcon.classList.add("d-none");

  $(".side-nav").animate({ left: -navSize }, 500);
  hideLinks();
}
closeIcon.addEventListener("click", function () {
  closeSlider();
});

// ==============

// home API

async function getMeals() {
  try {
    $("#miniForm").addClass("d-none");
    $("#serachResult").addClass("d-none");
    let res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s="
    );
    if (!res.ok) throw new Error("Failed to fetch data");
    let apiData = await res.json();
    displayMeals(apiData.meals);
  } catch (error) {
    console.log(error);
  }
}
getMeals();

const rowData = document.getElementById("rowData");
function displayMeals(arr) {
  let mealsCartona = "";
  for (let index = 0; index < arr.length; index++) {
    mealsCartona += `
            
            <div id="meals-section" class="col-md-3 meal-item" data-mealid = ${arr[index].idMeal}>
                <div class="content position-relative overflow-hidden">
                    <img src=${arr[index].strMealThumb} class=" w-100 rounded-3 " alt="">
                    <div class="info rounded-3">
                        <h2 class="p-3">${arr[index].strMeal}</h2>
                    </div>
                </div>
            </div>
            `;
  }
  rowData.innerHTML = mealsCartona;
}

// decs API
async function displayDisc(mealId) {
  closeSlider();
  $("#meals-section").addClass("d-none");
  $(".loading").removeClass("d-none").fadeIn(1000);

  try {
    let resp = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    if (!resp.ok) throw new Error("Failed to fetch data");
    let descData = await resp.json();
    displayMealDesc(descData.meals);
  } catch (error) {
    console.log(error);
  }
  $(".loading").addClass("d-none").fadeIn(1000);
}

// Recipes
function displayMealRecipes(meals) {
  let ingredients = ``;

  for (let i = 1; i <= 20; i++) {
    if (meals[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meals[`strMeasure${i}`]
      } ${meals[`strIngredient${i}`]}</li>`;
    }
  }
  return ingredients;
}
// tags
function displayMealTags(meals) {
  let tags = meals.strTags?.split(",");
  if (!tags) tags = [];

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }
  return tagsStr;
}

function displayMealDesc(meals) {
  let descCartona = "";
  for (let index = 0; index < meals.length; index++) {
    let ingredients = displayMealRecipes(meals[index]);
    let tags = displayMealTags(meals[index]);
    descCartona += `
            <div class="loading position-fixed d-flex top-0 start-0- end-0 bottom-0 bg-black justify-content-center align-items-center text-white ">
            <i class="fa fa-spinner fa-spin fa-5x"></i>
            </div>
            <div class="col-md-4 text-white">
            <img src=${meals[index].strMealThumb} class="w-100 rounded-3" alt=""/>
            <h2>${meals[index].strMeal}</h2>
        </div>
        <div class="col-md-8 text-white">
            <h2>Instructions</h2>
            <p>${meals[index].strInstructions}</p>
            <h3>Area : ${meals[index].strArea}</h3>
            <h3>Category : ${meals[index].strCategory}</h3>
            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap ">
            ${ingredients}
            </ul>
            <h3>Tags : </h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${tags}
            </ul>
            <a target="_blank" href="${meals[index].strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meals[index].strYoutube}" class="btn btn-danger">Youtube</a>
        </div>
            `;
  }
  rowData.innerHTML = descCartona;
}

$(document).on("click", ".meal-item", function () {
  let mealId = $(this).attr("data-mealid");
  displayDisc(mealId);
});

// ==============

// search

let searchContainer = document.getElementById("searchContainer");
const miniForm = document.getElementById("miniForm");
const serachResult = document.getElementById("serachResult");
function showSearch() {
  showResult.innerHTML = "";
  $("#miniForm").removeClass("d-none");
  $("#serachResult").removeClass("d-none");
  let searchInputs = `
    <div class="col-md-6">
        <input type="text" id="mealName" name="mealName" class="form-control bg-transparent text-white" placeholder="Search By Name">
    </div>
    <div class="col-md-6">
        <input type="text" id="firstChar" maxlength="1" class="form-control bg-transparent text-white" placeholder="Search By First Letter">
    </div>
    `;
  miniForm.innerHTML = searchInputs;
}

$(document).on("click", "#search", function () {
  rowData.innerHTML = "";
  closeSlider();
  showSearch();
});

// search by name API
async function searchByName(term) {
  try {
    $("#rowSearchData").html("");
    $(".inner-loading-screen").removeClass("d-none").fadeIn(1000);
    let response;
    if (term.length === 1) {
      response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
      );
    } else {
      response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
      );
    }

    if (!response.ok) throw new Error("Failed to fetch meal");

    let data = await response.json();
    displaySearchResult(data.meals || []);
  } catch (error) {
    console.log(error);
  }
  $(".inner-loading-screen").addClass("d-none").fadeIn(1000);
}
const showResult = document.getElementById("rowSearchData");
function displaySearchResult(meals) {
  showResult.innerHTML = "";

  if (meals.length === 0) {
    showResult.innerHTML = `<p class="text-white">No Meals Found!</p>;`;
    return;
  }

  meals.forEach((meal) => {
    let mealItem = `
    <div id="searchResult" class="col-md-3" data-mealid="${meal.idMeal}">
        <div class="content position-relative overflow-hidden">
            <img src="${meal.strMealThumb}" class="w-100 rounded-3" alt="">
            <div class="info rounded-3">
                <h2 class="p-3">${meal.strMeal}</h2>
            </div>
        </div>
    </div>
`;
    showResult.innerHTML += mealItem;
  });
}
$(document).on("click", "#searchResult", function () {
  rowData.innerHTML = "";
    $("#miniForm").addClass("d-none");
    $("#serachResult").addClass("d-none");
    
  let mealId = $(this).attr("data-mealid");
  displaySearchResultDetails(mealId);
});

// desc API
async function displaySearchResultDetails(mealId) {
  try {
    $(".loading").removeClass("d-none").fadeIn(1000);
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    if (!response.ok) throw new Error("Failed to fetch meal details");

    let data = await response.json();
    displaySearchResultDesc(data.meals[0]);
  } catch (error) {
    console.log(error);
  }
  $(".loading").addClass("d-none").fadeIn(1000);
}

function displaySearchResultDesc(meal) {
  let searchResultDesc = "";
  let ingredients = displayMealRecipes(meal);
  let tags = displayMealTags(meal);

  searchResultDesc = `
    <div class="loading position-fixed d-flex top-0 start-0 end-0 bottom-0 bg-black justify-content-center align-items-center text-white ">
        <i class="fa fa-spinner fa-spin fa-5x"></i>
    </div>
    <div class="col-md-4 text-white">
        <img src="${meal.strMealThumb}" class="w-100 rounded-3" alt=""/>
        <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8 text-white">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3>Area : ${meal.strArea}</h3>
        <h3>Category : ${meal.strCategory}</h3>
        <h3>Recipes :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${ingredients}
        </ul>
        <h3>Tags : </h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${tags}
        </ul>
        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>
    `;

  rowData.innerHTML = searchResultDesc;
}
// search by name result
$(document).ready(function () {
  $(document).on("input", "#mealName", function () {
    let term = $(this).val();
    searchByName(term);
  });
});
// search by first char result
$(document).ready(function () {
  $(document).on("input", "#firstChar", function () {
    let term = $(this).val();
    searchByName(term);
  });
});

// ================

// Categories  section

// Categories API

async function getCategories() {
  try {
    rowData.innerHTML = "";
    $(".loading").removeClass("d-none").fadeIn(1000);
    $("#miniForm").addClass("d-none");
    $("#serachResult").addClass("d-none");

    closeSlider();
    let response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    if (!response.ok) throw new Error("Failed to fetch Category");
    let categoryData = await response.json();
    displayCategories(categoryData.categories);
  } catch (error) {
    console.log(error);
  }
  $(".loading").addClass("d-none").fadeIn(1000);
}

function displayCategories(arr) {
  let categoryCartona = "";
  for (let index = 0; index < arr.length; index++) {
    categoryCartona += `
        <div class="col-md-3 category-item" id="categoryMeals">
        <div class="content position-relative overflow-hidden">
            <img src=${
              arr[index].strCategoryThumb
            } class="w-100 rounded-3" alt="">
            <div class="info1 rounded-3">
                <h2 class="p-1">${arr[index].strCategory}</h2>
                <p class="text-center">${arr[index].strCategoryDescription
                  .split(" ")
                  .slice(0, 20)
                  .join(" ")}</p>
            </div>
        </div>
        </div>
        `;
    rowData.innerHTML = categoryCartona;
  }
}

$(document).on("click", "#categories", function () {
  getCategories();
});

// category meals API
async function showCategoryMeals(Category) {
  closeSlider();
  rowData.innerHTML = "";
  $(".loading").removeClass("d-none").fadeIn(1000);
  try {
    let resp = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${Category}`
    );
    if (!resp.ok) throw new Error("Failed to fetch data");
    let mealsData = await resp.json();
    displayCategoryMeals(mealsData.meals.slice(0, 20));
  } catch (error) {
    console.log(error);
  }
  $(".loading").addClass("d-none").fadeIn(1000);
}

function displayCategoryMeals(meals) {
  let categoryMealCartona = "";
  for (let index = 0; index < meals.length; index++) {
    categoryMealCartona += `
        <div id="categoryMealsItem" class="col-md-3" data-mealid="${meals[index].idMeal}">
            <div class="content position-relative overflow-hidden">
                <img src="${meals[index].strMealThumb}" class="w-100 rounded-3" alt="">
                <div class="info rounded-3">
                    <h2 class="p-3">${meals[index].strMeal}</h2>
                </div>
            </div>
        </div>
        `;
  }

  rowData.innerHTML = categoryMealCartona;
}

$(document).on("click", ".category-item", function () {
  let categoryName = $(this).find("h2").text();
  showCategoryMeals(categoryName);
});

$(document).on("click", "#categoryMealsItem", function () {
  let mealId = $(this).attr("data-mealid");
  displayCategoryMealDetails(mealId);
});

// desc API
async function displayCategoryMealDetails(mealId) {
  try {
    $(".loading").removeClass("d-none").fadeIn(1000);
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    if (!response.ok) throw new Error("Failed to fetch meal details");

    let data = await response.json();
    displayCategoryMealDesc(data.meals[0]);
  } catch (error) {
    console.log(error);
  }
  $(".loading").addClass("d-none").fadeIn(1000);
}

function displayCategoryMealDesc(meal) {
  let mealDesc = "";
  let ingredients = displayMealRecipes(meal);
  let tags = displayMealTags(meal);

  mealDesc = `
    <div class="loading position-fixed d-flex top-0 start-0 end-0 bottom-0 bg-black justify-content-center align-items-center text-white ">
        <i class="fa fa-spinner fa-spin fa-5x"></i>
    </div>
    <div class="col-md-4 text-white">
        <img src="${meal.strMealThumb}" class="w-100 rounded-3" alt=""/>
        <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8 text-white">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3>Area : ${meal.strArea}</h3>
        <h3>Category : ${meal.strCategory}</h3>
        <h3>Recipes :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${ingredients}
        </ul>
        <h3>Tags : </h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${tags}
        </ul>
        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>
    `;

  rowData.innerHTML = mealDesc;
}
// ===============

// Area Section

//  area API
async function getArea() {
  try {
    rowData.innerHTML = "";
    $(".loading").removeClass("d-none").fadeIn(1000);
    $("#miniForm").addClass("d-none");
    $("#serachResult").addClass("d-none");
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
    );
    if (!res.ok) throw new Error("Failed to fetch area");
    let areaData = await res.json();
    displayArea(areaData.meals);
  } catch (error) {
    console.log(error);
  }
  $(".loading").addClass("d-none").fadeIn(1000);
}

$(document).on("click", "#area", function () {
  let area = $(this).val();
  getArea(area);
});

function displayArea(arr) {
  closeSlider();
  let areaCartoona = "";

  for (let index = 0; index < arr.length; index++) {
    areaCartoona += `
        <div id="country" class="col-md-3 text-white">
                <div class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[index].strArea}</h3>
                </div>
        </div>
        `;
  }

  rowData.innerHTML = areaCartoona;
}
// area meals API
async function getAreaMeals(area) {
  try {
    rowData.innerHTML = "";
    $(".loading").removeClass("d-none").fadeIn(1000);
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
    );
    if (!res.ok) throw new Error("Failed to fetch data");
    let areaMealsData = await res.json();
    displayAreaMeals(areaMealsData.meals);
  } catch (error) {
    console.log(error);
  }
  $(".loading").addClass("d-none").fadeIn(1000);
}

function displayAreaMeals(meals) {
  let areaMealsCartoona = "";
  for (let index = 0; index < meals.length; index++) {
    areaMealsCartoona += `
        <div id="areaMealsItem" class="col-md-3" data-mealid="${meals[index].idMeal}">
            <div class="content position-relative overflow-hidden">
                <img src="${meals[index].strMealThumb}" class="w-100 rounded-3" alt="">
                <div class="info rounded-3">
                    <h2 class="p-3">${meals[index].strMeal}</h2>
                </div>
            </div>
        </div>
        `;
  }
  rowData.innerHTML = areaMealsCartoona;
}
$(document).on("click", "#country", function () {
  let area = $(this).find("h3").text();
  getAreaMeals(area);
});

// area meals desc
$(document).on("click", "#areaMealsItem", function () {
  let mealId = $(this).attr("data-mealid");
  displayAreaMealDetails(mealId);
});

async function displayAreaMealDetails(mealId) {
  try {
    $(".loading").removeClass("d-none").fadeIn(1000);
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    if (!response.ok) throw new Error("Failed to fetch meal details");

    let data = await response.json();
    displayAreaMealDesc(data.meals[0]);
  } catch (error) {
    console.log(error);
  }
  $(".loading").addClass("d-none").fadeIn(1000);
}

function displayAreaMealDesc(meal) {
  let mealDesc = "";
  let ingredients = displayMealRecipes(meal);
  let tags = displayMealTags(meal);

  mealDesc = `
    <div class="loading position-fixed d-flex top-0 start-0 end-0 bottom-0 bg-black justify-content-center align-items-center text-white ">
        <i class="fa fa-spinner fa-spin fa-5x"></i>
    </div>
    <div class="col-md-4 text-white">
        <img src="${meal.strMealThumb}" class="w-100 rounded-3" alt=""/>
        <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8 text-white">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3>Area : ${meal.strArea}</h3>
        <h3>Category : ${meal.strCategory}</h3>
        <h3>Recipes :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${ingredients}
        </ul>
        <h3>Tags : </h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${tags}
        </ul>
        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>
    `;

  rowData.innerHTML = mealDesc;
}

// ===============

// Ingredients section

// Ingredients API

async function getIngredients() {
  try {
    rowData.innerHTML = "";
    $(".loading").removeClass("d-none").fadeIn(1000);
    $("#miniForm").addClass("d-none");
    $("#serachResult").addClass("d-none");
    let res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
    );
    if (!res.ok) throw new Error("Failed to fetch data");
    let ingredientsData = await res.json();
    displayIngredients(ingredientsData.meals.slice(0, 20));
  } catch (error) {
    console.log(error);
  }
  $(".loading").addClass("d-none").fadeIn(1000);
}
$(document).on("click", "#ingredients", function () {
  let ingredients = $(this).val();
  getIngredients(ingredients);
});

function displayIngredients(arr) {
  closeSlider();
  let ingredientsCartoona = "";
  for (let index = 0; index < arr.length; index++) {
    ingredientsCartoona += `
        <div id="ingredient" class="col-md-3 text-white">
                <div class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[index].strIngredient}</h3>
                        <p>${arr[index].strDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                </div>
        </div>
        `;
  }

  rowData.innerHTML = ingredientsCartoona;
}

// ingredients meals API

async function getIngredientsMeals(ingredients) {
  try {
    rowData.innerHTML = "";
    $(".loading").removeClass("d-none").fadeIn(1000);
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
    );
    if (!res.ok) throw new Error("Failed to fetch data");
    let ingredientsMealsData = await res.json();
    console.log(ingredientsMealsData);
    displayIngredientsMeals(ingredientsMealsData.meals);
  } catch (error) {
    console.log(error);
  }
  $(".loading").addClass("d-none").fadeIn(1000);
}
$(document).on("click", "#ingredient", function () {
  let ingredient = $(this).find("h3").text();
  getIngredientsMeals(ingredient);
});

function displayIngredientsMeals(meals) {
  let ingredientsMealsCartoona = "";
  for (let index = 0; index < meals.length; index++) {
    ingredientsMealsCartoona += `
        <div id="ingredientsMealsItem" class="col-md-3" data-mealid="${meals[index].idMeal}">
            <div class="content position-relative overflow-hidden">
                <img src="${meals[index].strMealThumb}" class="w-100 rounded-3" alt="">
                <div class="info rounded-3">
                    <h2 class="p-3">${meals[index].strMeal}</h2>
                </div>
            </div>
        </div>
        `;
  }
  rowData.innerHTML = ingredientsMealsCartoona;
}

// Ingredients Meals Desc

$(document).on("click", "#ingredientsMealsItem", function () {
  let mealId = $(this).attr("data-mealid");
  displayIngredientsMealDetails(mealId);
});

async function displayIngredientsMealDetails(mealId) {
  try {
    $(".loading").removeClass("d-none").fadeIn(1000);
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    if (!response.ok) throw new Error("Failed to fetch meal details");

    let data = await response.json();
    displayIngredientsMealDesc(data.meals[0]);
  } catch (error) {
    console.log(error);
  }
  $(".loading").addClass("d-none").fadeIn(1000);
}

function displayIngredientsMealDesc(meal) {
  let mealDesc = "";
  let ingredients = displayMealRecipes(meal);
  let tags = displayMealTags(meal);

  mealDesc = `
    <div class="loading position-fixed d-flex top-0 start-0 end-0 bottom-0 bg-black justify-content-center align-items-center text-white ">
        <i class="fa fa-spinner fa-spin fa-5x"></i>
    </div>
    <div class="col-md-4 text-white">
        <img src="${meal.strMealThumb}" class="w-100 rounded-3" alt=""/>
        <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8 text-white">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3>Area : ${meal.strArea}</h3>
        <h3>Category : ${meal.strCategory}</h3>
        <h3>Recipes :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${ingredients}
        </ul>
        <h3>Tags : </h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${tags}
        </ul>
        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>
    `;

  rowData.innerHTML = mealDesc;
}

// ================

// contact Us

function showContacts() {
  rowData.innerHTML = "";
  $("#miniForm").addClass("d-none");
  $("#serachResult").addClass("d-none");
  closeSlider();
  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `;
  submitBtn = document.getElementById("submitBtn");

  document.getElementById("nameInput").addEventListener("focus", () => {
    nameInputTouched = true;
  });

  document.getElementById("emailInput").addEventListener("focus", () => {
    emailInputTouched = true;
  });

  document.getElementById("phoneInput").addEventListener("focus", () => {
    phoneInputTouched = true;
  });

  document.getElementById("ageInput").addEventListener("focus", () => {
    ageInputTouched = true;
  });

  document.getElementById("passwordInput").addEventListener("focus", () => {
    passwordInputTouched = true;
  });

  document.getElementById("repasswordInput").addEventListener("focus", () => {
    repasswordInputTouched = true;
  });
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

function inputsValidation() {
  if (nameInputTouched) {
    if (nameValidation()) {
      document
        .getElementById("nameAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("nameAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (emailInputTouched) {
    if (emailValidation()) {
      document
        .getElementById("emailAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("emailAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (phoneInputTouched) {
    if (phoneValidation()) {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (ageInputTouched) {
    if (ageValidation()) {
      document
        .getElementById("ageAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("ageAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (passwordInputTouched) {
    if (passwordValidation()) {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-none", "d-block");
    }
  }
  if (repasswordInputTouched) {
    if (repasswordValidation()) {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

function nameValidation() {
  return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
}

function emailValidation() {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    document.getElementById("emailInput").value
  );
}

function phoneValidation() {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
    document.getElementById("phoneInput").value
  );
}

function ageValidation() {
  return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(
    document.getElementById("ageInput").value
  );
}

function passwordValidation() {
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(
    document.getElementById("passwordInput").value
  );
}

function repasswordValidation() {
  return (
    document.getElementById("repasswordInput").value ==
    document.getElementById("passwordInput").value
  );
}

$(document).on("click", "#contactUs", function () {
  showContacts();
});
