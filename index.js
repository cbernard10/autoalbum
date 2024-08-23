import generate_songs from "./playlistGenerator.js";
import make_album from "./albumGenerator.js";

const genre = process.argv[2].split(" ").join("+");
const mood = process.argv[3].split(" ").join("+");
const slow = process.argv[4];
const n_songs = process.argv[5];
const album_name = process.argv[6];

if (
  !["study", "chill", "workout", "sleep", "party", "happy", "sad"].includes(
    mood
  )
) {
  console.log("Invalid mood");
  process.exit(1);
}

const main = async () => {
  console.log(genre, mood, slow, n_songs, album_name);
  const data = await generate_songs(genre, mood, n_songs);
  make_album(slow, album_name, data);
};

main();
