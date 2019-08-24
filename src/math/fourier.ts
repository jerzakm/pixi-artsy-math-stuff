export const discreteFourierTransform = (x: number[]) => {
  const X = []
  const N = x.length

  for (let k = 0; k < N; k++) {
    let re = 0
    let im = 0
    for (let n = 0; n < N; n++) {
      const phi = Math.PI * 2 * k * n / N
      re += x[n] * Math.cos(phi)
      im -= x[n] * Math.sin(phi)
    }
    re = re / N
    im = im / N

    const freq = k
    const amp = Math.sqrt(re * re + im * im)
    const phase = Math.atan2(im, re)

    X[k] = { re, im, freq, amp, phase }
  }

  return X
}