import { useEffect, useState } from "react";
import { PokeAPI } from "./api";
PokeAPI.listPokemons()
.then ((response) => console.log(response))

const typeColors: Record<string, { bg: string; text: string }> = {
  normal: { bg: "bg-gray-200", text: "text-gray-800" },
  fire: { bg: "bg-red-200", text: "text-red-800" },
  water: { bg: "bg-blue-200", text: "text-blue-800" },
  grass: { bg: "bg-green-200", text: "text-green-800" },
  electric: { bg: "bg-yellow-200", text: "text-yellow-800" },
  ice: { bg: "bg-cyan-200", text: "text-cyan-800" },
  fighting: { bg: "bg-orange-700", text: "text-white" },
  poison: { bg: "bg-purple-200", text: "text-purple-800" },
  ground: { bg: "bg-amber-600", text: "text-white" },
  flying: { bg: "bg-sky-200", text: "text-sky-800" },
  psychic: { bg: "bg-pink-200", text: "text-pink-800" },
  bug: { bg: "bg-lime-200", text: "text-lime-800" },
  rock: { bg: "bg-slate-400", text: "text-white" },
  ghost: { bg: "bg-indigo-300", text: "text-indigo-900" },
  dragon: { bg: "bg-blue-700", text: "text-white" },
  dark: { bg: "bg-gray-800", text: "text-white" },
  steel: { bg: "bg-slate-300", text: "text-slate-900" },
  fairy: { bg: "bg-fuchsia-200", text: "text-fuchsia-800" },
};

const getTypeColor = (type: string) => {
  return typeColors[type.toLowerCase()] || { bg: "bg-gray-200", text: "text-gray-800" };
};

type Props = {
  id: number;
  image: string;
  name: string;
  types: string[];
  onCardClick: (id: number) => void;
};
export const Card : React.FC<Props> = ({ id, image, name, types, onCardClick }) => {
  return (
    <div onClick={() => onCardClick(id)} className="w-60 h-60 border-2 bg-white rounded-lg shadow-lg p-4 flex flex-col justify-center items-center cursor-pointer hover:shadow-xl transition-shadow">
      <img src={image} alt={name} className="w-30 h-20 object-contain mb-1" />
      <h2 className="text-xl font-bold mb-1 text-center">{name}</h2>
      <p className="text-gray-600 mb-1 text-center">ID: {id}</p>
      <div className="flex flex-wrap justify-center gap-1">
        {types.map((type) => {
          const colors = getTypeColor(type);
          return (
            <span key={type} className={`px-2 py-1 ${colors.bg} ${colors.text} rounded-full text-sm`}>
              {type}
            </span>
          );
        })}
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
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const [selectedPokemonDetails, setSelectedPokemonDetails] = useState<any>(null);

  useEffect(() => {
    PokeAPI.listPokemons()
      .then(async (response) => {
        const transformedPokemons = await Promise.all(
          response.results.map(async (pokemon: any) => {
            const pokemonDetail = await PokeAPI.getPokemonByName(pokemon.name);
            return {
              id: pokemonDetail.id,
              image: pokemonDetail.sprites?.other?.["official-artwork"]?.front_default || "",
              name: pokemonDetail.name,
              types: pokemonDetail.types?.map((t: any) => t.type.name) || [],
            };
          })
        );
        setPokemons(transformedPokemons);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleCardClick = async (id: number) => {
    try {
      const details = await PokeAPI.getPokemonById(id);
      setSelectedPokemonId(id);
      setSelectedPokemonDetails(details);
    } catch (error) {
      console.error("Error fetching Pokemon details:", error);
    }
  };

  const closeModal = () => {
    setSelectedPokemonId(null);
    setSelectedPokemonDetails(null);
  };

  fetchData();
  
  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center p-8">
        <div className="flex flex-wrap gap-6 justify-center items-start w-full max-w-7xl">
          {pokemons.map((pokemon) => (
            <Card
              key={pokemon.id}
              id={pokemon.id}
              image={pokemon.image}
              name={pokemon.name}
              types={pokemon.types}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      </div>

      {selectedPokemonId && selectedPokemonDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <button
                onClick={closeModal}
                className="float-right text-2xl font-bold text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="flex-1 flex justify-center md:block">
                  <img
                    src={selectedPokemonDetails.sprites?.other?.["official-artwork"]?.front_default || selectedPokemonDetails.sprites?.front_default || ""}
                    alt={selectedPokemonDetails.name}
                    className="w-64 h-64 object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-4 capitalize">{selectedPokemonDetails.name}</h1>
                  <p className="text-xl text-gray-600 mb-4">ID: {selectedPokemonDetails.id}</p>

                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-3">Tipi</h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedPokemonDetails.types?.map((t: any) => {
                        const colors = getTypeColor(t.type.name);
                        return (
                          <span key={t.type.name} className={`px-4 py-2 ${colors.bg} ${colors.text} rounded-full font-semibold`}>
                            {t.type.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-3">Statistiche</h2>
                    <div className="space-y-2">
                      {selectedPokemonDetails.stats?.map((stat: any) => (
                        <div key={stat.stat.name} className="flex justify-between">
                          <span className="font-semibold capitalize">{stat.stat.name}</span>
                          <span className="text-gray-600">{stat.base_stat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

