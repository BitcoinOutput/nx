import { join } from 'path';
import { tmpdir } from 'os';
import {
  mkdtempSync,
  readFile,
  outputFile,
  rmSync,
  emptyDirSync,
} from 'fs-extra';
import { joinPathFragments } from '../path';
import { appendFileSync, writeFileSync } from 'fs';

type NestedFiles = {
  [fileName: string]: string;
};

export class TempFs {
  readonly tempDir: string;
  constructor(private dirname: string, overrideWorkspaceRoot = true) {
    this.tempDir = mkdtempSync(join(tmpdir(), this.dirname));
    if (overrideWorkspaceRoot) {
      process.env.NX_WORKSPACE_ROOT_PATH = this.tempDir;
    }
  }

  async createFiles(fileObject: NestedFiles) {
    await Promise.all(
      Object.keys(fileObject).map(async (path) => {
        await this.createFile(path, fileObject[path]);
      })
    );
  }

  async createFile(filePath: string, content: string) {
    await outputFile(joinPathFragments(this.tempDir, filePath), content);
  }

  async readFile(filePath: string): Promise<string> {
    return await readFile(filePath, 'utf-8');
  }

  appendFile(filePath: string, content: string) {
    appendFileSync(joinPathFragments(this.tempDir, filePath), content);
  }

  writeFile(filePath: string, content: string) {
    writeFileSync(joinPathFragments(this.tempDir, filePath), content);
  }

  cleanup() {
    rmSync(this.tempDir, { recursive: true });
  }

  reset() {
    emptyDirSync(this.tempDir);
  }
}
