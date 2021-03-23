function keybinds(context) {
  document.onkeydown = (e) => {
    if (e.ctrlKey && e.code === 'Space') {
      e.preventDefault();
      // eslint-disable-next-line no-param-reassign
      context.status = !context.status;
      // eslint-disable-next-line no-param-reassign
      if (context.$refs.match) {
        // eslint-disable-next-line no-param-reassign
        context.audioStatus = context.status ? context.$refs.match.play() : context.audioPause();
      }
      if (context.match) {
        // eslint-disable-next-line no-param-reassign
        context.audioStatus = context.status ? context.match.play() : context.audioPause();
      }
    } else if (e.ctrlKey && e.code === 'Digit1') {
      e.preventDefault();
      context.handleInsert(1);
    } else if (e.ctrlKey && e.code === 'Digit2') {
      e.preventDefault();
      context.handleInsert(2);
    } else if (e.ctrlKey && e.code === 'Digit3') {
      e.preventDefault();
      context.handleInsert(3);
    } else if (e.ctrlKey && e.code === 'Digit4') {
      e.preventDefault();
      context.handleInsert(4);
    } else if (e.ctrlKey && e.code === 'Digit5') {
      e.preventDefault();
      context.handleInsert(5);
    } else if (e.altKey && e.code === 'KeyX') {
      e.preventDefault();
      context.handleRemove();
    } else if (e.ctrlKey && e.code === 'KeyR') {
      e.preventDefault();
    } else if (e.code === 'Backspace') {
      if (context.$refs[context.currentBlock][0].value === '') {
        context.handleRemove();
      }
    }
  };
}
export default keybinds;
