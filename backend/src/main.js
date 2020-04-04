import { ArgumentParser } from 'argparse';

import createGameServer from './createGameServer';


const parseArgs = (argv) => {
  const parser = new ArgumentParser({
    // TODO: Program details like version, description, etc
  });

  parser.addArgument(['-p', '--port'], {
    help: 'server port',
    defaultValue: 2567,
  });

  return parser.parseArgs(argv.slice(2));
};


// Server main function
export default (argv) => {
  const args = parseArgs(argv);

  const gameServer = createGameServer();
  gameServer.listen(args.port).then(() => {
    console.log(`Listening on ws://localhost:${args.port}`);
  });
};
