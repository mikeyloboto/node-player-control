import blessed from "blessed";
import exec from "child_process";

function playPause() {
	exec.exec("playerctl play-pause", (error, stdout, stderr) => { });
}

function nextTrack() {
	exec.exec("playerctl next", (error, stdout, stderr) => { });
}

function previousTrack() {
	exec.exec("playerctl previous", (error, stdout, stderr) => { });
}

var screen = blessed.screen({
	smartCSR: true,
});
screen.title = "Node.js Player Control";

const prevButton = blessed.button({
	top: "center",
	left: "25%",
	fg: "white",
	border: "line",
	mouse: true,
	content: "Prev",
	width: 10,
	shrink: true,
	align: "center",
});

const playPauseButton = blessed.button({
	top: "center-5",
	left: "50%-6",
	border: "line",
	mouse: true,
	content: "  (Space)",
	width: 13,
	shrink: true,
	align: "center",
});
const nextButton = blessed.button({
	top: "center",
	left: "75%",
	border: "line",
	mouse: true,
	content: "Next",
	width: 10,
	shrink: true,
	align: "center",
});

prevButton.on("click", function () {
	previousTrack();
	screen.render();
});

screen.key("k", function (ch, key) {
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

screen.key("j", function (ch, key) {
	nextTrack();
	screen.render();
});

screen.append(prevButton);
screen.append(playPauseButton);
screen.append(nextButton);

screen.key(["q", "C-c"], function (ch, key) {
	return process.exit(0);
});

screen.render();
