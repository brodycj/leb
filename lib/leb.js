// Copyright 2012 The Obvious Corporation.

/*
 * leb: LEB128 utilities.
 */


/*
 * Modules used
 */

"use strict";

var bits = require("./bits");
var bufs = require("./bufs");


/*
 * Module variables
 */

/** The minimum possible 32-bit signed int. */
var MIN_INT32 = -0x100000000;

/** The maximum possible 32-bit signed int. */
var MAX_INT32 = 0x7fffffff;

/** The minimum possible 64-bit signed int. */
var MIN_INT64 = -0x10000000000000000;

/** The maximum possible 64-bit signed int. */
var MAX_INT64 = 0x7fffffffffffffff;


/*
 * Helper functions
 */

/**
 * Determines the number of bits required to encode the number
 * represented in the given buffer as a signed value. The buffer is
 * taken to represent a signed number in little-endian form.
 *
 * The number of bits to encode is the (zero-based) bit number of the
 * highest-order non-sign-matching bit, plus two. For example:
 *
 *   11111011 01110101
 *   high          low
 *
 * The sign bit here is 1 (that is, it's a negative number). The highest
 * bit number that doesn't match the sign is bit #10 (where the lowest-order
 * bit is bit #0). So, we have to encode at least 12 bits total.
 *
 * As a special degenerate case, the numbers 0 and -1 each require just one bit.
 */
function signedBitCount(buffer) {
  return bits.highOrder(bits.getSign(buffer)^1, buffer) + 2;
}

/**
 * Determines the number of bits required to encode the number
 * represented in the given buffer as an unsigned value. The buffer is
 * taken to represent an unsigned number in little-endian form.
 *
 * The number of bits to encode is the (zero-based) bit number of the
 * highest-order 1 bit, plus one. For example:
 *
 *   00011000 01010011
 *   high          low
 *
 * The highest-order 1 bit here is bit #12 (where the lowest-order bit
 * is bit #0). So, we have to encode at least 13 bits total.
 *
 * As a special degenerate case, the number 0 requires 1 bit.
 */
function unsignedBitCount(buffer) {
  var result = bits.highOrder(1, buffer) + 1;
  return result ? result : 1;
}

/**
 * Gets the byte-length of the value encoded in the given buffer at
 * the given index.
 */
function encodedLength(encodedBuffer, index) {
  var result = 0;

  while (encodedBuffer[index + result] >= 0x80) {
    result++;
  }

  result++; // to account for the last byte

  if ((index + result) > encodedBuffer.length) {
    throw new Error("Bogus encoding");
  }

  return result;
}


/*
 * Exported bindings
 */

function encodeIntBuffer(buffer) {
  var sign = bits.getSign(buffer);
  var bitCount = signedBitCount(buffer);
  var byteCount = Math.ceil(bitCount / 7);
  var result = bufs.alloc(byteCount);

  for (var i = 0; i < byteCount; i++) {
    var payload = bits.extract(buffer, i * 7, 7, sign);
    result[i] = payload | 0x80;
  }

  // Mask off the top bit of the last byte, to indicate the end of the
  // encoding.
  result[byteCount - 1] &= 0x7f;
  return result;
}

function decodeIntBuffer(encodedBuffer, index) {
  index = (index === undefined) ? 0: index;

  var length = encodedLength(encodedBuffer, index);
  var bitLength = length * 7;
  var byteLength = Math.ceil(bitLength / 8);
  var result = bufs.alloc(byteLength);
  var outIndex = 0;

  result.fill(0);

  while (length > 0) {
    bits.inject(result, outIndex, 7, encodedBuffer[index]);
    outIndex += 7;
    index++;
    length--;
  }

  var lastByte = result[byteLength - 1];

  // Sign-extend the last byte.
  var endBit = outIndex % 8;
  if (endBit !== 0) {
    var shift = 32 - endBit; // 32 because JS bit ops work on 32-bit ints.
    lastByte = result[byteLength - 1] = ((lastByte << shift) >> shift) & 0xff;
  }

  // Slice off any superfluous bytes, that is, ones that add no meaningful
  // bits (because the value would be the same if they were removed).
  var signBit = lastByte >> 7;
  var signByte = signBit * 0xff;
  while ((byteLength > 1) && 
         (result[byteLength - 1] === signByte) &&
         ((result[byteLength - 2] >> 7) === signBit)) {
    byteLength--;
  }
  result = bufs.resize(result, byteLength);

  return { value: result, endIndex: index };
}

function encodeInt32(num) {
  var buf = bufs.alloc(4);

  buf.writeInt32LE(num, 0);

  var result = encodeIntBuffer(buf);

  bufs.free(buf);
  return result;
}

function decodeInt32(encodedBuffer, index) {
  var result = decodeIntBuffer(encodedBuffer, index);
  var parsed = bufs.readInt(result.value);
  var value = parsed.value;

  bufs.free(result.value);

  if ((value < MIN_INT32) || (value > MAX_INT32)) {
    throw new Error("Result out of range");
  }

  return { value: value, endIndex: result.endIndex };
}

function encodeInt64(num) {
  var buf = bufs.alloc(8);

  bufs.writeUInt64(num, buf);

  var result = encodeIntBuffer(buf);

  bufs.free(buf);
  return result;
}

function decodeInt64(encodedBuffer, index) {
  var result = decodeIntBuffer(encodedBuffer, index);
  var parsed = bufs.readInt(result.value);
  var value = parsed.value;

  bufs.free(result.value);

  if ((value < MIN_INT64) || (value > MAX_INT64)) {
    throw new Error("Result out of range");
  }

  return { value: value, endIndex: result.endIndex, lossy: parsed.lossy };
}

function encodeUintBuffer(buffer) {
}

function decodeUintBuffer(encodedBuffer, index) {
}

function encodeUint32(num) {
}

function decodeUint32(buffer, index) {
}

function encodeUint64(num) {
}

function decodeUint64(buffer, index) {
}

module.exports = {
  decodeInt32: decodeInt32,
  decodeInt64: decodeInt64,
  decodeIntBuffer: decodeIntBuffer,
  decodeUint32: decodeUint32,
  decodeUint64: decodeUint64,
  decodeUintBuffer: decodeUintBuffer,
  encodeInt32: encodeInt32,
  encodeInt64: encodeInt64,
  encodeIntBuffer: encodeIntBuffer,
  encodeUint32: encodeUint32,
  encodeUint64: encodeUint64,
  encodeUintBuffer: encodeUintBuffer,
};
