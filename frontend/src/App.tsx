import { FC } from "react";

const App: FC = (): JSX.Element => {
  return (
    <div className="App">
      <img className="m-auto" src="src/assets/imgs/trans-logo.png" alt="logo" />
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <h1 className="text-3xl font-bold">محمود حمدى</h1>
      <h1 className="text-xl font-bold">محمود حمدى</h1>
      <h1 className="text-sm font-bold">محمود حمدى</h1>
      <h1 className=" font-[300]">محمود حمدى</h1>
    </div>
  );
};

export default App;
