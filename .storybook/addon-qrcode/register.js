import React from 'react';
import addons from '@storybook/addons';
import QRCode from 'qrcode';

const styles = {
  qrcodesPanel: {
  },
  qrcodesUnloaded: {
    visibility: 'hidden'
  },
  qrcodesLoaded: {
    visibility: 'visible'
  }
};
let qrcodeImage = null;

class QrCodes extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      href: '#',
      qrcodeImage: null
    };
    this.onAddHref = this.onAddHref.bind(this);
  }

  onAddHref(href) {
    this.setState({href});
    this.generateQrcodes();
  }

  async generateQrcodes() {
    const href = this.state.href;
    this.setState({
      qrcodeImage: await QRCode.toDataURL(href)
    });
  }

  componentDidMount() {
    qrcodeImage = this.refs.qrcode;
    const { channel, api } = this.props;
    // Listen to the notes and render it.
    channel.on('thara/qrcodes/add_qrcodes', this.onAddHref);

    // Clear the current notes on every story change.
    this.stopListeningOnStory = api.onStory(() => {
      this.onAddHref('#');
    });
  }

  render() {
    if (!this.props.active) {
      return null;
    }
    const qrcodeVisibility = this.state.href === '#' ? styles.qrcodesUnloaded : styles.qrcodesLoaded;
    return (
      <div style={styles.qrcodesPanel}>
        <a href={this.state.href} target="_blank">
          <img src={this.state.qrcodeImage} style={qrcodeVisibility} ref="qrcode" />
        </a>
      </div>
    );
  }

  // This is some cleanup tasks when the Notes panel is unmounting.
  componentWillUnmount() {
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }

    this.unmounted = true;
    const { channel, api } = this.props;
    channel.removeListener('thara/qrcodes/add_qrcodes', this.onAddHref);
  }
}

// Register the addon with a unique name.
addons.register('thara/qrcodes', (api) => {
  var channel = addons.getChannel();

  addons.addPanel('thara/qrcodes/panel', {
    title: 'QR Codes',
    // eslint-disable-next-line react/prop-types
    render: function render(_ref) {
      var active = _ref.active;
      return React.createElement(QrCodes, {
        channel: channel,
        api: api,
        active: active
      });
    }
  });
});