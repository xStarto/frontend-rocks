import { useEffect, useState } from "react";
import { PokeAPI } from "./api";
PokeAPI.listPokemons()
.then ((response) => console.log(response))
type Props = {
  id: number;
  image: string;
  name: string;
  types: string[];
};
export const Card : React.FC<Props> = ({ id, image, name, types }) => {
  return (
    <div className="w-60 h-60 border-2 bg-white rounded-lg shadow-lg p-4 flex-col justify-center items-center">
      <img src={image} alt={name} className="w-30 h-20 object-contain mb-1" />
      <h2 className="text-xl font-bold mb-1">{name}</h2>
      <p className="text-gray-600 mb-1">ID: {id}</p>
      <div className="flex space-x-2">
        {types.map((type) => (
          <span key={type} className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
export function fetchData() {
  useEffect(() => {
    PokeAPI.listPokemons()
      .then((response) => console.log(response))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
}

export function Root() {
  const [pokemons, setPokemons] = useState<{
    id: number;
    image: string;
    name: string;
    types: string[];
  }[]>([]);
  useEffect(() => {
    PokeAPI.listPokemons()
      .then((response) => {
        const transformedPokemons = response.results.map((pokemon: any) => ({
          id: pokemon.id || 0,
          image: pokemon.image || "",
          name: pokemon.name,
          types: pokemon.types || [],
        }));
        setPokemons(transformedPokemons);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  fetchData();
  return (<div className="pt-4 pl-4 space-x-4 flex items-start justify-start flex-wrap space-y-4">
    {pokemons.map((pokemon) => (
      <Card
        key={pokemon.id}
        id={pokemon.id}
        image={pokemon.image}
        name={pokemon.name}
        types={pokemon.types}
      />
    ))}</div>
  );
}

