//COMPONENTS
import PokemonList from "./components/PokemonList.js";
import Header from "./components/Header.js";
import PokemonDetail from "./components/PokemonDetail.js";

//APIS
import { getPokemonDetail, getPokemonList } from "./modules/api.js";

export default function App($app) {
  const getSearchWord = () => {
    if (window.location.search.includes("search=")) {
      return window.location.search.split("search=")[1];
    }
    return "";
  };

  this.state = {
    type: window.location.pathname.replace("/", ""),
    pokemonList: [],
    searchWord: getSearchWord(),
    currentPage: window.location.pathname,
  };

  const renderHeader = () => {
    new Header({
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
  };

  const renderPokemonList = () => {
    new PokemonList({
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
  };

  const renderPokemonDetail = async (pokemonId) => {
    try {
      const pokemonDetail = await getPokemonDetail(pokemonId);
      new PokemonDetail({
        $app,
        initialState: pokemonDetail,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const render = () => {
    $app.innerHTML = "";
    if (this.state.currentPage.includes("/detail/")) {
      const pokemonId = this.state.currentPage.split("/detail/")[1];
      renderHeader();
      renderPokemonDetail(pokemonId);
    } else {
      renderHeader();
      renderPokemonList();
    }
  };

  this.setState = (newState) => {
    this.state = newState;
    render();
  };

  const init = async () => {
    const path = this.state.currentPage;
    if (!path.startsWith("/detail/")) {
      try {
        const pokemonList = await getPokemonList(
          this.state.type,
          this.state.searchWord
        );
        this.setState({
          ...this.state,
          pokemonList: pokemonList,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      render();
    }
  };

  window.addEventListener("popstate", async () => {
    const urlPath = window.location.pathname;
    const prevType = urlPath.replace("/", "");
    const prevSearchWord = getSearchWord();
    const prevPokemonList = await getPokemonList(prevType, prevSearchWord);

    this.setState({
      ...this.state,
      type: prevType,
      pokemonList: prevPokemonList,
      searchWord: prevSearchWord,
      currentPage: urlPath,
    });
  });

  init();
}
