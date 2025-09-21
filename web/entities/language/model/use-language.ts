import { useQuery } from "@tanstack/react-query";
import { getLanguage } from "../api/get";

export const useLanguageQuery = (tgid: number) => {
  return useQuery({
    queryKey: ["language", tgid],
    queryFn: () => getLanguage(tgid),
  });
};

export const setLanguageQuery = (tgid: number, language: "RU" | "ENG") => {};
