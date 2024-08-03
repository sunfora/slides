const slides = new Slides(document.querySelector("article"));
if (slides.slideWindow.requestFullscreen) {
  document.querySelector(".fullscreen").addEventListener(
        "click", 
        () => slides.slideWindow.requestFullscreen()
  );
} else {
  document.querySelector(".fullscreen").style.display = "none";
}

const animation = animateLetterGrid(slides.slides[0]);
slides.slides[0].onselect = () => {
  console.log("resume");
  animation.resume();
}

slides.slides[0].onlurk = () => {
  console.log("pause");
  animation.pause();
}

window.addEventListener("beforeprint", animation.restore);
window.addEventListener("afterprint", animation.resume); 

animation.resume();
