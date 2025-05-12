import api from "../services/api";

export function anosSelect() {
  const anos = [2025, 2024, 2023, 2022, 2021, 2020, 2019];

  return anos;
}

export const onlyLettersAndCharacters = (
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  const regex = /^[a-záàâãéèêíïóôõöúçñ ]+$/i;
  if (
    !regex.test(e.key) &&
    e.key !== "Backspace" &&
    e.key !== "Delete" &&
    e.key !== "ArrowLeft" &&
    e.key !== "ArrowRight"
  ) {
    e.preventDefault();
  }
};

export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const capitalizeFrasal = (Frasal: string) => {
  const lowerCaseWords = ["de", "da", "do", "das", "dos", "e"];

  return Frasal.toLowerCase()
    .split(" ")
    .map((word) =>
      lowerCaseWords.includes(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};
