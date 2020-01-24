import React from "react";
import { render } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";

test("should perform a basic dice calculation", async () => {
  const { getByText, getByLabelText } = render(<App />);
  const formulaInput = getByLabelText(/formula/i);
  const rollButton = getByText(/roll/i);

  await userEvent.type(formulaInput, "1d1+4");
  userEvent.click(rollButton);

  // Results of submitting the form
  getByText(/re-roll/i);
  getByText(/5/i);
});
