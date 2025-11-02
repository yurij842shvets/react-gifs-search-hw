import React from "react";

export default class GifSearch extends React.Component {
  state = {
    inputValue: "",
    gifs: [],
    keyword: this.props.defaultKeyword || "forest",
    loading: false,
  };

  componentDidMount() {
    this.fetchGifs(this.state.keyword);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.keyword !== this.state.keyword) {
      this.fetchGifs(this.state.keyword);
    }
  }

  fetchGifs = async (keyword) => {
    const APIKEY = "3oyS5pOSFwgGDOVpuUApL0rxPooECVK4";

    this.setState({ loading: true });

    try {
      const endpoint = keyword
        ? `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&q=${encodeURIComponent(
            keyword
          )}&limit=12`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${APIKEY}&limit=12`;

      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`HTTP error, status: ${res.status}`);
      }
      const data = await res.json();
      this.setState({ gifs: data.data || [], loading: false });
    } catch (error) {
      console.log(error);
      this.setState({ gifs: [], loading: false });
    }
  };

  handleChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSearch = (e) => {
    e.preventDefault();
    const { inputValue } = this.state;
    if (inputValue.trim()) {
      this.setState({ keyword: inputValue.trim(), inputValue: "" });
    }
  };

  render() {
    const { inputValue, gifs, loading } = this.state;
    return (
      <>
        <form onSubmit={this.handleSearch}>
          <h1>Gif Search Component</h1>
          <input
            type="search"
            value={inputValue}
            onChange={this.handleChange}
          />
          <button>Search</button>
        </form>

        {loading && <h2>Loading...</h2>}
        <div>
          {gifs.map((gif) => {
            const src =
              gif?.images?.fixed_height_downsampled?.url ||
              gif?.images?.fixed_height?.url ||
              gif?.images?.downsized?.url ||
              "";
            if (!src) return null;
            return (
              <img
                key={gif.id}
                src={src}
                alt={gif.title || "gif"}
                loading="lazy"
              />
            );
          })}
        </div>
      </>
    );
  }
}
