import { ConvertArabicNum } from "#/index";

describe("convert arabic num", () => {
  const convertArabicNum = new ConvertArabicNum();

  const retroCAN = new ConvertArabicNum({
    charMode: "retro"
  });

  const text = "123456.7890";
  it("simple mode test", () => {
    const result = convertArabicNum.convert_simple(text);
    expect(result).toBe("一二三四五六・七八九〇");
  })

  it("simple mode and retro mode test", () => {
    const result = retroCAN.convert_simple(text);
    expect(result).toBe("壱弐参肆伍陸・漆捌玖零");
  })

  it("moderate mode test", () => {
    const longNum = "7777777777777.777";
    const result = convertArabicNum.convert_moderate(longNum)
    expect(result).toBe("七兆七七七七億七七七七万七七七七・七七七");
  })

  it("verbose and retro mode test", () => {
    const longNum = "7777777777777.777";
    const result = retroCAN.convert_verbose(longNum)
    expect(result).toBe("漆兆漆仟漆佰漆拾漆億漆仟漆佰漆拾漆萬漆仟漆佰漆拾漆・漆漆漆");
  })

  it("verbose mode int test", () => {
    const longNum = "7777777777777";
    const result = convertArabicNum.convert_verbose(longNum)
    expect(result).toBe("七兆七千七百七十七億七千七百七十七万七千七百七十七");
  })

  it("verbose mode int one test", () => {
    const longNum = "1111111111111";
    const result = convertArabicNum.convert_verbose(longNum);
    expect(result).toBe("一兆千百十一億千百十一万千百十一")
  })

  it("verbose mode int zero test", () => {
    const longNum = "1000000000000";
    const result = convertArabicNum.convert_verbose(longNum);
    expect(result).toBe("一兆")
  })

  it("convert() simple mode and comma test", () => {
    const convertText = "文字列の中での数字も123,456、文末の数字も7,890.123"
    const result = convertArabicNum.convert(convertText);
    expect(result).toBe("文字列の中での数字も一二三四五六、文末の数字も七八九〇・一二三")
  })

  it("convert() retro mode and moderate mode and comma test", () => {
    const retroModerateCAN = new ConvertArabicNum({
      charMode: "retro",
      mode: "moderate",
    });
    const convertText = "文字列の中での数字も123,456、文末の数字も7,890.123"
    const result = retroModerateCAN.convert(convertText);
    expect(result).toBe("文字列の中での数字も壱弐萬参肆伍陸、文末の数字も漆捌玖零・壱弐参")
  })

  it("convert() verbose mode test", () => {
    const verboseCAN = new ConvertArabicNum({
      charMode: "modern",
      mode: "verbose",
    });
    const convertText = "文字列の中での数字も123,456、文末の数字も7,890.123"
    const result = verboseCAN.convert(convertText);
    expect(result).toBe("文字列の中での数字も十二万三千四百五十六、文末の数字も七千八百九十・一二三")
  })
})
