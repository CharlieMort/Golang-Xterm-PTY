import '@xterm/xterm/css/xterm.css';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { AttachAddon } from '@xterm/addon-attach';

const term = new Terminal({
  cursorBlink: true,
  fontSize: 14,
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  theme: {
    background: '#1e1e1e',
    foreground: '#d4d4d4',
  }
});

const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

// Mount to DOM
term.open(document.getElementById('terminal')!);
fitAddon.fit();

// Resize on window resize
window.addEventListener('resize', () => fitAddon.fit());

const ws = new WebSocket('ws://localhost:3000/ws')
const attachAddon = new AttachAddon(ws);
term.loadAddon(attachAddon);



// Write some output
// term.writeln('Welcome to my terminal!');
// term.writeln('');

// // Handle input
// let input = '';
// term.write('$ ');

// term.onData(data => {
//   const code = data.charCodeAt(0);

//   if (code === 13) {          // Enter
//     term.writeln('');
//     handleCommand(input.trim());
//     input = '';
//     term.write('$ ');
//   } else if (code === 127) {  // Backspace
//     if (input.length > 0) {
//       input = input.slice(0, -1);
//       term.write('\b \b');
//     }
//   } else {
//     input += data;
//     term.write(data);
//   }
// });

// function handleCommand(cmd: string) {
//   switch (cmd) {
//     case 'help':
//       term.writeln('Available commands: help, hello, clear');
//       break;
//     case 'hello':
//       term.writeln('Hello, World!');
//       break;
//     case 'clear':
//       term.clear();
//       break;
//     case '':
//       break;
//     default:
//       term.writeln(`Command not found: ${cmd}`);
//   }
// }