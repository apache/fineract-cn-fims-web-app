/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
*/

module.exports = {
  "allowedPackages": [
    {
      "name": "xmldom",
      "reason": "License offers option between LGPL or MIT(https://github.com/jindw/xmldom/blob/master/LICENSE)"
    },
    {
      "name": "css-select",
      "reason": "BSD-2-Clause license"
    },
    {
      "name": "css-what",
      "reason": "BSD-2-Clause license"
    },
    {
      "name": "entities",
      "reason": "BSD-2-Clause license"
    },
    {
      "name": "spdx-expression-parse",
      "reason": "Uses CC-BY-3.0 and therefore added to NOTICE file"
    },
    {
      "name": "spdx-exceptions",
      "reason": "Uses CC-BY-3.0 and therefore added to NOTICE file"
    },
    {
      "name": "caniuse-db",
      "reason": "Uses CC-BY-4.0 and therefore added to NOTICE file"
    }
  ],
  "disallowedPackages": [],
  "allowedLicenses": [
    "MIT",
    "(MIT AND BSD-3-Clause)",
    "(MIT AND Zlib)",
    "MIT/X11",
    "ISC",
    "Apache-2.0",
    "Apache version 2.0",
    "BSD",
    "BSD-like",
    "BSD-2-Clause",
    "BSD-3-Clause",
    "WTFPL",
    "JSF",
    "Unlicense",
    "Public Domain",
    "CC0-1.0"
  ],
  "strictMode": true
};
