// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Update, UpdateOptions, VersionsMap} from './update';
import {GitHubFileContents} from '../github';
import {logger} from '../util/logger';

export class PubspecYaml implements Update {
  path: string;
  changelogEntry: string;
  version: string;
  versions?: VersionsMap;
  packageName: string;
  create: boolean;
  contents?: GitHubFileContents;

  constructor(options: UpdateOptions) {
    this.create = false;
    this.path = options.path;
    this.changelogEntry = options.changelogEntry;
    this.version = options.version;
    this.packageName = options.packageName;
    this.contents = options.contents;
  }

  updateContent(content: string): string {
    const oldVersion = content.match(/version: ([0-9.]+)\+?([0-9]*$)/);
    let buildNumber = '';

    if (oldVersion) {
      buildNumber = `${oldVersion[2]}`;
      if (buildNumber.length > 0) {
        buildNumber = `+${buildNumber}`;
        logger.info(
          `updating ${this.path} from ${oldVersion[1]}${buildNumber} to ${this.version}${buildNumber}`
        );
      } else {
        logger.info(
          `updating ${this.path} from ${oldVersion[1]} to ${this.version}`
        );
      }
    }
    return content.replace(
      /version: ([0-9.]+)\+?([0-9]*$)/,
      `version: ${this.version}${buildNumber}`
    );
  }
}
