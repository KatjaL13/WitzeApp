const API_ENDPOINT = "https://witzapi.de/api/joke";

export async function fetchJoke() {
  const result = await fetch(API_ENDPOINT);

  const jokes = await result.json();

  return jokes[0].text;
}
