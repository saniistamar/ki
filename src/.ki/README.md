# .ki/

Ki's panel state. Two files, all machinery:

| File | Holds |
| --- | --- |
| `ask.json` | The current ask the panel shows. Ki overwrites it each turn |
| `settled.json` | One line per ask the educator settled in chat — what, the educator's word, when |

Ki writes and reads these; nothing else does. The panel takes no
input: the educator answers in the harness chat. The panel server
(`panel/server.mjs`) renders the state at `127.0.0.1:4400`. Deleting
the folder loses the settled strip; Ki rebuilds the current ask on its
next turn.
