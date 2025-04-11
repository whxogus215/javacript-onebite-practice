import { setPokemonType } from "../modules/typeTag.js";

export default function PokemonDetail({ $app, initialState }) {
  this.state = initialState;
  this.$target = document.createElement("div");
  this.$target.className = "pokemon-detail";

  $app.appendChild(this.$target);

  this.template = () => {
    const pokemon = this.state;
    let temp = `
        <div class="detail-wrapper">
            <div class="left-wrapper">
                <img src="${pokemon.img}"></img>
            </div>
            <div class="right-wrapper">
                <div class="pokemon-info">
                    <div class="index">No.${pokemon.id}</div>
                    <div class="name">${pokemon.name}</div>                 
                    <div class="type">${setPokemonType(pokemon.type)}</div>
                    <div class="description">${pokemon.description}</div>
                </div>
                <div class="detail-info">
                    <div>
                        <div class="label">키</div>
                        <div class="info">${pokemon.height}m</div>
                    </div>
                    <div>
                        <div class="label">분류</div>
                        <div class="info">${pokemon.info}</div>
                    </div>
                    <div>
                        <div class="label">몸무게</div>
                        <div class="info">${pokemon.weight}kg</div>
                    </div>
                </div>
            </div>
        </div>`;
    return temp;
  };

  this.render = () => {
    this.$target.innerHTML = this.template();
  };

  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  this.render();
}
