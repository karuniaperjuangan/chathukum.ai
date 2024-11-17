import { createContext } from "react";
import { Law } from "../model/law";

export const SelectedLawsContext = createContext<{ currentSelectedLaws: Law[]; setCurrentSelectedLaws: React.Dispatch<React.SetStateAction<Law[]>>; }>({currentSelectedLaws: [], setCurrentSelectedLaws: () => null});