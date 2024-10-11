export const ehPrimo = function (nr: any) {
  if (nr <= 0 || isNaN(nr)) return null
  for (let i = 2; i <= Math.sqrt(nr); i++) {
    if (nr % i === 0) return false
  }
  return true
}

export const sanitizaArray = function (lista: any) {
  const listaSanitizada = []
  lista.forEach((item) => {
    if (!isNaN(item) && item !== null && typeof item !== "string" && listaSanitizada.indexOf(item) < 0)
      listaSanitizada.push(item)
  })
  return listaSanitizada
}

const ordenaNumericos = function (a, b) {
  return a - b
}

export const ordenaArray = function (lista: any) {
  const listaOrdenada = sanitizaArray(lista).sort(ordenaNumericos)
  return listaOrdenada
}

export const separaArray = function (listaSuja) {
  const lista = ordenaArray(listaSuja)
  const resultado = [[]]
  for (let i = 0; i < lista.length; i++) {
    resultado[resultado.length - 1].push(lista[i])
    if ((i < lista.length - 1, lista[i] + 1 !== lista[i + 1])) resultado.push([])
  }
  return resultado.filter((i) => i.length > 1)
}

export const msc = function (lista: any) {
  let maiorSoma = 0
  const listaConsecutivos = separaArray(lista)
  listaConsecutivos.forEach((consecutivos) => {
    let soma = 0
    consecutivos.forEach((item) => {
      soma += item
    })
    if (soma > maiorSoma) maiorSoma = soma
  })
  return maiorSoma
}

export const mscp = function (lista: any) {
  let maiorSoma = 0
  const listaConsecutivos = separaArray(lista)
  listaConsecutivos.forEach((consecutivos) => {
    let soma = 0
    let qtdePrimos = 0
    consecutivos.forEach((item) => {
      if (ehPrimo(item)) qtdePrimos++
      soma += item
    })
    if (soma > maiorSoma && qtdePrimos > 0) maiorSoma = soma
  })
  return maiorSoma
}
