import { Buffer } from 'buffer';

/**
 * @typedef {Object} FormatDefinition
 * @property {string} tag - Nombre del campo.
 * @property {'uint' | 'int' | 'float' | 'ascii'} type - Tipo de dato del campo.
 * @property {number} [len] - Longitud en bits del campo (si aplica al tipo).
 */

type FormatDefinition = {
  tag: string;
  type: 'uint' | 'int' | 'float' | 'ascii';
  len?: number;
}

class DataSerializer {
  format: FormatDefinition[];
  bigEndian: boolean;

  constructor(format: FormatDefinition[], { bigEndian = true }: { bigEndian?: boolean } = {}) {
    this.format = format;
    this.bigEndian = bigEndian;
  }

  encode(data: Record<string, any>): Buffer {
    const buffers: Buffer[] = [];

    for (const field of this.format) {
      const value = data[field.tag];
      let buffer: Buffer;

      switch (field.type) {
        case 'uint':
          buffer = Buffer.alloc((field.len ?? 0) / 8);
          buffer.writeUIntBE(value, 0, (field.len ?? 0) / 8);
          break;

        case 'int':
          buffer = Buffer.alloc((field.len ?? 0) / 8);
          buffer.writeIntBE(value, 0, (field.len ?? 0) / 8);
          break;

        case 'float':
          buffer = Buffer.alloc(4);
          buffer.writeFloatBE(value, 0);
          break;

        case 'ascii':
          buffer = Buffer.from(value, 'ascii');
          break;

        default:
          throw new Error(`Unsupported type: ${field.type}`);
      }

      buffers.push(buffer);
    }

    return Buffer.concat(buffers);
  }

  decode(buffer: Buffer): Record<string, any> {
    const data: Record<string, any> = {};
    let offset = 0;

    for (const field of this.format) {
      switch (field.type) {
        case 'uint':
          data[field.tag] = buffer.readUIntBE(offset, (field.len ?? 0) / 8);
          offset += (field.len ?? 0) / 8;
          break;

        case 'int':
          data[field.tag] = buffer.readIntBE(offset, (field.len ?? 0) / 8);
          offset += (field.len ?? 0) / 8;
          break;

        case 'float':
          data[field.tag] = buffer.readFloatBE(offset);
          offset += 4;
          break;

        case 'ascii':
          const end = buffer.indexOf(0, offset) === -1 ? buffer.length : buffer.indexOf(0, offset);
          data[field.tag] = buffer.toString('ascii', offset, end);
          offset = end + 1;
          break;

        default:
          throw new Error(`Unsupported type: ${field.type}`);
      }
    }

    return data;
  }
}

export default DataSerializer;
