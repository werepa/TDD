import { ehPrimo, msc, mscp, ordenaArray, sanitizaArray, separaArray } from "."

describe("Aula TDD", () => {
  test("deve verificar se um numero é primo", () => {
    expect(ehPrimo(undefined)).toBe(null)
    expect(ehPrimo(null)).toBe(null)
    expect(ehPrimo(-1)).toBe(null)
    expect(ehPrimo(0)).toBe(null)
    expect(ehPrimo("a3")).toBe(null)
    expect(ehPrimo("3")).toBe(true)
    expect(ehPrimo("4")).toBe(false)
    expect(ehPrimo("13")).toBe(true)
    expect(ehPrimo(1)).toBe(true)
    expect(ehPrimo(2)).toBe(true)
    expect(ehPrimo(3)).toBe(true)
    expect(ehPrimo(4)).toBe(false)
    expect(ehPrimo(10)).toBe(false)
    expect(ehPrimo(13)).toBe(true)
    expect(ehPrimo(10e6)).toBe(false)
  })

  test("deve sanitizar uma lista de numeros", () => {
    expect(sanitizaArray([4, 1, 7, 21, 5, 9, 7, 8, 6, 8, "asdf"])).toEqual([4, 1, 7, 21, 5, 9, 8, 6])
    expect(sanitizaArray([4, 1, 7, "3", 21, undefined, 5, 9, null, 8, 6, 20, "asdf"])).toEqual([4, 1, 7, 21, 5, 9, 8, 6, 20])
  })

  test("deve ordenar uma lista de numeros", () => {
    expect(ordenaArray([4, 1, 7, 21, 5, 9, 7, 8, 6, 8, "asdf"])).toEqual([1, 4, 5, 6, 7, 8, 9, 21])
    expect(ordenaArray([4, 1, 7, "3", 21, undefined, 5, 9, null, 8, 6, 20, "asdf"])).toEqual([1, 4, 5, 6, 7, 8, 9, 20, 21])
  })

  test("deve separar em arrays de consecutivos", () => {
    expect(separaArray([4, 1, 7, 21, 5, 9, 7, 8, 6, 8, "asdf"])).toEqual([[4, 5, 6, 7, 8, 9]])
    expect(separaArray([4, 1, 7, "3", 21, undefined, 5, 9, null, 8, 6, 20, "asdf"])).toEqual([
      [4, 5, 6, 7, 8, 9],
      [20, 21],
    ])
  })

  test("deve retornar a maior soma de n numeros consecutivos", () => {
    expect(msc([4, 1, 7, 21, 5, 9, 8, 6, 8, "asdf"])).toBe(39)
    expect(msc([4, 1, 7, 21, 5, 7, 9, 8, 6, "asdf"])).toBe(39)
    expect(msc([4, 1, 7, 21, 5, 9, 8, 6, 20, "asdf", 30])).toBe(41)
    expect(msc([4, 1, 7, 21, 5, 9, 8, 6, 20, "asdf"])).toBe(41)
  })

  test("deve retornar a maior soma de n numeros consecutivos com ao menos um nr primo", () => {
    expect(mscp([4, 1, 7, 21, 5, 9, 8, 6, 8, "asdf"])).toBe(39)
    expect(mscp([4, 1, 7, 21, 5, 7, 9, 8, 6, "asdf"])).toBe(39)
    expect(mscp([4, 1, 7, 21, 5, 9, 8, 6, 20, "asdf", 30])).toBe(39)
    expect(mscp([4, 1, 7, 21, 5, 9, 8, 6, 20, "asdf"])).toBe(39)
  })
})
