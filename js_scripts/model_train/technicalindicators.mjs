export function calculateSMA(data, period = 14, key = 'close') {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }
    const slice = data.slice(i - period + 1, i + 1);
    const sum = slice.reduce((acc, cur) => acc + cur[key], 0);
    result.push(sum / period);
  }
  return result;
}

export function calculateEMA(data, period = 14, key = 'close') {
  const k = 2 / (period + 1);
  const ema = [];

  let prevEMA = data.slice(0, period).reduce((acc, val) => acc + val[key], 0) / period;
  ema.push(...Array(period - 1).fill(null), prevEMA);

  for (let i = period; i < data.length; i++) {
    const value = data[i][key];
    prevEMA = value * k + prevEMA * (1 - k);
    ema.push(prevEMA);
  }

  return ema;
}

export function calculateRSI(data, period = 14, key = 'close') {
  const gains = [];
  const losses = [];
  const rsi = [];

  for (let i = 1; i < data.length; i++) {
    const change = data[i][key] - data[i - 1][key];
    gains.push(Math.max(0, change));
    losses.push(Math.max(0, -change));
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  rsi.push(...Array(period).fill(null));

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi.push(100 - 100 / (1 + rs));
  }

  return rsi;
}

export function calculateMACD(data, shortPeriod = 12, longPeriod = 26, signalPeriod = 9, key = 'close') {
  const emaShort = calculateEMA(data, shortPeriod, key);
  const emaLong = calculateEMA(data, longPeriod, key);

  const macdLine = emaShort.map((val, i) =>
    val !== null && emaLong[i] !== null ? val - emaLong[i] : null
  );

  const signalLine = calculateEMA(macdLine.map((val, i) => ({ [key]: val ?? 0 })), signalPeriod, key);
  const histogram = macdLine.map((val, i) =>
    val !== null && signalLine[i] !== null ? val - signalLine[i] : null
  );

  return { macdLine, signalLine, histogram };
}

export function calculateBollingerBands(data, period = 20, stdDevMult = 2, key = 'close') {
  const bands = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      bands.push({ upper: null, middle: null, lower: null });
      continue;
    }

    const slice = data.slice(i - period + 1, i + 1);
    const values = slice.map(d => d[key]);
    const mean = values.reduce((a, b) => a + b, 0) / period;
    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / period;
    const stdDev = Math.sqrt(variance);

    bands.push({
      upper: mean + stdDevMult * stdDev,
      middle: mean,
      lower: mean - stdDevMult * stdDev
    });
  }

  return bands;
}

export function calculateATR(data, period = 14) {
  const trList = [];

  for (let i = 1; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;
    const prevClose = data[i - 1].close;

    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    trList.push(tr);
  }

  const atr = [];
  for (let i = 0; i < trList.length; i++) {
    if (i < period - 1) {
      atr.push(null);
    } else if (i === period - 1) {
      const sum = trList.slice(0, period).reduce((a, b) => a + b, 0);
      atr.push(sum / period);
    } else {
      const prevATR = atr[atr.length - 1];
      atr.push((prevATR * (period - 1) + trList[i]) / period);
    }
  }

  return [null, ...atr]; // Pad beginning to match input length
}

export function calculateADX(data, period = 14) {
  const plusDM = [];
  const minusDM = [];
  const trList = [];

  for (let i = 1; i < data.length; i++) {
    const upMove = data[i].high - data[i - 1].high;
    const downMove = data[i - 1].low - data[i].low;

    plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);

    const tr = Math.max(
      data[i].high - data[i].low,
      Math.abs(data[i].high - data[i - 1].close),
      Math.abs(data[i].low - data[i - 1].close)
    );
    trList.push(tr);
  }

  const smoothedTR = smooth(trList, period);
  const smoothedPlusDM = smooth(plusDM, period);
  const smoothedMinusDM = smooth(minusDM, period);

  const plusDI = smoothedPlusDM.map((val, i) => (val / smoothedTR[i]) * 100);
  const minusDI = smoothedMinusDM.map((val, i) => (val / smoothedTR[i]) * 100);

  const dx = plusDI.map((val, i) =>
    val !== undefined && minusDI[i] !== undefined
      ? (100 * Math.abs(val - minusDI[i])) / (val + minusDI[i])
      : null
  );

  const adx = smooth(dx, period);
  return [null, ...Array(period * 2 - 2).fill(null), ...adx.slice(period - 1)];
}

