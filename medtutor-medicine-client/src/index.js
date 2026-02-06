import React from "react";
import { createRoot} from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";

import { VisionUIControllerProvider } from "context";
import { PacienteProvider } from "context/PacienteContext";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);


root.render(<BrowserRouter>
  <VisionUIControllerProvider>
    <PacienteProvider>
      <App />
    </PacienteProvider>
  </VisionUIControllerProvider>
</BrowserRouter>)

