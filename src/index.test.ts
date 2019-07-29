import { ConvertArabicNum } from "#/index";

describe("convert arabic num", () => {
  const convertArabicNum = new ConvertArabicNum();
  const text = "123456.7890";
  it("simple mode test", () => {
    const result = convertArabicNum.convert_simple(text);
    expect(result).toBe("一二三四五六・七八九〇");
  })

  it("simple mode and retro mode test", () => {
    const retroCAN = new ConvertArabicNum({
      charMode: "retro"
    });
    const result = retroCAN.convert_simple(text);
    expect(result).toBe("壱弐参肆伍陸・漆捌玖零");
  })

  it("moderate mode test", () => {
    const longNum = "7777777777777.777";
    const result = convertArabicNum.convert_moderate(longNum)
    expect(result).toBe("七兆七七七七億七七七七万七七七七・七七七");
  })

  it("verbose mode int test", () => {
    const longNum = "7777777777777";
    const result = convertArabicNum.convert_verbose(longNum)
    expect(result).toBe("七兆七千七百七十七億七千七百七十七万七千七百七十七");
  })
})
