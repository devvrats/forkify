class SearchView {
  _parentEl = document.querySelector('.search');
  qetQuery() {
    const query = this._parentEl.querySelector('.search__field').value;

    this._clearInput();

    return query;
  }
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
  addHandleSearch(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
