/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

var ICAL = ICAL || {};
ICAL.helpers = {
    initState: function initState(aLine, aLineNr) {
        return {
            buffer: aLine,
            line: aLine,
            lineNr: aLineNr,
            character: 0,
            currentData: null,
            parentData: []
        };
    },

    initComponentData: function initComponentData(aName) {
        return { name: aName, type: "COMPONENT", value: [] };
    },

    dumpn: function() {
      if (typeof(console) !== 'undefined' && 'log' in console) {
          ICAL.helpers.dumpn = function consoleDumpn(input) {
              return console.log(input);
          }
      } else {
          ICAL.helpers.dumpn = function geckoDumpn(input) {
              dump(input + '\n');
          }
      }

      return ICAL.helpers.dumpn(arguments[0]);
    },

    mixin: function (obj, data) {
        if (data) {
            for (var k in data) {
                obj[k] = data[k];
            }
        }
        return obj;
    },

    unfoldline: function unfoldline(aState) {
        // Section 3.1
        // if the line ends with a CRLF
        // and the next line starts with a LINEAR WHITESPACE (space, htab, ...)

        // then remove the CRLF and the whitespace to unsplit the line
        var moreLines = true;
        var line = "";

        while (moreLines) {
            moreLines = false;
            var pos = aState.buffer.search(/\r?\n/);
            if (pos > -1) {
                var len = (aState.buffer[pos] == "\r" ? 2 : 1);
                var nextChar = aState.buffer.substr(pos + len, 1)
                if (nextChar.match(/^[ \t]$/)) {
                    moreLines = true;
                    line += aState.buffer.substr(0, pos);
                    aState.buffer = aState.buffer.substr(pos + len + 1);
                } else {
                    // We're at the end of the line, copy the found chunk
                    line += aState.buffer.substr(0, pos);
                    aState.buffer = aState.buffer.substr(pos + len);
                }
            } else {
                line += aState.buffer;
                aState.buffer = "";
            }
        }
        return line;
    },

    foldline: function foldline(aLine) {
        var result = "";
        var line = aLine || "";

        while (line.length) {
            result += ICAL.newLineChar + " " + line.substr(0, ICAL.foldLength);
            line = line.substr(ICAL.foldLength);
        }
        return result.substr(ICAL.newLineChar.length + 1);
    },

    ensureKeyExists: function (obj, key, defvalue) {
        if (!(key in obj)) {
            obj[key] = defvalue;
        }
    },

    hasKey: function (obj, key) {
        return (obj && key in obj && obj[key]);
    },

    pad2: function pad(data) {
        return ("00" + data).substr(-2);
    },

    trunc: function trunc(number) {
        return (number < 0 ? Math.ceil(number) : Math.floor(number));
    }
};