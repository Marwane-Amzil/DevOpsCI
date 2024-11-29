import { describe, it, expect, vi } from "vitest";
import { PokemonService } from "~/services/PokemonService";
import { PokeApiClient } from "~/services/PokeApiClient";
import { Pokemon } from "~/services/pokemon";

const mockPokeApiClient = {
  getPokemonList: vi.fn(),
};

describe("Pokemon", () => {
  it("should_return_true_if_pokemon_is_awesome", () => {
    // Given
    const pokemon = { isAwesome: true };

    // When
    const result = pokemon.isAwesome;

    // Then
    expect(result).toBe(true);
  });

  it("should_return_false_if_pokemon_is_not_awesome", () => {
    // Given
    const pokemon = { isAwesome: false };

    // When
    const result = pokemon.isAwesome;

    // Then
    expect(result).toBe(false);
  });
});
describe("PokemonService", () => {
  const pokemonService = new PokemonService(mockPokeApiClient as unknown as PokeApiClient);

  it("should fetch the pokemon list from PokeApiClient", async () => {
    const mockPokemonList: Pokemon[] = [
      { id: 1, name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
    ];
    mockPokeApiClient.getPokemonList.mockResolvedValue(mockPokemonList);

    const pokemonList = await pokemonService.getPokemonList();

    expect(mockPokeApiClient.getPokemonList).toHaveBeenCalled();
    expect(pokemonList).toEqual(mockPokemonList);
  });

  it("should return an empty array for a user without a team", () => {
    const userId = "user-1";
    const team = pokemonService.getUserTeam(userId);
    expect(team).toEqual([]);
  });

  it("should return the correct team for a user", () => {
    const userId = "user-2";
    const mockTeam: Pokemon[] = [{ id: 25, name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" }];
    pokemonService["userTeams"].set(userId, mockTeam);

    const team = pokemonService.getUserTeam(userId);
    expect(team).toEqual(mockTeam);
  });

  it("should clear a user's team", () => {
    const userId = "user-3";
    const mockTeam: Pokemon[] = [{ id: 4, name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" }];
    pokemonService["userTeams"].set(userId, mockTeam);

    pokemonService.clearTeam(userId);

    const team = pokemonService.getUserTeam(userId);
    expect(team).toEqual([]);
  });

  it("should add a Pokemon to a user's team if not already present", () => {
    const userId = "user-4";
    const mockPokemon: Pokemon = { id: 7, name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" };

    const result = pokemonService.togglePokemonInTeam(userId, mockPokemon);

    const team = pokemonService.getUserTeam(userId);
    expect(result).toBe(true);
    expect(team).toContain(mockPokemon);
  });

  it("should remove a Pokemon from a user's team if already present", () => {
    const userId = "user-5";
    const mockPokemon: Pokemon = { id: 7, name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" };
    pokemonService["userTeams"].set(userId, [mockPokemon]);

    const result = pokemonService.togglePokemonInTeam(userId, mockPokemon);

    const team = pokemonService.getUserTeam(userId);
    expect(result).toBe(true);
    expect(team).not.toContain(mockPokemon);
  });

  it("should not add a Pokemon to a team if it already has 6 Pokemon", () => {
    const userId = "user-6";
    const mockTeam: Pokemon[] = [
      { id: 1, name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      { id: 2, name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
      { id: 3, name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
      { id: 4, name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
      { id: 5, name: "charmeleon", url: "https://pokeapi.co/api/v2/pokemon/5/" },
      { id: 6, name: "charizard", url: "https://pokeapi.co/api/v2/pokemon/6/" },
    ];
    pokemonService["userTeams"].set(userId, mockTeam);

    const mockPokemon: Pokemon = { id: 7, name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" };

    const result = pokemonService.togglePokemonInTeam(userId, mockPokemon);

    const team = pokemonService.getUserTeam(userId);
    expect(result).toBe(false);
    expect(team).not.toContain(mockPokemon);
  });
});
