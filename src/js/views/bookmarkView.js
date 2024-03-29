import View from './view';
import previewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
  // _generateMarkupPreview(result) {
  //   const id = window.location.hash.slice(1);
  //   console.log(result);
  //   return `<li class="preview">
  //   <a class="preview__link ${
  //     result.id === id ? 'preview__link--active' : ''
  //   }" href="#${result.sourceUrl}">
  //     <figure class="preview__fig">
  //       <img src="${result.image}" alt="Test" />
  //     </figure>
  //     <div class="preview__data">
  //       <h4 class="preview__title">
  //         ${result.title}
  //       </h4>
  //       <p class="preview__publisher">${result.publisher}</p>
  //     </div>
  //   </a>
  // </li>`;
  // }
}
export default new BookmarksView();
