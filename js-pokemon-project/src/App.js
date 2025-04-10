//COMPONENTS
import PokemonList from "./components/PokemonList.js";
import Header from "./components/Header.js";

//APIS
import { getPokemonList } from "./modules/api.js";

export default function App($app) {
  const getSearchWord = () => {
    if (window.location.search.includes("search=")) {
      return window.location.search.split("search=")[1];
    }
    return "";
  };

  this.state = {
    type: "",
    pokemonList: [],
    searchWord: getSearchWord(),
    currentPage: window.location.pathname,
  };

  const header = new Header({
    $app,
    initialState: {
      currentPage: this.state.currentPage,
      searchWord: this.state.searchWord,
    },
    handleClick: async () => {
      history.pushState(null, null, "/");
      const pokemonList = await getPokemonList();
      this.setState({
        ...this.state,
        pokemonList: pokemonList,
        type: "",
        searchWord: getSearchWord(),
        currentPage: "/",
      });
    },
    handleSearch: async (searchWord) => {
      const newUrl = `?search=${searchWord}`;
      history.pushState(null, null, newUrl);
      const pokemonList = await getPokemonList(this.state.type, searchWord);
      this.setState({
        ...this.state,
        searchWord: searchWord,
        pokemonList: pokemonList,
        currentPage: newUrl,
      });
    },
  });

  const pokemonList = new PokemonList({
    $app,
    initialState: this.state.pokemonList,
    handleItemClick: (id) => {
      history.pushState(null, null, `/detail/${id}`);
      this.setState({
        ...this.state,
        currentPage: `/detail/${id}`,
      });
    },

    handleTypeClick: async (type) => {
      history.pushState(null, null, `/${type}`);
      const pokemonList = await getPokemonList(type);
      this.setState({
        ...this.state,
        pokemonList: pokemonList,
        searchWord: getSearchWord(),
        type: type,
        currentPage: `/${type}`,
      });
    },
  });

  this.setState = (newState) => {
    this.state = newState;
    header.setState({
      searchWord: this.state.searchWord,
      currentPage: this.state.currentPage,
    });
    pokemonList.setState(this.state.pokemonList);
  };

  const init = async () => {
    try {
      const pokemonList = await getPokemonList();
      this.setState({
        ...this.state,
        pokemonList: pokemonList,
      });
    } catch (err) {
      console.log(err);
    }
  };

  init();
}
