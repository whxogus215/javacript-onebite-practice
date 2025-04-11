export default function CityList({
  $app,
  initialState,
  handleLoadMore,
  handleItemClick,
}) {
  this.state = initialState;
  this.$target = document.createElement("div");
  this.$target.className = "city-list";

  this.handleLoadMore = handleLoadMore;
  this.handleItemClick = handleItemClick;
  $app.appendChild(this.$target);

  this.template = () => {
    let temp = `<div class="city-items-container">`;
    if (this.state) {
      this.state.cities.forEach((elm) => {
        temp += `
                <div class="city-item" id=${elm.id}>
                    <img src=${elm.image}></img>
                    <div class="city-item-info">${elm.city}, ${elm.country}</div>
                    <div class="city-item-score">⭐️ ${elm.total}</div>
                </div>
           `;
      });
      temp += `</div>`;
    }
    return temp;
  };

  this.render = () => {
    // 기존에 $target에 있던 값들을 this.template()의 결과값으로 대체! => 기존에 있던 하위 DOM이 삭제된다. (더보기 버튼을 누르면 사라지는 이유 : 다시 새로운 값으로 덮어씌우기 때문)
    // setState()에서 기존의 state에 새로운 state를 추가하기 때문에 새롭게 렌더링하더라도 기존의 state가 남아있게 된다.
    this.$target.innerHTML = this.template();

    this.$target.querySelectorAll("div.city-item").forEach((elm) => {
      elm.addEventListener("click", () => {
        this.handleItemClick(elm.id);
      });
    });

    // API 응답 값 렌더링 후, 더보기 버튼 렌더링
    if (!this.state.isEnd) {
      const $loadMoreButton = document.createElement("button");
      $loadMoreButton.className = "add-items-btn";
      $loadMoreButton.textContent = "+ 더보기";
      this.$target.appendChild($loadMoreButton);

      $loadMoreButton.addEventListener("click", () => {
        this.handleLoadMore();
      });
    }
  };

  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  this.render();
}
