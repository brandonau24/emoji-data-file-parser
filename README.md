# Emoji Data File Parsing Utility

![](https://github.com/brandonau24/emoji-data-file-parser/workflows/emoji-data-file-parser%20build/badge.svg)
![](https://github.com/brandonau24/emoji-data-file-parser/workflows/emoji-data-file-parser%20tests/badge.svg)


## How to use
1. Clone the repository with `git clone git@github.com:brandonau24/emoji-data-file-parser.git`
2. Do a `npm run build:prod` or `yarn build:prod`
3. Run emoji-data-file-parser.js with `--help` to get a description of options.

## Description
This utility retrieves https://unicode.org/Public/emoji/12.0/emoji-test.txt and parses the file into JSON.

### Example output:
```
{
	"Smileys & Emotion": [
    {
      "codepoints": "1F600",
      "name": "grinning face face-smiling"
    },
    {
      "codepoints": "1F603",
      "name": "grinning face with big eyes face-smiling"
    },
    {
      "codepoints": "1F604",
      "name": "grinning face with smiling eyes face-smiling"
    },
    {
      "codepoints": "1F601",
      "name": "beaming face with smiling eyes face-smiling"
    },
	...
}
```