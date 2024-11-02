

/*************************************************************************************
*
*  # SYNTAX
*  let fs = pinokio.fs("https://github.com/cocktailpeanut/automatic1111.pinokio.git")
*
*  await fs.writeFile("abc.txt", "hello world")
*
*  fs.uri(<bin|api>, path)
*
*  # EXAMPLES
*  fs.uri("api", "sfsdfs")
*  fs.uri("api", "https://github.com/cocktailpeanut/llamacpp.pinokio.git/icon.png")
*  fs.uri("bin", "python/bin")
*
*************************************************************************************/

declare class FS {
  /**
   * The URL of the parent frame
   */
  constructor(httpuri: string, drive: string, path: string);
  uri: string;
  drive: string;
  path: string;

  /**
   * Run a file system method
   * @param method The method name
   * @param params The method parameters
   */
  run(method: string, ...params: any[]): Promise<any>;

  /**
   * Get the URL of a file system resource
   * @param path The file system path
   */
  url(path: string): string;

  /**
   * Clone a repository
   * @param args The clone arguments
   */
  clone(...args: any[]): Promise<any>;

  /**
   * Pull a repository
   * @param args The pull arguments
   */
  pull(...args: any[]): Promise<any>;

  /**
   * Append to a file
   * @param args The appendFile arguments
   */
  appendFile(...args: any[]): Promise<any>;

  /**
   * Read a file
   * @param args The readFile arguments
   */
  readFile(...args: any[]): Promise<any>;

  /**
   * Write a file
   * @param args The writeFile arguments
   */
  writeFile(...args: any[]): Promise<any>;

  /**
   * Test if a file exists
   * @param args The access arguments
   */
  access(...args: any[]): Promise<any>;

  /**
   * Copy a file
   * @param args The cp arguments
   */
  cp(...args: any[]): Promise<any>;

  /**
   * Copy a file
   * @param args The copyFile arguments
   */
  copyFile(...args: any[]): Promise<any>;

  /**
   * Test if a file exists
   * @param args The exists arguments
   */
  exists(...args: any[]): Promise<any>;

  /**
   * Create a hard link
   * @param args The link arguments
   */
  link(...args: any[]): Promise<any>;

  /**
   * Get the file stats
   * @param args The lstat arguments
   */
  lstat(...args: any[]): Promise<any>;

  /**
   * Create a directory
   * @param args The mkdir arguments
   */
  mkdir(...args: any[]): Promise<any>;

  /**
   * List the files in a directory
   * @param args The readdir arguments
   */
  readdir(...args: any[]): Promise<any>;

  /**
   * Remove a directory
   * @param args The rmdir arguments
   */
  rmdir(...args: any[]): Promise<any>;

  /**
   * Read the value of a symbolic link
   * @param args The readlink arguments
   */
  readlink(...args: any[]): Promise<any>;

  /**
   * Remove a file
   * @param args The rm arguments
   */
  rm(...args: any[]): Promise<any>;

  /**
   * Rename a file
   * @param args The rename arguments
   */
  rename(...args: any[]): Promise<any>;

  /**
   * Get the file stats
   * @param args The stat arguments
   */
  stat(...args: any[]): Promise<any>;

  /**
   * Get the file system stats
   * @param args The statfs arguments
   */
  statfs(...args: any[]): Promise<any>;

  /**
   * Create a symbolic link
   * @param args The symlink arguments
   */
  symlink(...args: any[]): Promise<any>;

  /**
   * Truncate a file
   * @param args The truncate arguments
   */
  truncate(...args: any[]): Promise<any>;

  /**
   * Remove a file
   * @param args The unlink arguments
   */
  unlink(...args: any[]): Promise<any>;

  /**
   * Set the file times
   * @param args The utimes arguments
   */
  utimes(...args: any[]): Promise<any>;
}

class RPC {
  constructor(url: string);

  status(rpc: any): Promise<any>;

  stop(rpc: any): void;

  run(rpc: any, ondata: (data: any) => void): Promise<void>;

  respond(response: any): void;
}

declare module 'pinokiojs' {
  export default class Pinokio {
    /**
     * The URL of the parent frame
     */
    url: {
      http: string;
      ws: string;
    };

    /**
     * @param options - The options for the Pinokio instance
     */
    constructor(options?: {
      http?: string;
      ws?: string;
    });

    /**
     * Create a new FS instance
     * @param drive - The drive to use
     * @param path - The path to use
     * @returns A new FS instance
     */
    fs(drive: string, path: string): FS;

    /**
     * Create a new RPC instance
     * @returns A new RPC instance
     */
    rpc(): RPC;

    /**
     * Get the port number used by the Pinokio server
     * @returns The port number used by the Pinokio server
     */
    port(): Promise<number>;
  }

}
