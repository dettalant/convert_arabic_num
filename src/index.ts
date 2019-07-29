export class ConvertArabicNum {
  mode: ConvertDecimalMode = "simple";
  charMode: ConvertCharMode = "modern";
  constructor(initArgs?: ConvertArabicNumInitArgs) {
    if (typeof initArgs === "undefined") {
      return;
    }

    if (typeof initArgs.mode !== "undefined") {
      this.mode = initArgs.mode;
    }

    if (typeof initArgs.charMode !== "undefined") {
      this.charMode = initArgs.charMode;
    }
  }
  /**
   * ひとまずはパースし終えた数列テキストを処理することを目標とする。
   * @param  text [description]
   * @return      [description]
   */
  convert(text: string): string {
    if (this.mode === "verbose") {

    } else if (this.mode === "moderate") {

    } else if (this.mode === "dictate") {

    } else {
      // mode simple

    }

    return text;
  }


  // convert_tmp(text: string): string {
  //   const numStrArray = text.split(/([,.])/)
  //   const loopLen = numStrArray.length;
  //   let result = "";
  //   for (let i = 0; i < loopLen; i++) {
  //     const numStr = numStrArray[i];
  //     if (numStr === ",") {
  //       // カンマであった場合は次周回へ
  //       continue;
  //     } else if (numStr === ".") {
  //       // 小数点数字であった場合は中黒を結果文字列に足す
  //       result += "・";
  //       continue;
  //     }
  //
  //
  //   }
  //   return text;
  // }

  /**
   * 主に`123456.789`のような数字のみのstringを受け取って、
   * それをsimple modeで変換する変数
   * @param  text 変換元テキスト
   * @return      変換後テキスト
   */
  convert_simple(text: string): string {
    const replaceMap = (this.charMode === "retro") ? this.retroCharMap : this.modernCharMap;

    for (let [key, value] of replaceMap) {
      const matchStr = (key === ".") ? "\." : key;

      const regex = new RegExp("[" + matchStr + "]", "g");
      text = text.replace(regex, value);
    }

    return text;
  }

  /**
   * 詳細に単位をつけて数字を常用漢字表記の文字列に変換する
   * 数字以外が残った文章が入れられた際の動作は保証しない
   * @param  text 変換元テキスト
   * @return      変換後テキスト
   */
  convert_verbose(text: string): string {
    //
    const splitStrArray = text.split(".");
    let result = "";

    // IE非対応スクリプトなのでArray.from()で切り分ける
    const intStrArray = Array.from(splitStrArray[0]);
    const intStrLen = intStrArray.length;

    const moderateUnitsArray = this.moderateUnitsArray;
    const moderateUnitsArrayLen = moderateUnitsArray.length;

    const verboseUnitsArray = this.verboseUnitsArray;
    const verboseUnitsArrayLen = verboseUnitsArray.length;

    for (let i = 0; i < intStrLen; i++) {
      // 後ろからテキストを結合していくので、
      // 最大値から下がっていく反転インデックス数値を生成
      const reverseIdx = intStrLen - i - 1;
      const verboseUnitIdx = i % verboseUnitsArrayLen;
      const verboseUnitStr = verboseUnitsArray[verboseUnitIdx];

      const moderateUnitStr = (i !== 0 && verboseUnitIdx === 0)
        // 要するに無量大数までいったら万に戻ってループするようにしている
        ? moderateUnitsArray[Math.floor((i - 4) / 4) % moderateUnitsArrayLen]
        : "";

      // 後ろから結合していく
      result = intStrArray[reverseIdx] + verboseUnitStr + moderateUnitStr + result;
    }

    if (splitStrArray.length > 1) {
      // 小数点処理を入れる
      // 中黒を挟んで、小数点以下には同じように長ったらしく単位を付ける
      // TODO: 小数点以下単位つけ処理も付ける
      result += "・" + splitStrArray[1]
    }

    return this.convert_simple(result);
  }

  /**
   * 万以降の単位は付けるが、千、百、十については単位省略
   * また、小数点以下についても単位省略。漢数字を使う記法のなかで一般的な書き方に変換する。
   * @param  text 変換元テキスト
   * @return      変換後テキスト
   */
  convert_moderate(text: string): string {

    const splitStrArray = text.split(".");
    // 変換後テキストを空欄状態で変数束縛
    let result = "";

    const intStr = splitStrArray[0]
    const intStrLen = intStr.length;

    if (intStrLen <= 4) {
      // 四桁以下なら単位をつけず、そのまま処理する
      result += this.convert_simple(intStr);
    } else {
      // 五桁以上の場合は単位をつけていく

      // 四文字づつ処理するのが良さそうなので
      // ループ回数は四で割った数字を切り上げたものを使う
      const loopLen = Math.ceil(intStrLen / 4);
      let strEndIdx = intStrLen;
      const unitsArray = this.moderateUnitsArray;
      const unitsArrayLen = unitsArray.length;

      for (let i = 0; i < loopLen; i++) {
        // 後ろから切り出して結合させていく
        const processCharLen = 4;
        // マイナス値にならないよう調整
        const strBeginIdx = (strEndIdx > processCharLen)
          ? strEndIdx - processCharLen
          : 0;

        // ループ一周目では単位を付け足さない
        const insertUnitStr = (i !== 0)
        // もし無量大数以上の数値になったら万に戻して無限ループさせる
          ? unitsArray[(i - 1) % unitsArrayLen]
          : "";

        result = text.slice(strBeginIdx, strEndIdx) + insertUnitStr + result;

        // 周回の終わりでstrEndIdxの数値を処理した文字数分だけ引いておく
        strEndIdx -= processCharLen;
      }

    }

    if (splitStrArray.length > 1) {
      // 小数点処理を入れる
      const floatStr = splitStrArray[1];

      // 中黒を挟んで、小数点以下はsimple modeで処理
      // 小数点が二つある数字は入力ミスとして扱い、文字配列2番以降はまるっと無視
      result += "・" + floatStr;
    }

    return this.convert_simple(result);
  }

  /**
   * 算用数字から常用漢字への変換マップ
   * @return 常用漢字変換マップ
   */
  get modernCharMap(): Map<string, string> {
    return new Map([
      ["1", "一"],
      ["2", "二"],
      ["3", "三"],
      ["4", "四"],
      ["5", "五"],
      ["6", "六"],
      ["7", "七"],
      ["8", "八"],
      ["9", "九"],
      // 0は〇に（難しくない方のゼロ）
      ["0", "〇"],
      // 小数点は中黒にする
      [".", "・"],
      // カンマは空白（除去するのみ）
      [",", ""],
    ])
  }

  /**
   * 古めかしい大字での変換マップ
   * @return 大字変換マップ
   */
  get retroCharMap(): Map<string, string> {
    return new Map([
      ["1", "壱"],
      ["2", "弐"],
      ["3", "参"],
      ["4", "肆"],
      ["5", "伍"],
      ["6", "陸"],
      ["7", "漆"],
      ["8", "捌"],
      ["9", "玖"],
      // 0は零に
      ["0", "零"],
      // 小数点は中黒にする
      [".", "・"],
      // カンマは空白（除去するのみ）
      [",", ""],
    ])
  }

  // verbose表示に必要な単位を配列として取得
  get verboseUnitsArray(): string[] {
    return [
      // 配列0番は単位無しとして空欄を指定
      "",
      "十",
      "百",
      "千"
    ]
  }

  /**
   * moderate表示に必要な単位をまとめた配列。
   * ちなみに日本で広く使われている万進方式を採用していますが、
   * 「無量大数」の次には「万」が再び来て、以降無限ループするようにしています。
   *
   * 不可説不可説転まで延々やるのはさすがにやってられなかった。
   *
   * @return 大数の単位配列
   */
  get moderateUnitsArray(): string[] {
    return [
      "万",
      "億",
      "兆",
      "京",
      "垓",
      "𥝱",
      "穣",
      "溝",
      "正",
      "載",
      "極",
      "恒河沙",
      "阿僧祇",
      "那由他",
      "不可思議",
      "無量大数",
    ]
  }

  splitAtDot(text: string): string[] {
    return text.split(/(\.)/);
  }
}

/**
 * 十進法の桁をどういう単位表記で記述するかのモード選択
 *
 * + verbose: 詳細な命数法として単位表示
 * + simple: 数字をそのまま漢数字にするだけで単位はつけない
 * + moderate: 万以上の単位から記述する
 * + dictate: 基本的にverboseと同じだが、ゼロについては「〜〜とんで」と表記する
 */
export type ConvertDecimalMode = "verbose" | "simple" | "moderate" | "dictate";

/**
 * 漢数字の字体選択
 *
 * + modern: 一般的に用いられる常用漢字で表記
 * + retro: 時代小説のような大字で表記
 */
export type ConvertCharMode = "modern" | "retro";

/**
 * convertArabicNumクラスの初期化時引数として取るinterface。
 * 省略可。
 */
export interface ConvertArabicNumInitArgs {
  mode?: ConvertDecimalMode;
  charMode?: ConvertCharMode;
}
