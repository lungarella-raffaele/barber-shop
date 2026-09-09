import { createContext } from "svelte";

import type { PageProps } from "./$types";

type Context = {
  data: PageProps["data"];
  form: PageProps["form"];
};
export const [getDataContext, setDataContext] = createContext<Context>();
