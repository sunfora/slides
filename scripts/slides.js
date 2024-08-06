class Slide {
  constructor(slide, index, id=null, name=null) {
    this.onselect = () => {};
    this.onlurk = () => {}; 

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
    this.onselect(this);
  }

  unselect() {
    this.link.classList.remove("current");
    this.onlurk(this);
  }
}

class Slides {
  constructor(presentation) {
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
    
    this.#actualize();

    this.slideWindow.addEventListener(
      "scroll", 
      () => {
        this.#actualize();
      }
    );

    const isChromium = !!window.chrome;
    this.slideWindow.addEventListener(
      isChromium? "scrollend" : "scroll", 
      () => this.#scrollNav() 
    );
  
    window.addEventListener(
      "hashchange",
      (e) => 
      {
          e.preventDefault();
          document.querySelector(location.hash).scrollIntoView();
      }
    );
    window.addEventListener(
      "DOMContentLoaded",
      () => 
      {
        document.querySelector(location.hash).scrollIntoView();
      }
    );

    window.addEventListener(
      "resize",
      () => {
        this.current.data.scrollIntoView(
          {
            behavior: "instant"
          }
        );
      }
    );
  }
  #scrollNav() {
    this.#actualize();
    this.current.link.scrollIntoView({
      behavior: "auto",
      inline: "center"
    });
  }

  #actualize() {
    const slideWidth = this.slideWindow.scrollWidth / (this.length);
    const index = Math.round(this.slideWindow.scrollLeft / slideWidth);
    
    if (this.current) {
      this.current.unselect();
    }

    this.current = this.slides[index]; 
    this.current.select();
  }
}
