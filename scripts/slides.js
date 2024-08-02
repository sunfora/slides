class Slide {
  constructor(slide, index, id=null, name=null) {
    this.data = slide;
    this.index = index;
    
    this.setName(name);
    this.setId(id);

    const link = document.createElement("a");
    const li = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = this.name();
    li.append(text);
    link.append(li);
    link.setAttribute("href", `#${this.id()}`);
    this.link = link;
  }

  firstHeader() {
    for (const index of [1, 2, 3, 4, 5, 6]) {
      const h = this.data.querySelector(`h${index}`);
      if (h !== null) {
        return h.textContent;
      }
    }
    return null;
  }

  setName(name) {
    return this.data.setAttribute("data-name", 
        name ?? this.data.getAttribute("data-name")
             ?? this.firstHeader()
             ?? `slide ${this.index + 1}`
    );
  }

  name() {
    return this.data.getAttribute("data-name")
  }
  
  setId(id) {
    this.data.setAttribute("id",
      id ?? this.data.getAttribute("id")
         ?? `slide-${this.index + 1}`
    );
  }

  id() {
    return this.data.getAttribute("id");
  }

  isSelected() {
    return this.link.classList.contains("current");
  }

  select() {
    this.link.classList.add("current");
  }
  unselect() {
    this.link.classList.remove("current");
  }
}

function Slides(presentation) {
  this.presentation = presentation;
  this.navList = this.presentation.querySelector("nav ol");
  this.slideWindow = this.presentation.querySelector(".slides");
  
  // register slides 
  const all = this.slideWindow
                  .querySelectorAll(".slide");
  this.slides = [...all].map(
    (data, index) => new Slide(data, index));

  // activate navigation 
  this.slides.forEach(
    slide => this.navList.append(slide.link));
  this.length = this.slides.length;
  this.actualize();
  
  this.slideWindow.addEventListener(
    "scroll", 
    () => this.actualize()
  );

  const isChromium = !!window.chrome;
  this.slideWindow.addEventListener(
        isChromium? "scrollend" : "scroll", 
        () => this.current.link.scrollIntoView({
          behavior: "auto",
          inline: "center"
        })
  );
}

Slides.prototype.actualize = function() {
  const slideWidth = this.slideWindow.scrollWidth / (this.length);
  const index = Math.round(this.slideWindow.scrollLeft / slideWidth);
  
  if (this.current) {
    this.current.unselect();
  }

  this.current = this.slides[index]; 
  this.current.select();
};

const slides = new Slides(document.querySelector("article"));
if (slides.slideWindow.requestFullscreen) {
  document.querySelector(".fullscreen").addEventListener(
        "click", 
        () => slides.slideWindow.requestFullscreen()
  );
} else {
  document.querySelector(".fullscreen").style.display = "none";
}
