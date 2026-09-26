// Посилання на пошук фільму для онлайн-перегляду на YouTube
const poshuk = (nazva) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${nazva} дивитися онлайн`
  )}`;

const filmy = [
  {
    id: 1,
    obraz: "🎬",
    nazva: "Інтерстеллар",
    opys: "Подорож крізь чорні діри та простір-час у пошуках нового дому для людства.",
    zhanr: "Фантастика",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    youtube: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    dyvytysya: poshuk("Інтерстеллар"),
  },
  {
    id: 2,
    obraz: "🐉",
    nazva: "Гра престолів",
    opys: "Епічна битва за Залізний трон у світі Вестеросу з драконами та інтригами.",
    zhanr: "Фентезі",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/d/d8/Game_of_Thrones_title_card.jpg",
    youtube: "https://www.youtube.com/watch?v=rlR4PJn8b8I",
    dyvytysya: poshuk("Гра престолів"),
  },
  {
    id: 3,
    obraz: "🚀",
    nazva: "Марсіанин",
    opys: "Астронавт залишився на Марсі і має вижити наодинці з природою планети.",
    zhanr: "Пригоди",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/c/cd/The_Martian_film_poster.jpg",
    youtube: "https://www.youtube.com/watch?v=ej3ioOneTy8",
    dyvytysya: poshuk("Марсіанин"),
  },
  {
    id: 4,
    obraz: "🦇",
    nazva: "Темний лицар",
    opys: "Бетмен протистоїть хаотичному Джокеру, який хоче занурити Ґотем у анархію.",
    zhanr: "Бойовик",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg",
    youtube: "https://www.youtube.com/watch?v=_PZpmTj1Q8Q",
    dyvytysya: poshuk("Темний лицар"),
  },
  {
    id: 5,
    obraz: "🌊",
    nazva: "Титанік",
    opys: "Історія кохання на борту легендарного лайнера, що зазнав аварії в океані.",
    zhanr: "Мелодрама",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/1/18/Titanic_%281997_film%29_poster.png",
    youtube: "https://www.youtube.com/watch?v=CHekzSiZjrY",
    dyvytysya: poshuk("Титанік"),
  },
  {
    id: 6,
    obraz: "🦁",
    nazva: "Король Лев",
    opys: "Маленький лев Сімба подорослішав і повернувся, щоб забрати свій трон.",
    zhanr: "Анімація",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_poster.jpg",
    youtube: "https://www.youtube.com/watch?v=lFzVJEksoDY",
    dyvytysya: poshuk("Король Лев"),
  },
];

export default filmy;
