# Emoji Data File Parsing Utility

![](https://github.com/brandonau24/emoji-data-file-parser/workflows/emoji-data-file-parser%20CI/badge.svg)


## How to use
To be filled out

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