// Exposes the trailer's MP4 <source> elements as `videoRenditions` on the
// <video>, so the Video.js skin's built-in Quality menu can switch between them.
// Must be imported before the Video.js elements are defined.

type Rendition = {
  id: string;
  src: string;
  media: string | null;
  width: number;
  height: number;
  bitrate?: number;
  selected: boolean;
  active: boolean;
};

class RenditionList extends EventTarget {
  #renditions: Rendition[];
  #selectedIndex = -1;
  #video: HTMLVideoElement;

  [index: number]: Rendition;

  constructor(video: HTMLVideoElement, renditions: Rendition[]) {
    super();
    this.#video = video;
    this.#renditions = renditions;
    renditions.forEach((rendition, i) => (this[i] = rendition));

    video.addEventListener("loadstart", () => this.#syncActive());
    video.addEventListener("loadedmetadata", () => this.#syncActive());
    this.#syncActive();
  }

  get length() {
    return this.#renditions.length;
  }

  [Symbol.iterator]() {
    return this.#renditions[Symbol.iterator]();
  }

  get selectedIndex() {
    return this.#selectedIndex;
  }

  set selectedIndex(index: number) {
    if (index === this.#selectedIndex) return;

    this.#selectedIndex = index;
    this.#renditions.forEach((rendition, i) => (rendition.selected = i === index));
    this.dispatchEvent(new Event("change"));

    const target = index === -1 ? this.#autoRendition() : this.#renditions[index];
    if (target) this.#switchTo(target);
  }

  // Same choice the browser makes from <source media="...">
  #autoRendition() {
    return (
      this.#renditions.find((r) => !r.media || matchMedia(r.media).matches) ??
      this.#renditions.at(-1)
    );
  }

  #switchTo(rendition: Rendition) {
    const video = this.#video;
    if (video.currentSrc.endsWith(rendition.src)) return;

    const time = video.currentTime;
    const wasPlaying = !video.paused && !video.ended;

    video.addEventListener(
      "loadedmetadata",
      () => {
        video.currentTime = time;
        if (wasPlaying) video.play().catch(() => {});
      },
      { once: true },
    );
    video.src = rendition.src;
  }

  #syncActive() {
    // currentSrc isn't updated until resource selection runs
    queueMicrotask(() => {
      const src = this.#video.currentSrc;
      this.#renditions.forEach((rendition) => {
        rendition.active = !!src && src.endsWith(rendition.src);
      });      this.dispatchEvent(new Event("activechange"));
    });
  }
}

const video = document.querySelector<HTMLVideoElement>("#trailer");

if (video) {
  const renditions: Rendition[] = [
    ...video.querySelectorAll<HTMLSourceElement>("source"),
  ].map((source) => {
    const height = Number(source.dataset.height);
    return {
      id: `${height}p`,
      src: source.getAttribute("src")!,
      media: source.getAttribute("media"),
      width: Math.round((height * 16) / 9),
      height,
      bitrate: Number(source.dataset.bitrate) || undefined,
      selected: false,
      active: false,
    };
  });

  Object.defineProperty(video, "videoRenditions", {
    value: new RenditionList(video, renditions),
  });
}