function smooth(values, period) {
  const smoothed = [];
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      smoothed.push(null);
    } else if (i === period - 1) {
      const sum = values.slice(0, period).reduce((a, b) => a + b, 0);
      smoothed.push(sum);
    } else {
      const prev = smoothed[i - 1];
      smoothed.push(prev - prev / period + values[i]);
    }
  }
  return smoothed;
}

export function calculateStochastic(data, kPeriod = 14, dPeriod = 3) {
  const percentK = [];

  for (let i = 0; i < data.length; i++) {
    if (i < kPeriod - 1) {
      percentK.push(null);
      continue;
    }

    const slice = data.slice(i - kPeriod + 1, i + 1);
    const highs = slice.map(d => d.high);
    const lows = slice.map(d => d.low);
    const high = Math.max(...highs);
    const low = Math.min(...lows);
    const close = data[i].close;

    percentK.push(((close - low) / (high - low)) * 100);
  }

  const percentD = percentK.map((_, i) => {
    if (i < kPeriod - 1 + dPeriod - 1) return null;
    const slice = percentK.slice(i - dPeriod + 1, i + 1);
    return slice.reduce((a, b) => a + b, 0) / dPeriod;
  });

  return { percentK, percentD };
}

export function calculateIchimoku(data, conversionPeriod = 9, basePeriod = 26, spanBPeriod = 52, displacement = 26) {
  const conversionLine = [];
  const baseLine = [];
  const leadingSpanA = [];
  const leadingSpanB = [];

  for (let i = 0; i < data.length; i++) {
    const getHighLow = (period) => {
      if (i < period - 1) return [null, null];
      const slice = data.slice(i - period + 1, i + 1);
      const high = Math.max(...slice.map(d => d.high));
      const low = Math.min(...slice.map(d => d.low));
      return [(high + low) / 2];
    };

    const [conv] = getHighLow(conversionPeriod);
    const [base] = getHighLow(basePeriod);
    const [spanB] = getHighLow(spanBPeriod);

    conversionLine.push(conv ?? null);
    baseLine.push(base ?? null);
    leadingSpanA.push(conv !== null && base !== null ? (conv + base) / 2 : null);
    leadingSpanB.push(spanB ?? null);
  }

  const displacedSpanA = Array(displacement).fill(null).concat(leadingSpanA);
  const displacedSpanB = Array(displacement).fill(null).concat(leadingSpanB);

  return {
    conversionLine,
    baseLine,
    leadingSpanA: displacedSpanA,
    leadingSpanB: displacedSpanB
  };
}

export function extractFeatures(data) {
  const features = [...data];

  const sma20 = calculateSMA(data, 20);
  const ema20 = calculateEMA(data, 20);
  const rsi14 = calculateRSI(data, 14);
  const macdData = calculateMACD(data);
  const boll = calculateBollingerBands(data);

  features.forEach((d, i) => {
    d.sma20 = sma20[i];
    d.ema20 = ema20[i];
    d.rsi14 = rsi14[i];
    d.macd = macdData.macdLine[i];
    d.macdSignal = macdData.signalLine[i];
    d.macdHist = macdData.histogram[i];
    d.bbUpper = boll[i].upper;
    d.bbMiddle = boll[i].middle;
    d.bbLower = boll[i].lower;
  });

  return features;
}

export function normalizeData(data, featureKeys) {
  const stats = {};
  for (const key of featureKeys) {
    const values = data.map(d => d[key]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    stats[key] = { min, max };
  }

  const normalized = data.map(row => {
    const normRow = {};
    for (const key of featureKeys) {
      const { min, max } = stats[key];
      normRow[key] = (row[key] - min) / (max - min || 1);
    }
    normRow.close = row.close; // keep original close for label
    return normRow;
  });

  return { normalized, stats };
}

export function removeRowsWithNaN(data) {
  return data.filter(row => {
    return Object.values(row).every(value => {
      return !Number.isNaN(value) && value != undefined && value != null
    });
  });
}





