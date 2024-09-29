// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";

import { render } from "react-dom";
import App from "./App";

const rootElement = document.getElementById("root") as HTMLElement;
render(<App />, rootElement);