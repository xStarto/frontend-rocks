import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { PokeAPI } from "./api";

export const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    PokeAPI.getPokemonById(parseInt(id))
      .then((response) => {
        setPokemon(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Pokemon detail:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center pt-10 text-2xl">Caricamento...</div>;
  
  if (!pokemon) return <div className="text-center pt-10 text-2xl">Pokemon non trovato</div>;

  const types = pokemon.types?.map((t: any) => t.type.name) || [];
  const image = pokemon.sprites?.other?.["official-artwork"]?.front_default || pokemon.sprites?.front_default || "";

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button 
        onClick={() => navigate("/")} 
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        ← Torna indietro
      </button>
      
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <img src={image} alt={pokemon.name} className="w-full h-auto object-contain" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4 capitalize">{pokemon.name}</h1>
            <p className="text-xl text-gray-600 mb-4">ID: {pokemon.id}</p>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">Tipi</h2>
              <div className="flex flex-wrap gap-2">
                {types.map((type: string) => (
                  <span key={type} className="px-4 py-2 bg-blue-200 text-blue-800 rounded-full font-semibold">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">Statistiche</h2>
              <div className="space-y-2">
                {pokemon.stats?.map((stat: any) => (
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
  );
}