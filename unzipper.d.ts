declare module 'unzipper' {
  import { Writable } from 'stream';

  interface ExtractOptions {
    path: string;
  }

  interface ExtractStream extends Writable {
    promise(): Promise<void>;
  }

  interface Extract {
    (options: ExtractOptions): ExtractStream;
  }

  interface Unzipper {
    Extract: Extract;
  }

  const unzipper: Unzipper;
  export = unzipper;
}

