import { Canvas } from "./components/Canvas";

const App = () => {

  return (
    <div style={{width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <h1 style={{margin: '0 0 18px 0'}} >FSM Diagram</h1>
      <Canvas />
    </div>
  );
};

export default App;
