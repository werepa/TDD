import * as fs from "fs"

describe("should extract data of ePol PDFs", () => {
  test("should import text from txt file", () => {
    const text = importText("pdf1.txt")

    expect(text).toBeDefined()
    expect(text).toContain("Quant.")
    expect(text).toContain("Descrição/Observação")
  })

  test("should extract data of all tables with regex", () => {
    const text = importText("./pdf1.txt")
    const matches = extractRawData(text)

    expect(matches).toBeDefined()
    expect(matches.length).toBe(4)
  })

  test("should extract rows from data", () => {
    const text = importText("pdf1.txt")
    const matches = extractRawData(text)
    expect(matches.length).toBe(4)

    expect(extractRows(matches[0])).toHaveLength(4)
    expect(extractRows(matches[1])).toHaveLength(1)
    expect(extractRows(matches[2])).toHaveLength(1)
    expect(extractRows(matches[3])).toHaveLength(8)
  })

  test("should extract fields from rows", () => {
    const text = importText("pdf1.txt")
    const matches = extractRawData(text)
    let rows = extractRows(matches[0])

    let fields = extractFields(rows[0])
    expect(fields.codigo).toBe("2024.28046")
    expect(fields.tipo).toBe("Vestígios, produtos e objetos biológicos de fauna (outros)")
    expect(fields.qtde).toBe("1")
    expect(fields.unidade).toBe("KG")
    expect(fields.descricao).toBe("01 Alçapão de tamanho médio, utilizado para captura de pássaros")

    fields = extractFields(rows[1])
    expect(fields.codigo).toBe("2024.28069")
    expect(fields.tipo).toBe("Celular Smartphone")
    expect(fields.qtde).toBe("1")
    expect(fields.unidade).toBe("UN")
    expect(fields.descricao).toBe(
      "Celular Smartphone SAMSUNG J4 - IMEI(MEID and S/N - IMEI1: 35820309566452/01 - IMEI 2: 358204095664450/01 - SN RX8K60M6N8D"
    )

    fields = extractFields(rows[2])
    expect(fields.codigo).toBe("2024.28071")
    expect(fields.tipo).toBe("Vestígios, produtos e objetos biológicos de fauna (outros)")
    expect(fields.qtde).toBe("0.02")
    expect(fields.unidade).toBe("KG")
    expect(fields.descricao).toBe("Pequena quantidade de VISGO, material utilizado para captura de pássaros")

    fields = extractFields(rows[3])
    expect(fields.codigo).toBe("2024.28051")
    expect(fields.tipo).toBe("Vestígios, produtos e objetos biológicos de fauna (outros)")
    expect(fields.qtde).toBe("4")
    expect(fields.unidade).toBe("KG")
    expect(fields.descricao).toBe(
      "04 (quatro) anilhas de nºs. IBAMA OA 3.5 245023, IBAMA OA 2.8 288652, IBAMA OA 3.5 519469 e IBAMA 0304 2.6 045290"
    )

    rows = extractRows(matches[2])
    fields = extractFields(rows[0])
    expect(fields.codigo).toBe("2024.28870")
    expect(fields.tipo).toBe("Real (BRL) falso")
    expect(fields.qtde).toBe("10")
    expect(fields.unidade).toBe("UN")
    expect(fields.descricao).toBe(
      "10(dez) cédula(s) falsa(s) de R$ 100,00 reais, (cem reais), com número de série: HT089437742, envolvidas por um envelope amarelo, objeto postal BR964788378BR, com remetente Aleksandro Silva - CPF: 913.850.642-71, endereço à Rua Antônia Saltão de Almeida nº 391, Apto 602, Santa Monica, Uberlândia/GO, e destinatário João Vitor Jesus da Cruz, com endereço residencial à Rua Rio Turvo, 1301, Centro, 75603- 000, Porteirão/GO."
    )

    rows = extractRows(matches[3])
    fields = extractFields(rows[0])
    expect(fields.item).toBe("01")
    expect(fields.codigo).toBe("2024.8709")
    expect(fields.tipo).toBe("IPHONE")
    expect(fields.qtde).toBe("1")
    expect(fields.unidade).toBe("UN")
    expect(fields.descricao).toBe(
      "Iphone 11 cor preta, IMEI 1 35094454473460-6, IMEI 2 35094454459154-3, senha 708090, lacrado em envelope padrão DPF sob nºD00337978 em poder de RENAN"
    )

    fields = extractFields(rows[3])
    expect(fields.item).toBe("04")
    expect(fields.codigo).toBe("")
    expect(fields.tipo).toBe("Avião")
    expect(fields.qtde).toBe("1")
    expect(fields.unidade).toBe("UN")
    expect(fields.descricao).toBe(
      "Avião Cessna cores predominantes azul e branca com prefixo colocado como PT JDC, sendo que o avião encontra-se no local da abordagem, campo de milho colhido próximo ao Aeroporto de Rio Verde/GO, sem chave nem documentação"
    )

    fields = extractFields(rows[7])
    expect(fields.item).toBe("08")
    expect(fields.codigo).toBe("")
    expect(fields.tipo).toBe("celular")
    expect(fields.qtde).toBe("1")
    expect(fields.unidade).toBe("un")
    expect(fields.descricao).toBe(
      "celular marca Poco em poder de CRISTIANO LOUrenço, IMEI 1 869614057350942-00 IMEI 2 89869614057350959-00 COR AZUL Lacrado em envelope padrão DPF sob nºD00337978 ESCURO"
    )
  })
})

