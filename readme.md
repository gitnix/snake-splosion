# Snake Splosion

![Snake Splosion Gameplay](snake_splosion.gif)

### Drop in/out Multiplayer Snake Game with AI

Play it on https://www.zingzoop.com/

1.  Eat apples to grow your snake, raise your score, and spawn mines!
2.  Avoid the mines!
3.  Slither over the detonators to clear mines!

- Use Arrow Keys, WASD, or IJKL to move
- Type `c` to focus the chat bar

Snake names are assigned randomly and a random picture is fetched based on the snake name.

## Setup

### Visual Studio Code:

To start client and server locally:

- Bring up the command palette `ctrl-shift-p`(windows) `cmd-shift-p` (mac)
- Type `Run Task` and press Enter
- Choose `Start Snake`
- Press `enter` (Continue without scanning the task output) to continue

Tasks can be stopped manually (though you don't really need to [see below]) by bringing up the command palette and typing `Terminate Task` and then choosing the client or server

You can also close Visual Studio Code to terminate the tasks

## Editable Files

These files can be easily edited to adjust game variables

- server/constants.js
- server/initial_game_state.js
- client/constants.js

## Assests

Client assets are located in:

- client/assets
