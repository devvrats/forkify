import * as model from './model.js';
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';

import icons from '../img/icons.svg';

import 'core-js/stable';
import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime';

import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarkView from './views/bookmarkView.js';
import AddRecipeView from './views/AddRecipeView.js';
import paginationView from './views/paginationView.js';
import previewView from './views/previewView.js';

// if (module.hot) module.hot.accept();
const recipeContainer = document.querySelector('.recipe');

// const timeout = function (s) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error(`Request took too long! Timeout after ${s} second`));
//     }, s * 1000);
//   });
// };

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    //loading recipe

    recipeView.renderSpinner();

    // 01 update results view to mark seleced search result

    // resultsView.update(model.getSearchResultPage());

    // const res = await fetch(
    //   `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    // );

    // const data = await res.json();

    // if (!res.ok) throw new Error(`${data.message} (${data.status})`);

    // let { recipe } = data.data;

    // recipe = {
    //   id: recipe.id,
    //   title: recipe.title,
    //   publisher: recipe.publisher,
    //   sourceUrl: recipe.source_url,
    //   image: recipe.image_url,
    //   servings: recipe.servings,
    //   cookingTime: recipe.cooking_time,
    //   ingredients: recipe.ingredients,
    // };
    await model.loadRecipe(id);

    // const { recipe } = model.state;
    recipeView.render(model.state.recipe);

    // render result
    resultsView.render(model.getSearchResultPage());

    bookmarkView.render(model.state.bookmarks);

    //rendering recipe
  } catch (err) {
    recipeView.randerError();
  }
};
// showRecipe();

const controlSearchResult = async function () {
  try {
    //get search query

    const query = searchView.qetQuery();

    if (!query) return;
    //load serch result
    resultsView.renderSpinner();
    await model.loadSearchResults(query);

    // render result
    resultsView.render(model.getSearchResultPage());

    //initial pagination button
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};
const controPagination = function (goToPage) {
  resultsView.render(model.getSearchResultPage(goToPage));
  paginationView.render(model.state.search);
};
// const retriveRecipe = async function (recipe) {
//   try {
//     const recipeData = await fetch(
//       `https://forkify-api.herokuapp.com/api/v2/recipes?search=${recipe}`
//     );
//     // let {
//     //   data: { recipes },
//     // } = await recipeData.json();
//     let data = await recipeData.json();

//     // console.log(data);
//     const {
//       data: { recipes },
//     } = data;
//     // console.log(recipes);
//     // console.log(recipes);

//     recipes.map(rec => {
//       const markup = `
//       <li class="preview">
//         <a class="preview__link preview__link--active" href="#${rec.id}">
//           <figure class="preview__fig">
//             <img src="${rec.image_url}" alt="Test" />
//           </figure>
//           <div class="preview__data">
//             <h4 class="preview__title">${rec.title}</h4>
//             <p class="preview__publisher">${rec.publisher}</p>
//             <div class="preview__user-generated">
//               <svg>
//                 <use href="${icons}#icon-user"></use>
//               </svg>
//             </div>
//           </div>
//         </a>
//       </li>`;

//       document
//         .querySelector('.results')
//         .insertAdjacentHTML('afterbegin', markup);
//     });
//   } catch (error) {}
// };

// document.querySelector('.search__btn').addEventListener('click', function (e) {
//   e.preventDefault();
//   const searchRecipe = document.querySelector('.search__field').value;
//   // retriveRecipe(searchRecipe);
// });

// ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, showRecipe));
// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);

const controllerServing = function (newServing) {
  // update the recipe serving
  model.updateServings(newServing);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

  // update the recipe view
};
const controlAddBookMark = function () {
  // 1) add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render Bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinner
    AddRecipeView.renderSpinner();

    //upload the new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    AddRecipeView.randerMessage();

    //render bookmark view
    bookmarkView.render(model.state.bookmarks);

    //change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    window.history.back();

    //close window
    setTimeout(() => {
      AddRecipeView.toggleWindow();
      console.log(window.location.origin + '/');
      // const url = new URL(model.state.recipe.key, window.location.origin + '/');
      // window.location.replace(url);
    }, MODEL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error('💥', error);
    AddRecipeView.randerError(error.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(showRecipe);
  recipeView.addHandlerUpdateServings(controllerServing);
  recipeView.addHandlerAddBookmark(controlAddBookMark);
  bookmarkView.addHandlerRender(controlBookmarks);
  searchView.addHandleSearch(controlSearchResult);
  paginationView.addHandelerClick(controPagination);
  AddRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
