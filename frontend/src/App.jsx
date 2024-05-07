import "./App.css";

function App() {
  return (
    <div>
      <div>
        <h1 className="text-4xl">Add Excel File</h1>
      </div>
      <div className="rounded-lg border-black border-2 p-10">
        <h1 className="text-3xl mb-5">Add candidates to database</h1>
        <div>
          <form className="upload">
            <input type="file" name="uploadFile" accept=".xlsx" required />
            <input className=" border-black hover:bg-slate-200 rounded-lg p-2" type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
