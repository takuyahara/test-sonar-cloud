import soundFile from './click.mp3';

class SoundPlayer {
  private static instance: SoundPlayer = new SoundPlayer();
  private ctx!: AudioContext;
  private audioBuffer!: AudioBuffer;
  private audioSource!: AudioBufferSourceNode;
  private isStartCalled!: boolean;
  
  private constructor() {
    this.isStartCalled = false;
    this.load(soundFile);
  }
  /* istanbul ignore next */
  private load(soundFileUrl: string): void {
    fetch(soundFileUrl)
      .then(response => response.arrayBuffer())
      .catch((e: Error) => { console.log(e); })
      .then(((response: void | ArrayBuffer) => {
        // tslint:disable-next-line:no-any
        this.ctx = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
        this.ctx.decodeAudioData(response as ArrayBuffer, (audioBuffer: AudioBuffer) => {
          this.audioBuffer = audioBuffer;
          this.createBufferSource();
        });
      }).bind(this))
      .catch((e: Error) => { console.log(e); });
  }
  /* istanbul ignore next */
  private createBufferSource(): void {
    const ctx = this.ctx;
    const audioSource = ctx.createBufferSource();
    audioSource.buffer = this.audioBuffer;
    audioSource.connect(ctx.destination);
    this.audioSource = audioSource;
  }
  /* istanbul ignore next */
  private getAudioSource(): AudioBufferSourceNode {
    // Excluded to be mocked in test
    return this.audioSource;
  }
  /* istanbul ignore next */
  public start(): void {
    this.createBufferSource();
    this.getAudioSource().start();
    this.isStartCalled = true;
  }
  /* istanbul ignore next */
  public stop(): void {
    const audioSource = this.getAudioSource();
    if (audioSource) {
      if (this.isStartCalled) {
        audioSource.stop();
        this.isStartCalled = false;
      }
      audioSource.disconnect();
    }
  }
  public static getSoundPlayer(): SoundPlayer {
    return this.instance;
  }
}
export default SoundPlayer;