import blessed from "blessed";
import exec from "child_process";

function playPause() {
  exec.exec("playerctl play-pause", (error, stdout, stderr) => {});
}

function nextTrack() {
  exec.exec("playerctl next", (error, stdout, stderr) => {});
}

function previousTrack() {
  exec.exec("playerctl previous", (error, stdout, stderr) => {});
}

var screen = blessed.screen({
  smartCSR: true,
});
screen.title = "Node.js Player Control";

const prevButton = blessed.button({
  top: "5",
  left: "25%-5",
  fg: "white",
  border: "line",
  mouse: true,
  content: "  (j)",
  width: 9,
  shrink: true,
  align: "center",
});

const playPauseButton = blessed.button({
  top: "5",
  left: "50%-7",
  border: "line",
  mouse: true,
  content: "  (Space)",
  width: 13,
  shrink: true,
  align: "center",
});
const nextButton = blessed.button({
  top: "5",
  left: "75%-5",
  border: "line",
  mouse: true,
  content: "  (k)",
  width: 9,
  shrink: true,
  align: "center",
});

prevButton.on("click", function () {
  previousTrack();
  screen.render();
});

screen.key("j", function (ch, key) {
  previousTrack();
  screen.render();
});
playPauseButton.on("click", function () {
  playPause();
  screen.render();
});

screen.key("space", function (ch, key) {
  playPause();
  screen.render();
});
nextButton.on("click", function () {
  nextTrack();
  screen.render();
});

screen.key("k", function (ch, key) {
  nextTrack();
  screen.render();
});

const songText = blessed.box({
  top: 4,
  left: "25%",
  width: "50%",
  align: "center",
  content: "Artist: {artist}",
  style: {
    fg: "blue",
    bold: true,
  },
});
const artistText = blessed.box({
  top: 6,
  left: "25%",
  width: "50%",
  align: "center",
  content: "Song: {song}",
  style: {
    fg: "white",
    bold: true,
  },
});
const albumText = blessed.box({
  top: 8,
  left: "25%",
  width: "50%",
  align: "center",
  content: "Album: {album}",
  style: {
    fg: "white",
  },
});

function refreshMetadata() {
  exec.exec(
    "playerctl metadata --format '{{ artist }} AA-AA {{ title }} AA-AA {{ album }}'",
    (error, stdout, stderr) => {
      const meta = stdout.split(" AA-AA ");
      songText.setContent(`${meta[1]}`);
      artistText.setContent(`${meta[0]}`);
      albumText.setContent(`${meta[2]}`);
      screen.render();
    },
  );
}

refreshMetadata();
setInterval(refreshMetadata, 1000);

screen.append(prevButton);
screen.append(playPauseButton);
screen.append(nextButton);

screen.append(songText);
screen.append(artistText);
screen.append(albumText);

screen.key(["q", "C-c"], function (ch, key) {
  return process.exit(0);
});

screen.render();
