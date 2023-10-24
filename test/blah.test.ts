import DataSerializer from '../src';

describe('encode', () => {
  it('should encode a record of data into a buffer', () => {
    const serializer = new DataSerializer([
      { tag: 'id', type: 'uint', len: 32 },
      { tag: 'name', type: 'ascii', len: 16 },
      { tag: 'age', type: 'uint', len: 8 },
      { tag: 'balance', type: 'float' },
    ]);

    const data = {
      id: 1234567890,
      name: 'John Doe',
      age: 30,
      balance: 1234.56,
    };

    const expectedBuffer = Buffer.from('499602d2004a6f686e20446f65000000000000001e40', 'hex');
    const encodedBuffer = serializer.encode(data);

    expect(encodedBuffer).toEqual(expectedBuffer);
  });
});

describe('decode', () => {
  it('should decode a buffer into a record of data', () => {
    const serializer = new DataSerializer([
      { tag: 'id', type: 'uint', len: 32 },
      { tag: 'name', type: 'ascii', len: 16 },
      { tag: 'age', type: 'uint', len: 8 },
      { tag: 'balance', type: 'float' },
    ]);

    const buffer = Buffer.from('499602d2004a6f686e20446f65000000000000001e40', 'hex');
    const expectedData = {
      id: 1234567890,
      name: 'John Doe',
      age: 30,
      balance: 1234.56,
    };

    const decodedData = serializer.decode(buffer);

    expect(decodedData).toEqual(expectedData);
  });
});
