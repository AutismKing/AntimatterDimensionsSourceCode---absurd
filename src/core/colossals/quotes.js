import { BitUpgradeState } from "../game-mechanics";
import wordShift from "../word-shift";

export const Quote = {
  addToQueue(quote) {
    ui.view.quotes.queue.push(quote);
    if (!ui.view.quotes.current) this.advanceQueue();
  },
  advanceQueue() {
    ui.view.quotes.current = ui.view.quotes.queue.shift();
  },
  showHistory(history) {
    ui.view.quotes.history = history;
  },
  clearQueue() {
    ui.view.quotes.queue = [];
    ui.view.quotes.current = undefined;
  },
  clearHistory() {
    ui.view.quotes.history = undefined;
  },
  clearAll() {
    this.clearQueue();
    this.clearHistory();
  },
  get isOpen() {
    return ui.view.quotes.current !== undefined;
  },
  get isHistoryOpen() {
    return ui.view.quotes.history !== undefined;
  }
};

// Gives an array specifying proportions of colossals to blend together on the modal, as a function of time, to
// provide a smoother transition between different colossals to reduce potential photosensitivity issues
function blendCel(cels) {
  const totalTime = cels.map(cel => cel[1]).sum();
  const tick = (Date.now() / 1000) % totalTime;

  // Blend the first blendTime seconds with the previous colossal and the last blendTime seconds with the next;
  // note that this results in a total transition time of 2*blendTime. We specifically set this to be half the duration
  // of the first entry - this is because in the case of all intervals having the same duration, this guarantees two
  // blended entries at all points in time.
  const blendTime = cels[0][1] / 2;
  let start = 0;
  for (let index = 0; index < cels.length; index++) {
    const prevCel = cels[(index + cels.length - 1) % cels.length], currCel = cels[index],
      nextCel = cels[(index + 1) % cels.length];

    // Durations of time from after last transition and after next transition. May be negative, which is how we
    // check to see if we're in the correct time interval (last should be positive, next should be negative)
    const lastTime = tick - start, nextTime = lastTime - currCel[1];
    if (nextTime > 0) {
      start += currCel[1];
      continue;
    }

    if (lastTime <= blendTime) {
      const t = 0.5 * lastTime / blendTime;
      return [[prevCel[0], 0.5 - t], [currCel[0], 0.5 + t]];
    }
    if (-nextTime <= blendTime) {
      const t = 0.5 * nextTime / blendTime;
      return [[currCel[0], 0.5 - t], [nextCel[0], 0.5 + t]];
    }

    // In principle the animation properties should never get to this return case, but we leave it here just in case -
    // the worst side-effect of reaching here is that some UI elements may appear to lose click detection for a
    // fraction of a second when transitioning from two blended entries to one
    return [[currCel[0], 1]];
  }
  throw new Error("Could not blend colossal fractions in Quote modal");
}

class QuoteLine {
  constructor(line, parent) {
    this._parent = parent;
    this._showColossalName = line.showColossalName ?? true;

    this._colossalArray = line.background
      ? () => blendCel(line.background)
      : [[parent.colossal, 1]];

    const replacementMatch = /\$(\d+)/gu;

    this._line = typeof line === "string"
      ? line
      // This matches each digit after a $ and replaces it with the wordCycle of an array with the digit it matched.
      : () => line.text.replaceAll(replacementMatch, (_, i) => wordShift.wordCycle(line[i]));
  }

  get line() {
    return typeof this._line === "function" ? this._line() : this._line;
  }

  get colossals() {
    return typeof this._colossalArray === "function" ? this._colossalArray() : this._colossalArray;
  }

  get colossalSymbols() {
    return this.colossals.map(c => Colossals[c[0]].symbol);
  }

  get showColossalName() {
    return this._showColossalName;
  }

  get colossalName() {
    return Colossals[this._parent.colossal].displayName;
  }
}

class ColQuotes extends BitUpgradeState {
  constructor(config, colossal) {
    super(config);
    this._colossal = colossal;
    this._lines = config.lines.map(line => new QuoteLine(line, this));
  }

  get bits() { return player.colossals[this._colossal].quoteBits; }
  set bits(value) { player.colossals[this._colossal].quoteBits = value; }

  get requirement() {
    // If requirement is defined, it is always a function returning a boolean.
    return this.config.requirement?.();
  }

  get colossal() {
    return this._colossal;
  }

  line(id) {
    return this._lines[id];
  }

  get totalLines() {
    return this._lines.length;
  }

  show() { this.unlock(); }
  onUnlock() { this.present(); }

  present() {
    Quote.addToQueue(this);
  }
}


export const Quotes = {
  genox: mapGameDataToObject(
    GameDatabase.colossals.quotes.genox,
    config => new ColQuotes(config, "genox")
  ),
  omega: mapGameDataToObject(
    GameDatabase.colossals.quotes.omega,
    config => new ColQuotes(config, "omega")
  ),
  apophis: mapGameDataToObject(
    GameDatabase.colossals.quotes.apophis,
    config => new ColQuotes(config, "apophis")
  ),
  hextick: mapGameDataToObject(
    GameDatabase.colossals.quotes.hextick,
    config => new ColQuotes(config, "hextick")
  ),
  triton: mapGameDataToObject(
    GameDatabase.colossals.quotes.triton,
    config => new ColQuotes(config, "triton")
  ),
  bounce: mapGameDataToObject(
    GameDatabase.colossals.quotes.bounce,
    config => new ColQuotes(config, "bounce")
  ),
};
