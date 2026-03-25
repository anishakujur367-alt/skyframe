const fetchAPOD = async () => {
  const res = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=h0u5kE9e8hQuSV5sDufXdelTm7Jyh9M1zqG2hg5t`
  );
  const data = await res.json();
  return data;
};

export default fetchAPOD;