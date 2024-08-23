import puppeteer from "puppeteer";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getUrls = async (browser, page, url, n, mood) => {
  const ytIds = [];
  await page.goto(url);

  page.on("response", async (response) => {
    if (response.url().includes("get-song-video")) {
      console.log("response code: ", response.status());
      const id = await response.json();
      const req = await response.request();
      const optstring = decodeURI(req.url()).split("?")[1];
      const title = optstring.split("&")[0].split("=")[1];
      const artist = optstring.split("&")[1].split("=")[1];
      const dict = {
        url: `https://www.youtube.com/watch?v=${id}`,
        title: title,
        artist: artist,
      };
      console.log(dict);
      ytIds.push(dict);
    }
  });

  await sleep(5000);

  const elementHandle = await page.waitForSelector(
    "[id=sp_message_iframe_1169893]"
  );
  const frame = await elementHandle.contentFrame();
  await frame.waitForSelector("#notice");
  console.log("notice located");

  await frame.waitForSelector("#notice > div > div > button");
  console.log("button located");
  const acceptButton = await frame.$(
    "#notice > div > div > .sp_choice_type_11"
  );
  await acceptButton.click();
  console.log("button clicked");

  const studyButton = await page.$(`[data-mood-option='${mood}']`);
  await studyButton.click();

  await sleep(2000);

  await page.waitForSelector("#play-all-yt");
  console.log("play all located");
  const playAllButton = await page.$("#play-all-yt");
  await playAllButton.click();

  for (let i = 1; i < n; i++) {
    await sleep(2000);
    const nextButton = await page.$("div.yt-buttons>button.next");
    await nextButton.click();
  }

  await browser.close();
  return ytIds;
};


const generate_songs = async (genre, mood, n) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--lang=en-US"],
    defaultViewport: { width: 1920, height: 2080 },
  });
  let page = await browser.newPage();

  const url = `https://www.chosic.com/playlist-generator/?genre=${genre}&n=10`;

  const songs = await getUrls(browser, page, url, n, mood);

  const output = {
    genre: genre,
    mood: mood,
    songs: songs,
  };

  return output

};

export default generate_songs;