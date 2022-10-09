import { FC } from "react";
import "./assets/styles/App.css";

const App: FC = (): JSX.Element => {
  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <h1 className="text-3xl font-bold">محمود حمدى</h1>
      <h1 className="text-xl font-bold">محمود حمدى</h1>
      <h1 className="text-sm font-bold">محمود حمدى</h1>
      <h1 className=" font-[300]">محمود حمدى</h1>
    </div>
  );
};

export default App;
