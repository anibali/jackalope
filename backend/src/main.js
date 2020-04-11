import { ArgumentParser } from 'argparse';
import cors from 'cors';
import express from 'express';
import path from 'path';
import createGameServer from './createGameServer';


const parseArgs = (argv) => {
  const parser = new ArgumentParser({
    // TODO: Program details like version, description, etc
  });

  parser.addArgument(['-p', '--port'], {
    help: 'server port',
    defaultValue: process.env.PORT || 2567,
  });

  return parser.parseArgs(argv.slice(2));
};


// Server main function
export default (argv) => {
  const args = parseArgs(argv);

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.resolve(__dirname, '..', '..', 'frontend', 'dist')));

  const gameServer = createGameServer(app);
  gameServer.listen(args.port).then(() => {
    console.log(`Game server listening on ws://localhost:${args.port}`);
  });
};
