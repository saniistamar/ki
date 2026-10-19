# .ki/

Ki's panel state. Three files, all machinery:

| File | Holds |
| --- | --- |
| `ask.json` | The current ask the panel shows. Ki overwrites it each turn |
| `settled.json` | One line per decided ask — what, the educator's word, when |
| `answer.json` | The educator's pending answer, written by the panel's server |

Ki writes and reads these; nothing else does. The panel server
(`panel/server.mjs`) renders them at `127.0.0.1:4400`. Deleting the
folder loses the settled strip and any pending answer; Ki rebuilds the
current ask on its next turn.
