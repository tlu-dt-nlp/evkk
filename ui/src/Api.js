export const postMinitornPikkus = (input) => {
  const asString = JSON.stringify({ input });
  return fetch('/api/tools/minitorn-pikkus', {
    body: asString,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;UTF-8'
    }
  });
};

export const postMasinoppeEnnustus = (input) => {
  const asString = JSON.stringify({ input });
  return fetch('/api/tools/masinoppe-ennustus', {
    body: asString,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;UTF-8'
    }
  });
};
