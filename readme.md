convert_arabic_num.js
======================

アラビア数字から漢数字へと変換するライブラリ。

## 使用方法

```javascript
import { ConvertArabicNum } from "convert_arabic_num";

const convertArabicNum = new ConvertArabicNum();
const text = "123456.7890";

console.log(convertArabicNum.convert(text))
// expected output: "一二三四五六・七八九〇"

const retroVerboseCAN = new ConvertArabicNum({
  mode: "verbose",
  charMode: "retro",
});
console.log(retroVerboseCAN.convert(text))
// expected output: "拾弐萬参仟肆佰伍拾陸・漆捌玖零"

```

## 変換モード

変換モードは主にコンストラクタ生成時の引数で変更。

コンストラクタ生成後に変えたい場合は内部オブジェクトを書き換える。

**charMode**

変換する漢数字を一般的な常用漢字と古めかしい大字から選択する。

|値|意味合い|
|---|---|
|`"modern"`|常用漢字での変換を行う|
|`"retro"`|大字での変換を行う|

**mode**

単位の付け方などが異なる変換モードを指定する。
|値|意味合い|
|---|---|
|`"simple"`|数字をそのまま漢数字に変更する|
|`"verbose"`|十、百、千...と単位を詳細に追加する。また0と1の場合は一般的な書き方に応じて省略する|
|`"moderate"`|基本的には`"simple"`と同じだが、万以上の単位を書き加える。`"verbose"`のように0と1を省略したりはしない|
