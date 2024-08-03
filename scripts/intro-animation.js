function animateLetterGrid(slide) {
  const intro = slide.data;
  const cells = [...intro.querySelectorAll("h1 span")];
  const dot = intro.querySelector("h1 .dot");

  /* hardcoded */
  const original = [
    [1, 1], [1, 2], [2, 1],
    [1, 3], [2, 2], [2, 3],
    [3, 1], [3, 2], [3, 3]
  ];

  let coords = [...original];

  function find(pos) {
    return coords.findIndex((p) => p[0] == pos[0] && p[1] == pos[1]);
  }

  function pick(a) {
    return a[Math.round(Math.random() * (a.length - 1))];
  }

  function current() {
    return coords[coords.length - 1];
  }

  function calc(pos, move) {
    const [x, y] = pos;
    const [dx, dy] = move;
    return [x + dx, y + dy];
  }

  function valid(pos, move) {
    const [x, y] = calc(pos, move);
    return (1 <= x && x <= 3)
        && (1 <= y && y <= 3);
  }

  function move(src) {
    const moves = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    let move = pick(moves);
    while (!valid(src, move)) {
      move = pick(moves);
    }

    return move;
  }

  function reorderOnScreen(positions) {
    for (let i = 0; i < cells.length; i++) {
      const [row, column] = positions[i];
      cells[i].style.gridRow = row;
      cells[i].style.gridColumn = column;
    }
  }

  function swap(src, dest) {
    const i = find(src);
    const j = find(dest);
    coords[i] = dest;
    coords[j] = src;
  }

  let iteration = 0;

  function lex([a, b], [c, d]) {
    if (a < c) {
      return -1;
    }
    if ((a === c) &&  b < d) {
      return -1;
    } else if ((a===c) && b===d) {
      return 0;
    }
    return 1;
  }

  const SWAP_SPEED = 1000;

  function findFinalPosition(cell, dest) {
    const grid = cell.parentElement;
    const gridRect = grid.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    return {
      x: gridRect.x + (dest[1] - 1) * (cellRect.width),
      y: gridRect.y + (dest[0] - 1) * (cellRect.height)
    };
  }

  function calculateTranslation(src, dst) {
    return {
      transformOrigin: 'top left',
      transform: `translate(${dst.x - src.x}px, ${dst.y - src.y}px)`
    };
  }

  function translate(cell, sorc, dest) {
      const [sorcY, sorcX] = sorc;
      const [destY, destX] = dest;

      if (destX === sorcX && destY === sorcY) {
        return;
      }
      
      const final = findFinalPosition(cell, dest);
      const from = cell.getBoundingClientRect();

      const translate = cell.animate(
        calculateTranslation(from, final)
        , {
          duration: SWAP_SPEED,
          easing: 'ease'
        }
      );

      const place = () => {
        cell.style.gridRow = dest[0];
        cell.style.gridColumn = dest[1];
      };
      
      translate.onfinish = place;
      translate.oncancel = place;
  }

  function cycle() {
    before = [...coords];

    if (iteration % 3 === 0) {
      coords = 
        [...coords.slice(0, 3).sort(lex), 
         ...coords.slice(3, 6).sort(lex), 
         ...coords.slice(6, 8).sort(lex), 
         ...coords.slice(8, 9)];
    } else {
      const src = current();
      const dest = calc(src, move(src));
      swap(src, dest); 
    }
    
    cells.forEach((e, i) => {
      translate(e, before[i], coords[i]);
    });
    
    iteration += 1;
  }

  const SPEED = 1200;
  let id = null;

  function resume() {
    if (id) {
      return;
    }
    reorderOnScreen(coords);
    id = setInterval(() => { cycle(); console.log(id)}, SPEED);
  }

  function pause() {
    if (!id) {
      return;
    }
    clearInterval(id);
    cells.forEach(c => c.getAnimations().forEach(a => a.finish()));
    id = null;
  }

  function restore() {
    pause();
    reorderOnScreen(original);
  }

  return {
    resume,
    pause,
    restore
  }
}
