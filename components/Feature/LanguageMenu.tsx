import { Language } from "@/lib/types";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { languages } from "@/lib/constants";


const LanguageMenu = () => {
    const [selected, setSelected] = useState<Language | null>(null)

    const handleSelect = (lang: any) => {
        console.log(lang);
        
        setSelected(lang)
    }
  return (
    <Select>
      <SelectTrigger className="w-32">
        <SelectValue className="text-white">
          {selected?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem
            key={lang.code}
            value={lang.name}
            onSelect={() => handleSelect(lang)}
          >
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageMenu;
