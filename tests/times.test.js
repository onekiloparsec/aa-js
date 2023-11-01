import * as times from '@/times'

describe('times', () => {
  // See AA p.78, Ex 10.a
  it('get delta t between UT and TD', () => {
    const jd = 2443_192.651_18
    expect(times.getDeltaT(jd)).toBeCloseTo(48, 0)
  })
})
