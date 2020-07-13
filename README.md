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
  "version": "12.0",
  "Smileys & Emotion": {
    "face-smiling": [
      {
        "codepoints": "1F600",
        "name": "grinning face"
      },
      {
        "codepoints": "1F603",
        "name": "grinning face with big eyes"
      },
      // rest of emojis in face-smiling subgroup
    ],
    "face-affection": [
      {
        "codepoints": "1F970",
        "name": "smiling face with hearts"
      },
      {
        "codepoints": "1F60D",
        "name": "smiling face with heart-eyes"
      },
      {
        "codepoints": "1F929",
        "name": "star-struck"
      },
      // rest of emojis in face-affection subgroup
    ],
	  // rest of emojis in Smileys & Emotion group
  },
  "People & Body": {
    "hand-fingers-open": [
      {
        "codepoints": "1F44B",
        "name": "waving hand"
      },
      {
        "codepoints": "1F44B 1F3FB",
        "name": "waving hand: light skin tone"
      },
      {
        "codepoints": "1F44B 1F3FC",
        "name": "waving hand: medium-light skin tone"
      },
      {
        "codepoints": "1F44B 1F3FD",
        "name": "waving hand: medium skin tone"
      },
      // rest of emojis in hand-fingers-open subgroup
    ],
    // rest of emojis in People & Body group
  },
  // rest of emoji groups and their subgroups
}
```