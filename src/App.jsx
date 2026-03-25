import fetchAPOD from "./api/nasa";

function App(){
  console.log(fetchAPOD())

  return (
    <div>
      <h1>Hello</h1>
    </div>
  )
}

export default App;