function importText(file: string) {
  // procurar no diretorio atual
  if (!fs.existsSync(file)) {
    // procurar no diretorio src
    file = `src/regex/${file}`
  }
  const text = fs.readFileSync(file, "utf-8")
  return text
}

function extractRawData(text: string) {
  let pattern =
    /discriminadas:.*?Quant\.\sUnidade\sDescrição\/Observação\s+(.*?)(?=Envolvidos:|Documento eletrônico assinado)/gis
  let matches = [...text.matchAll(pattern)]

  return matches.map((match) => match.map((item) => clean(item, false))[1])
}

function clean(text: string, remove_new_line = true) {
  const pattern = /Fl\.\s+\d+\s+\d+\.\d+\s(\r\n|\n|.)*?pg\.\s\d+/gi
  // const pattern = /Fl\.\s\d+\s\d+\.\d+\s(\r\n|\n|.)*?pg\.\s\d+/gi
  const data = [...text.matchAll(pattern)]
  if (data[0]) {
    text = text.replace(data[0][0], "")
  }
  if (remove_new_line) {
    text = text.replace(/\r\n/gi, " ")
  }
  return text.trim()
}

function extractRows(rowsData: string = "") {
  const lines = []
  let contador = 0
  rowsData = rowsData + "§§§"
  while (rowsData !== "" && contador < 1000) {
    let pattern =
      /^(\d{4}\.\d{5}(?=\r\n|\n|\s)(\r\n|\n|.)*?[\d\.]+\s+(?=KG|UN)(.|\r\n|\n)*?)(?=\d{4}\.\d{5}(?=\r\n|\n|\s)|§§§)/gi
    let data = [...rowsData.matchAll(pattern)]
    if (data && data[0]) {
      lines.push(data[0][1])
      rowsData = rowsData.replace(data[0][1], "").trim()
    } else {
      pattern =
        /^(\s*\d{2}\s(\r\n|\n|.)*?[\d.]+\s+(?=KG|UN)(\r\n|\n|.)*?)(?=(?=\r\n|\n)\s*\d{2}(?=\r\n|\n)*\s*(\d{4}\.\d{4,5}\s+)?\D+[\d\.]+\s+(KG|UN)|§§§)/gi
      data = [...rowsData.matchAll(pattern)]
      if (data && data[0]) {
        lines.push(data[0][1])
        rowsData = rowsData.replace(data[0][1], "").trim()
      } else {
        rowsData = ""
      }
    }
    contador++
  }
  return lines
}

function extractFields(row: any) {
  let pattern = /^(\d{4}\.\d{4,5})[\r\n]*\s+((?:\r\n|\n|.)*?)([\d\.]+)\s+(KG|UN)[\r\n]*\s+((?:\r\n|\n|.)*)/gi
  let data = [...row.matchAll(pattern)]
  if (data && data[0]) {
    return {
      codigo: clean(data[0][1]),
      tipo: clean(data[0][2]),
      qtde: clean(data[0][3]),
      unidade: clean(data[0][4]),
      descricao: clean(data[0][5]),
    }
  } else {
    pattern =
      /^(\d{2})(?:\r\n|\n)?\s*((?:\d{4}\.\d{4,5})?)(?:\r\n|\n)?\s*(.*?)\s([\d.]+)\s(KG|UN)(?:\r\n|\n)?\s*((?:\r\n|\n)?\s*(?:\r\n|\n|.)*)/gi
    data = [...row.matchAll(pattern)]
    if (data && data[0]) {
      return {
        item: clean(data[0][1]),
        codigo: clean(data[0][2]),
        tipo: clean(data[0][3]),
        qtde: clean(data[0][4]),
        unidade: clean(data[0][5]),
        descricao: clean(data[0][6]),
      }
    }
  }
}
