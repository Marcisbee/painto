let globalCtx;

function object(fn) {
  return fn.bind(globalCtx);
}

function canvas(canvas, keys, userState, actions, render) {
  function resizeGame() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeGame, false);
  window.addEventListener('orientationchange', resizeGame, false);
  resizeGame();

  let ctx = canvas.getContext('2d');
  globalCtx = ctx;
  let lastState = '';
  const state = {
    userState,
    pressed: [],
  };

  let keysPressedMap = {};

  function keyup(e) {
    const code = e.keyCode;
    if (keys[code]) {
      const index = state.pressed.indexOf(code);
      if (index >= 0) {
        state.pressed.splice(index, 1);
      }
      keysPressedMap = state.pressed.reduce((acc, key) => ({ ...acc, [keys[key].type]: true }), {});
    }
  }
  function keydown(e) {
    const code = e.keyCode;
    if (keys[code]) {
      const index = state.pressed.indexOf(code);
      if (index < 0) {
        state.pressed.push(code);
      }
      keysPressedMap = state.pressed.reduce((acc, key) => ({ ...acc, [keys[key].type]: true }), {});
    }
  }
  window.addEventListener('keyup', keyup, false);
  window.addEventListener('keydown', keydown, false);

  function handleActions(pressed) {
    for (let index = 0; index < pressed.length; index++) {
      actions[pressed[index]]();
    }
  }

  function tick() {
    requestAnimationFrame(() => {
      handleActions(Object.keys(keysPressedMap));
      const currentState = JSON.stringify(state);
      const tempState = lastState;
      lastState = currentState;
      if (tempState === currentState) {
        tick();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      render(keysPressedMap);

      tick();
    });
  }

  return tick();
}

export default {
  canvas,
  object,
}
