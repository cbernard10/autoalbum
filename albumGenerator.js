import fs from "fs";
import { execSync } from "child_process";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const make_album = async (slow, album_name, data) => {
  if (!fs.existsSync(`./${album_name}`)) {
    fs.mkdirSync(`./${album_name}`);
  }
  const urls = data.songs;

  for (let i = 0; i < urls.length; i++) {
    const name = urls[i].url.split("=")[1].replaceAll("-", "_");

    console.log(`sh autoslowreverb.sh -s ${urls[i].url} -o ${name} -r ${slow}`);
    execSync(`sh autoslowreverb.sh -s ${urls[i].url} -o ${name} -r ${slow}`);
    console.log(`mv ${name}.mp3 ${album_name}/${name}.mp3`);
    execSync(`mv ${name}.mp3 ${album_name}/`);
    execSync(`rm ${name}.wav`);

    await sleep(2000);
  }
};

export default make_album;
