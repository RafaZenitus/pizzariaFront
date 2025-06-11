type PixParams = {
  chave: string;
  tipoChave?: string; // opcional, pois só usamos a chave mesmo
  nome: string;
  cidade: string;
  valor: number;
  mensagem: string;
};

function formatValue(id: string, value: string): string {
  const size = String(value.length).padStart(2, "0");
  return id + size + value;
}

function crc16(payload: string): string {
  payload += "6304"; // ID + tamanho

  const polinomio = 0x1021;
  let resultado = 0xffff;

  for (let i = 0; i < payload.length; i++) {
    resultado ^= payload.charCodeAt(i) << 8;

    for (let j = 0; j < 8; j++) {
      if ((resultado <<= 1) & 0x10000) {
        resultado ^= polinomio;
      }
      resultado &= 0xffff;
    }
  }

  return "63" + "04" + resultado.toString(16).toUpperCase().padStart(4, "0");
}

export function gerarPixPayload({
  chave,
  nome,
  cidade,
  valor,
  mensagem,
}: PixParams): string {
  const gui = formatValue("00", "br.gov.bcb.pix");
  const key = formatValue("01", chave);
  const description = mensagem ? formatValue("02", mensagem) : "";

  const merchantAccountInfo = formatValue("26", gui + key + description);
  const txid = formatValue("05", "***");
  const additionalData = formatValue("62", txid);

  const payloadSemCRC =
    formatValue("00", "01") +
    merchantAccountInfo +
    formatValue("52", "0000") +
    formatValue("53", "986") +
    formatValue("54", valor.toFixed(2)) +
    formatValue("58", "BR") +
    formatValue("59", nome.substring(0, 25)) +
    formatValue("60", cidade.substring(0, 15)) +
    additionalData;

  return payloadSemCRC + crc16(payloadSemCRC);
}
