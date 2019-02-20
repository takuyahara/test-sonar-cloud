import addons from '@storybook/addons';

export function generateQrcodes(href) {
  var channel = addons.getChannel();

  return function (getStory) {
    return function (context) {
      // send the notes to the channel before the story is rendered
      channel.emit('thara/qrcodes/add_qrcodes', href);
      return getStory(context);
    }
  }
}

export const QrcodeDecorator = (_story, _context) => {
  let { kind, story } = _context;
  const href = `${window.location.origin}/iframe.html?selectedKind=${kind}&selectedStory=${story}`;
  const hrefEncoded = encodeURI(href);
  return generateQrcodes(hrefEncoded)(_story)(_context);
}
