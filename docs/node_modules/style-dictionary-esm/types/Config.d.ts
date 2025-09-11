/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import type { Parser } from './Parser'
import type { Transform } from './Transform'
import type { TransformGroup } from './TransformGroup'
import type { Filter } from './Filter'
import type { FileHeader } from './FileHeader'
import type { Formatter } from './Format'
import type { Action } from './Action'
import type { Platform } from './Platform'
import type { DesignTokens } from './DesignToken'

export interface Config {
  parsers?: Parser[]
  transform?: Record<string, Transform>
  transformGroup?: Record<string, TransformGroup['transforms']>
  format?: Record<string, Formatter>
  filter?: Record<string, Filter['matcher']>
  fileHeader?: Record<string, FileHeader>
  action?: Record<string, Action>
  include?: string[]
  source?: string[]
  tokens?: DesignTokens
  properties?: DesignTokens
  platforms: Record<string, Platform>
}
