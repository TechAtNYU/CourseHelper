import crxLogo from "@/assets/crx.svg";
import reactLogo from "@/assets/react.svg";
import viteLogo from "@/assets/vite.svg";
import HelloWorld from "@/components/HelloWorld";

export default function App() {
  return (
    <div>
      <a href="https://vite.dev" target="_blank" rel="noreferrer">
        <img src={viteLogo} alt="Vite logo" />
      </a>
      <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
        <img src={reactLogo} alt="React logo" />
      </a>
      <a href="https://crxjs.dev/vite-plugin" target="_blank" rel="noreferrer">
        <img src={crxLogo} alt="crx logo" />
      </a>
      <HelloWorld msg="Vite + React + CRXJS" />
    </div>
  );
}
